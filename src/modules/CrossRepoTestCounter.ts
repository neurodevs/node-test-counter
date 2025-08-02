import fs from 'fs'
import path from 'path'
import SpruceError from '../errors/SpruceError'

export default class CrossRepoTestCounter implements TestCounter {
    public static Class?: TestCounterConstructor

    private repoPaths!: string[]
    private requirePatterns!: string[]
    private excludePatterns!: string[]
    private excludeNodeModules!: boolean

    private currentRepoPath!: string
    private currentFilePath!: string

    private TEST_PATTERNS = [/@test\(/g]
    private EXTENSIONS = ['.ts', '.tsx']

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public async countTestsIn(repoPaths: string[], options?: CountOptions) {
        const {
            requirePatterns,
            excludePatterns,
            excludeNodeModules = true,
        } = options ?? {}

        this.repoPaths = repoPaths
        this.requirePatterns = requirePatterns ?? []
        this.excludePatterns = excludePatterns ?? []
        this.excludeNodeModules = excludeNodeModules

        return await this.calculateResults()
    }

    private async calculateResults() {
        const results: TestCounterResult = {
            total: 0,
            perRepo: {},
        }

        for (const repoPath of this.repoPaths) {
            this.currentRepoPath = repoPath
            this.throwIfRepoDoesNotExist()

            const count = await this.countTestsInRepo()

            results.perRepo[repoPath] = count
            results.total += count
        }

        return results
    }

    private throwIfRepoDoesNotExist() {
        if (this.currentRepoDoesNotExist) {
            throw new SpruceError({
                code: 'REPO_NOT_FOUND',
                repoPath: this.currentRepoPath,
            })
        }
    }

    private get currentRepoDoesNotExist() {
        return !fs.existsSync(this.currentRepoPath)
    }

    private async countTestsInRepo() {
        const filePaths = await this.walk(this.currentRepoPath)

        let total = 0

        for (const filePath of filePaths) {
            this.currentFilePath = filePath

            if (this.shouldIncludeCurrentFile) {
                total += await this.countTestsInFile()
            }
        }

        return total
    }

    private async walk(dir: string) {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true })

        const nestedFilePaths: string[][] = await Promise.all(
            entries.map((entry) => {
                const fullPath = path.resolve(dir, entry.name)
                return entry.isDirectory() ? this.walk(fullPath) : [fullPath]
            })
        )

        return nestedFilePaths.flat()
    }

    private get shouldIncludeCurrentFile() {
        return (
            this.hasValidFileExtension &&
            this.satisfiesRequirePatterns &&
            this.satisfiesExcludePatterns &&
            this.satisfiesNodeModules
        )
    }

    private get hasValidFileExtension() {
        return this.EXTENSIONS.some((ext) => this.currentFilePath.endsWith(ext))
    }

    private get satisfiesRequirePatterns() {
        return (
            this.requirePatterns.length == 0 ||
            this.requirePatterns.some((pattern) =>
                this.currentFilePath.includes(pattern)
            )
        )
    }

    private get satisfiesExcludePatterns() {
        return !this.excludePatterns.some((pattern) =>
            this.currentFilePath.includes(pattern)
        )
    }

    private get satisfiesNodeModules() {
        return !(
            this.excludeNodeModules &&
            this.currentFilePath.includes('node_modules')
        )
    }

    private async countTestsInFile() {
        const content = await this.readCurrentFile()

        return this.TEST_PATTERNS.reduce((acc, regex) => {
            return acc + (content.match(regex) || []).length
        }, 0)
    }

    private async readCurrentFile() {
        return await fs.promises.readFile(this.currentFilePath, 'utf-8')
    }
}

export interface TestCounter {
    countTestsIn(
        repoPaths: string[],
        options?: CountOptions
    ): Promise<TestCounterResult>
}

export type TestCounterConstructor = new () => TestCounter

export interface CountOptions {
    requirePatterns?: string[]
    excludePatterns?: string[]
    excludeNodeModules?: boolean
}

export interface TestCounterResult {
    total: number
    perRepo: Record<string, number>
}
