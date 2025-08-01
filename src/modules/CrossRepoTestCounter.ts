import fs from 'fs'
import path from 'path'
import SpruceError from '../errors/SpruceError'

export default class CrossRepoTestCounter implements TestCounter {
    public static Class?: TestCounterConstructor

    private TEST_PATTERNS = [/@test\(/g]
    private EXTENSIONS = ['.ts', '.tsx']

    private currentRepoPath!: string

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public async countTestsIn(repoPaths: string[], options?: CountOptions) {
        const { excludeNodeModules = true, excludePatterns } = options ?? {}

        const results: TestCounterResult = {
            total: 0,
            perRepo: {},
        }

        for (const repoPath of repoPaths) {
            this.currentRepoPath = repoPath
            this.throwIfRepoDoesNotExist()

            const count = await this.countTestsInRepo({
                excludeNodeModules,
                excludePatterns: excludePatterns ?? [],
            })

            results.perRepo[repoPath] = count
            results.total += count
        }

        return results
    }

    private throwIfRepoDoesNotExist() {
        if (!fs.existsSync(this.currentRepoPath)) {
            throw new SpruceError({
                code: 'REPO_NOT_FOUND',
                repoPath: this.currentRepoPath,
            })
        }
    }

    private async countTestsInRepo(options: Required<CountOptions>) {
        const { excludeNodeModules, excludePatterns } = options

        const files = await this.walk(this.currentRepoPath)

        let total = 0

        for (const file of files) {
            const isValidFileType = this.EXTENSIONS.some((ext) =>
                file.endsWith(ext)
            )

            const shouldExclude =
                (excludeNodeModules && file.includes('node_modules')) ||
                excludePatterns?.some((pattern) => file.includes(pattern))

            if (isValidFileType && !shouldExclude) {
                total += await this.countTestsInFile(file)
            }
        }

        return total
    }

    private async countTestsInFile(filePath: string) {
        const content = await fs.promises.readFile(filePath, 'utf-8')

        return this.TEST_PATTERNS.reduce((acc, regex) => {
            return acc + (content.match(regex) || []).length
        }, 0)
    }

    private async walk(dir: string) {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true })

        const files: string[][] = await Promise.all(
            entries.map((entry) => {
                const res = path.resolve(dir, entry.name)
                return entry.isDirectory() ? this.walk(res) : [res]
            })
        )

        return files.flat()
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
    excludePatterns?: string[]
    excludeNodeModules?: boolean
}

export interface TestCounterResult {
    total: number
    perRepo: Record<string, number>
}
