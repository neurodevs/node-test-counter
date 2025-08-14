#!/usr/bin/env node

/**
 * CLI for @neurodevs/node-test-counter
 *
 * Usage:
 *   node-test-counter                    # scan current working directory
 *   node-test-counter <path> [...]       # scan one or more repo paths
 *   node-test-counter --help             # usage info
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import CrossRepoTestCounter, {
    TestCounterResult,
} from './modules/CrossRepoTestCounter'

export interface CliOptions {
    repoPaths: string[]
    help: boolean
}

function printHelp() {
    const help = `
node-test-counter — count test cases across repos.

Usage:
  node-test-counter
    Scan the current working directory as a single repo.

  node-test-counter <path> [<path> ...]
    Scan one or more repositories at the given paths.

Options:
  -h, --help      Show this help and exit.

Notes:
  • Parameterless run scans the current working directory.
  • Paths may be absolute or relative; they must exist locally.
`
    process.stdout.write(help.trimStart() + '\n')
}

function parseArgs(argv: string[]) {
    const opts: CliOptions = { help: false, repoPaths: [] }

    for (const a of argv) {
        if (a === '-h' || a === '--help') {
            opts.help = true
        } else if (a.startsWith('-')) {
            throw new Error(`Unknown option: ${a}`)
        } else {
            opts.repoPaths.push(a)
        }
    }

    if (opts.repoPaths.length === 0) {
        const cwd = process.cwd()
        const subdirs = fs
            .readdirSync(cwd, { withFileTypes: true })
            .filter((d) => d.isDirectory())
            .map((d) => path.resolve(cwd, d.name))
        opts.repoPaths.push(...subdirs)
    }

    return opts
}

function resolvePaths(pathsIn: string[]) {
    const cwd = process.cwd()
    const paths = (pathsIn.length > 0 ? pathsIn : [cwd]).map((p) =>
        path.resolve(cwd, p)
    )
    const missing = paths.filter((p) => !fs.existsSync(p))
    if (missing.length > 0) {
        throw new Error(`Path(s) not found: ${missing.join(', ')}`)
    }
    return paths
}

function printHuman(result: TestCounterResult) {
    const lines: string[] = []
    lines.push(`Total tests: ${result.total}`)
    const entries = Array.from(result.perRepoOrdered.entries())

    for (const [repo, count] of entries) {
        lines.push(`${count.toString().padStart(6)}  ${repo}`)
    }
    process.stdout.write(lines.join('\n') + '\n')
}

async function main() {
    try {
        const opts = parseArgs(process.argv.slice(2))
        if (opts.help) {
            printHelp()
            return
        }

        const repoPaths = resolvePaths(opts.repoPaths)
        const counter = CrossRepoTestCounter.Create()
        const result = await counter.countTestsIn(repoPaths)

        printHuman(result)
    } catch (err: any) {
        const msg =
            err && typeof err.message === 'string' ? err.message : String(err)
        process.stderr.write(`Error: ${msg}\n`)
        process.exitCode = 1
    }
}

const isMain =
    (typeof __filename !== 'undefined' &&
        require.main &&
        require.main.filename === __filename) ||
    require.main === module

if (isMain) {
    void main()
}

export {}
