import { test } from '@neurodevs/node-tdd'

export default class ModuleToIgnore {
    @test()
    protected static async testThatShouldBeIgnoredBecauseInTestDataDir() {}
}
