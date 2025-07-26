import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
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

    private static CrossRepoTestCounter() {
        return CrossRepoTestCounter.Create()
    }
}
