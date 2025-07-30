import { test } from '@sprucelabs/test-utils'

export default class ModuleWithThreeTests {
    @test()
    protected static async test1() {}

    @test()
    protected static async test2() {}

    @test()
    protected static async test3() {}
}
