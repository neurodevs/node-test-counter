import { test } from '@sprucelabs/test-utils'

export default class ModuleWithOneTest {
    @test()
    protected static async test1() {}
}
