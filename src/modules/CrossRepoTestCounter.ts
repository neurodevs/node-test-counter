import fs from 'fs'
import path from 'path'
import SpruceError from '../errors/SpruceError'

export default class CrossRepoTestCounter implements TestCounter {
    public static Class?: TestCounterConstructor

    private TEST_PATTERNS = [/@test\(/g]
    private EXTENSIONS = ['.ts', '.tsx']

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public async countTestsIn(repoPaths: string[]): Promise<TestCounterResult> {
        const results: TestCounterResult = {
            total: 0,
            perRepo: {},
        }

        for (const repoPath of repoPaths) {
            try {
                const count = await this.countTestsInRepo(repoPath)
                results.perRepo[repoPath] = count
                results.total += count
            } catch (error: any) {
                throw new SpruceError({
                    code: 'REPO_NOT_FOUND',
                    repoPath,
                    originalError: error,
                })
            }
        }

        return results
    }

    private async countTestsInFile(filePath: string): Promise<number> {
        const content = await fs.promises.readFile(filePath, 'utf-8')

        return this.TEST_PATTERNS.reduce((acc, regex) => {
            return acc + (content.match(regex) || []).length
        }, 0)
    }

    private async walk(dir: string): Promise<string[]> {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true })

        const files = await Promise.all(
            entries.map((entry) => {
                const res = path.resolve(dir, entry.name)
                return entry.isDirectory() ? this.walk(res) : [res]
            })
        )

        return files.flat()
    }

    private async countTestsInRepo(repoPath: string): Promise<number> {
        const files = await this.walk(repoPath)

        const testFiles = files.filter((file) =>
            this.EXTENSIONS.includes(path.extname(file))
        )

        let total = 0

        for (const file of testFiles) {
            total += await this.countTestsInFile(file)
        }

        return total
    }
}

export interface TestCounter {
    countTestsIn(repoPaths: string[]): Promise<TestCounterResult>
}

export type TestCounterConstructor = new () => TestCounter

export interface TestCounterResult {
    total: number
    perRepo: Record<string, number>
}
