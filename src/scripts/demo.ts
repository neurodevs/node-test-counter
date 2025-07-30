import CrossRepoTestCounter from '../modules/CrossRepoTestCounter'

async function main() {
    const repoPaths = [
        '../node-autocloner/src',
        '../node-autoupgrader/src',
        '../node-biometrics/src',
        '../node-biosensors/src',
        '../node-ble/src',
        '../node-causality/src',
        '../node-csv',
        '../node-eeg/src',
        '../node-file-checker/src',
        '../node-file-loader/src',
        '../node-html-loader/src',
        '../node-lsl/src',
        '../node-mangled-names/src',
        '../node-neuropype/src',
        '../node-ppg/src',
        '../node-robotic-arm/src',
        '../node-server-plots/src',
        '../node-signal-processing/src',
        '../node-task-queue/src',
        '../node-xdf/src',
        '../personomic/src',
        '../react-connectivity-graphs/src',
    ]

    const instance = CrossRepoTestCounter.Create()

    const results = await instance.countTestsIn(repoPaths)

    console.log('\n\nTest count results:\n\n', results, '\n\n')
}

main().catch((err) => {
    console.error('Error counting tests:', err)
    process.exit(1)
})
