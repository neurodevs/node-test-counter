import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
    generateId,
} from '@sprucelabs/test-utils'
import CrossRepoTestCounter, {
    CountOptions,
    TestCounter,
    TestCounterResult,
} from '../modules/CrossRepoTestCounter'

export default class CrossRepoTestCounterTest extends AbstractSpruceTest {
    private static instance: TestCounter

    protected static async beforeEach() {
        await super.beforeEach()

        this.instance = this.CrossRepoTestCounter()
    }

    @test()
    protected static async createsInstance() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    @test()
    protected static async throwsIfRepoNotFound() {
        const invalidPath = generateId()

        const err = await assert.doesThrowAsync(async () => {
            await this.instance.countTestsIn([invalidPath])
        })

        errorAssert.assertError(err, 'REPO_NOT_FOUND', {
            repoPath: invalidPath,
        })
    }

    @test()
    protected static async resultEqualsExpected() {
        const result = await this.countTestsIn()

        const expected = this.generateExpectedResult({
            [this.pathRepo1]: 1,
            [this.pathRepo2]: 5,
        })

        this.assertEqual(result, expected)
    }

    @test()
    protected static async hasOptionalExcludeNodeModulesParam() {
        const result = await this.countTestsIn([this.pathRepo3])

        const expected = this.generateExpectedResult({
            [this.pathRepo3]: 0,
        })

        this.assertEqual(result, expected)
    }

    @test()
    protected static async countsIfExcludeNodeModulesIsFalse() {
        const result = await this.countTestsIn([this.pathRepo3], {
            excludeNodeModules: false,
        })

        const expected = this.generateExpectedResult({
            [this.pathRepo3]: 1,
        })

        this.assertEqual(result, expected)
    }

    @test()
    protected static async hasOptionalExcludePatternsParam() {
        const result = await this.countTestsIn([this.pathRepo4], {
            excludePatterns: ['excludedDir', 'excludedModule'],
        })

        const expected = this.generateExpectedResult({
            [this.pathRepo4]: 0,
        })

        this.assertEqual(result, expected)
    }

    @test()
    protected static async hasOptionalRequirePatternsParam() {
        const result = await this.countTestsIn([this.pathRepo5], {
            requirePatterns: ['requiredDir', 'requireMeToo'],
        })

        const expected = this.generateExpectedResult({
            [this.pathRepo5]: 2,
        })

        this.assertEqual(result, expected)
    }

    private static async countTestsIn(
        repoPaths = this.repoPaths,
        options?: CountOptions
    ) {
        return await this.instance.countTestsIn(repoPaths, options)
    }

    private static assertEqual(
        result: TestCounterResult,
        expected: TestCounterResult
    ) {
        assert.isEqualDeep(result, expected, 'Result is not expected!')
    }

    private static generateExpectedResult(perRepo: Record<string, number>) {
        const total = Object.values(perRepo).reduce(
            (sum, count) => sum + count,
            0
        )

        return {
            total,
            perRepo,
            perRepoOrdered: new Map<string, number>(Object.entries(perRepo)),
        } as TestCounterResult
    }

    private static pathRepo1 = './src/__tests__/testData/repo1'
    private static pathRepo2 = './src/__tests__/testData/repo2'
    private static pathRepo3 = './src/__tests__/testData/repo3'
    private static pathRepo4 = './src/__tests__/testData/repo4'
    private static pathRepo5 = './src/__tests__/testData/repo5'

    private static repoPaths = [this.pathRepo1, this.pathRepo2]

    private static CrossRepoTestCounter() {
        return CrossRepoTestCounter.Create()
    }
}
