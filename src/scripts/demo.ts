import path from 'path'
import CrossRepoTestCounter from '../modules/CrossRepoTestCounter'

async function main() {
    const repoPaths = [
        '../node-autocloner/src',
        '../node-autoupgrader/src',
        '../node-biometrics/src',
        '../node-biosensors/src',
        '../node-ble/src',
        '../node-causality/src',
        '../node-csv/src',
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
        '../node-test-counter/src',
        '../node-xdf/src',
        '../react-connectivity-graphs/src',
    ]

    const instance = CrossRepoTestCounter.Create()

    const results = await instance.countTestsIn(repoPaths)

    const simplified: Record<string, number> = {}

    for (const [repoPath, count] of Object.entries(results.perRepo)) {
        const name = path.basename(path.dirname(repoPath))
        simplified[name] = count
    }

    const sortedPerRepo = Object.fromEntries(
        Object.entries(simplified).sort(([a], [b]) => a.localeCompare(b))
    )

    console.log('\n\nTest counts across @neurodevs repos:\n')
    console.log({ total: results.total, perRepo: sortedPerRepo })
    console.log('\n')
}

main().catch((err) => {
    console.error('Error counting tests:', err)
    process.exit(1)
})
