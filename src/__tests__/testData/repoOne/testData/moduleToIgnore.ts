import { test } from '@sprucelabs/test-utils'

export default class ModuleToIgnore {
    @test()
    protected static async testThatShouldBeIgnoredBecauseInTestDataDir() {}
}
