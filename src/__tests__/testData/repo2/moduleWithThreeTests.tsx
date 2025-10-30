import { test } from '@neurodevs/node-tdd'

export default class ModuleWithThreeTests {
    @test()
    protected static async test1() {}

    @test()
    protected static async test2() {}

    @test()
    protected static async test3() {}
}
