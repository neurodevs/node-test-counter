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

        this.assertResultEqualsExpected(result)
    }

    @test()
    protected static async hasOptionalExcludeNodeModulesParam() {
        const repoPaths = [
            ...this.repoPaths,
            './src/__tests__/testData/repoThree',
        ]

        const result = await this.countTestsIn(repoPaths)

        this.assertResultEqualsExpected(result, {
            './src/__tests__/testData/repoThree': 0,
        })
    }

    @test()
    protected static async countsIfExcludeNodeModulesIsFalse() {
        const repoPaths = [
            ...this.repoPaths,
            './src/__tests__/testData/repoThree',
        ]

        const result = await this.countTestsIn(repoPaths, {
            excludeNodeModules: false,
        })

        this.assertResultEqualsExpected(
            result,
            {
                './src/__tests__/testData/repoThree': 1,
            },
            7
        )
    }

    private static async countTestsIn(
        repoPaths = this.repoPaths,
        options?: CountOptions
    ) {
        return await this.instance.countTestsIn(repoPaths, options)
    }

    private static assertResultEqualsExpected(
        result: TestCounterResult,
        perRepo?: Record<string, number>,
        total = 6
    ) {
        assert.isEqualDeep(
            result,
            {
                total,
                perRepo: {
                    './src/__tests__/testData/repoOne': 1,
                    './src/__tests__/testData/repoTwo': 5,
                    ...perRepo,
                },
            },
            'Result is not expected!'
        )
    }

    private static repoPaths = [
        './src/__tests__/testData/repoOne',
        './src/__tests__/testData/repoTwo',
    ]

    private static CrossRepoTestCounter() {
        return CrossRepoTestCounter.Create()
    }
}
