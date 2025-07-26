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
    protected static async createsCrossRepoTestCounterInstance() {
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

    private static CrossRepoTestCounter() {
        return CrossRepoTestCounter.Create()
    }
}
