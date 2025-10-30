import { test } from '@neurodevs/node-tdd'

export default class ExcludedModule {
    @test()
    protected static async testThatShouldBeExcluded() {}
}
