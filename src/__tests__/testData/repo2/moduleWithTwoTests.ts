import { test } from '@neurodevs/node-tdd'

export default class ModuleWithTwoTests {
    @test()
    protected static async test1() {}

    @test()
    protected static async test2() {}
}
