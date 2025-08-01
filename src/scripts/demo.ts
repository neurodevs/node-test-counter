import CrossRepoTestCounter from '../modules/CrossRepoTestCounter'

async function main() {
    const repoPaths = [
        '../node-autocloner',
        '../node-autoupgrader',
        '../node-biometrics',
        '../node-biosensors',
        '../node-ble',
        '../node-causality',
        '../node-csv',
        '../node-eeg',
        '../node-file-checker',
        '../node-file-loader',
        '../node-html-loader',
        '../node-lsl',
        '../node-mangled-names',
        '../node-neuropype',
        '../node-ppg',
        '../node-robotic-arm',
        '../node-server-plots',
        '../node-signal-processing',
        '../node-task-queue',
        '../node-test-counter',
        '../node-xdf',
        '../react-connectivity-graphs',
    ]

    const instance = CrossRepoTestCounter.Create()

    const results = await instance.countTestsIn(repoPaths, {
        requirePatterns: [],
        excludePatterns: ['testData'],
        excludeNodeModules: true,
    })

    const sortedPerRepo = Object.fromEntries(
        Object.entries(results.perRepo).sort(([, a], [, b]) => b - a)
    )

    console.log('\n\nTest counts across @neurodevs repos:\n')
    console.log({ total: results.total, perRepo: sortedPerRepo })
    console.log('\n')
}

main().catch((err) => {
    console.error('Error counting tests:', err)
    process.exit(1)
})
