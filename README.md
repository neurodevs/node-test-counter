# node-test-counter
Count the total number of test cases across repos

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
  - [CrossRepoTestCounter](#crossrepotestcounter)

## Overview

node-test-counter is a lightweight utility for scanning multiple repositories and counting the number of test cases across them. It’s useful for keeping track of testing coverage across a monorepo or ecosystem of packages.

## Installation

Install the package with your preferred package manager (make sure to be in the right directory for your Node project):

`npm install @neurodevs/node-test-counter` 

Or, for example with yarn:

`yarn add @neurodevs/node-test-counter`

## Usage

### CrossRepoTestCounter

The counter works by recursively counting occurrences of `test(` in the specified repoPaths. All repositories must exist locally on your filesystem before running.

```typescript
import { CrossRepoTestCounter } from '@neurodevs/node-test-counter'

const instance = CrossRepoTestCounter.Create()

const repoPaths = [
    '/path/to/repo1',
    '/path/to/repo2',
    ...
]

// Must be in async function
const result = await instance.countTestsIn(repoPaths)
console.log(result)

// {
//   total: 7,
//   perRepo: {
//     '/path/to/repo1': 3,
//     '/path/to/repo2': 4,
//     ...
//   }
//   perRepoOrdered: Map(2) {
//     '/path/to/repo1' => 4,
//     '/path/to/repo2' => 3,
//     ...
//   }
// }
```
