import { test } from '@neurodevs/node-tdd'

export default class ModuleWithOneTest {
    @test()
    protected static async test1() {}
}
