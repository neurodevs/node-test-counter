import {
    CountOptions,
    TestCounter,
    TestCounterResult,
} from '../modules/CrossRepoTestCounter'

export default class FakeTestCounter implements TestCounter {
    public static numCallsToConstructor = 0
    public static callsToCountTestsIn: CallToCountTestIn[] = []

    public fakeResult = {} as TestCounterResult

    public constructor() {
        FakeTestCounter.numCallsToConstructor++
    }

    public async countTestsIn(repoPaths: string[], options?: CountOptions) {
        FakeTestCounter.callsToCountTestsIn.push({ repoPaths, options })
        return this.fakeResult
    }
}

export interface CallToCountTestIn {
    repoPaths: string[]
    options?: CountOptions
}
