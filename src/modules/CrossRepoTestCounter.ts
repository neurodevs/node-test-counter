export default class CrossRepoTestCounter implements TestCounter {
    public static Class?: TestCounterConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }
}

export interface TestCounter {}

export type TestCounterConstructor = new () => TestCounter
