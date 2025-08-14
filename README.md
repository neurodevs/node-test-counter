# node-test-counter
Count the total number of test cases across repos

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
  - [Package Installation](#package-installation)
  - [Global Installation](#global-installation)
- [Usage](#usage)
  - [CLI Usage](#cli-usage)
  - [CrossRepoTestCounter](#crossrepotestcounter)

## Overview

node-test-counter is a lightweight utility for scanning multiple repositories and counting the number of test cases across them. It’s useful for keeping track of testing coverage across a monorepo or ecosystem of packages.

If you install the package globally, there is a CLI that you can use with a simple `count-tests [...]` on the command-line.

## Installation

### Package Installation

For basic usage within a pacakge, install node-test-counter with your preferred package manager (run inside your Node project):

```bash
npm install @neurodevs/node-test-counter
``` 

Or, for example with yarn:

```bash
yarn add @neurodevs/node-test-counter
```

### Global Installation

node-test-counter also comes with a built-in CLI that can be installed globally so you can run it from anywhere without needing a local script. See [CLI Usage](#cli-usage) section for more details.

```bash
npm install -g @neurodevs/node-test-counter
```

Or, with yarn:

```bash
yarn global add @neurodevs/node-test-counter
```

## Usage

### CLI Usage

Once [installed globally](#global-installation), you can run node-test-counter directly from the command line.

If don't pass any args, it will count tests in the current working directory, with results shown for each top-level subdirectory:

```bash
count-tests
```

You can also pass it a list of repos to check:

```bash
count-tests path/to/repo1 path/to/repo2
```

Check the help message with:

```bash
count-tests --help
```

Or:

```bash
count-tests -h
```

### CrossRepoTestCounter

The counter works by recursively counting occurrences of `test(` in the specified repoPaths. All repositories must exist locally on your filesystem before running.

```typescript
import { CrossRepoTestCounter } from '@neurodevs/node-test-counter'

async function main() {
    const instance = CrossRepoTestCounter.Create()

    const repoPaths = [
        '/path/to/repo1',
        '/path/to/repo2',
        // Add more repo paths as needed
    ]

    const result = await instance.countTestsIn(repoPaths)
    console.log(result)

    // Example output:
    // {
    //   total: 7,
    //   perRepo: {
    //     '/path/to/repo1': 3,
    //     '/path/to/repo2': 4
    //   },
    //   perRepoOrdered: Map(2) {
    //     '/path/to/repo2' => 4,
    //     '/path/to/repo1' => 3
    //   }
    // }
}

main().catch((err) => {
    console.error('Error running test counter:', err)
})
```
