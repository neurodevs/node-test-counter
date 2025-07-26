import fs from 'fs'
import SpruceError from '../errors/SpruceError'

export default class CrossRepoTestCounter implements TestCounter {
    public static Class?: TestCounterConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public async countTestsIn(repoPaths: string[]) {
        for (const repoPath of repoPaths) {
            try {
                fs.readFileSync(repoPath, 'utf8')
            } catch (error: any) {
                throw new SpruceError({
                    code: 'REPO_NOT_FOUND',
                    repoPath,
                    originalError: error,
                })
            }
        }
        return {} as TestCounterResult
    }
}

export interface TestCounter {
    countTestsIn(repoPaths: string[]): Promise<TestCounterResult>
}

export type TestCounterConstructor = new () => TestCounter

export interface TestCounterResult {}
