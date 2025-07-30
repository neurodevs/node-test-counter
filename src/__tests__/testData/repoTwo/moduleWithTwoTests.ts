import { test } from '@sprucelabs/test-utils'

export default class ModuleWithTwoTests {
    @test()
    protected static async test1() {}

    @test()
    protected static async test2() {}
}
