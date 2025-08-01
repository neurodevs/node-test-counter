import { test } from '@sprucelabs/test-utils'

export default class ExcludedModule {
    @test()
    protected static async testThatShouldBeExcluded() {}
}
