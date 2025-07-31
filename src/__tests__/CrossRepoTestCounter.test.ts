import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
    generateId,
} from '@sprucelabs/test-utils'
import CrossRepoTestCounter, {
    TestCounter,
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
        const repoPath = generateId()

        const err = await assert.doesThrowAsync(async () => {
            await this.instance.countTestsIn([repoPath])
        })

        errorAssert.assertError(err, 'REPO_NOT_FOUND', {
            repoPath,
        })
    }

    @test()
    protected static async resultEqualsExpected() {
        const repoPaths = [
            './src/__tests__/testData/repoOne',
            './src/__tests__/testData/repoTwo',
        ]

        const result = await this.instance.countTestsIn(repoPaths)

        assert.isEqualDeep(
            result,
            {
                total: 6,
                perRepo: {
                    './src/__tests__/testData/repoOne': 1,
                    './src/__tests__/testData/repoTwo': 5,
                },
            },
            'Result is not expected!'
        )
    }

    private static CrossRepoTestCounter() {
        return CrossRepoTestCounter.Create()
    }
}
