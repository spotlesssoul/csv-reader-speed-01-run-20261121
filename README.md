# csv-reader-speed-01-run-20261121

[![make.fun · CSV Reader Speed](https://make.fun/badge/csv-reader-speed-01-run-20261121.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121)
[![rank](https://make.fun/badge/csv-reader-speed-01-run-20261121/spotlesssoul/csv-reader-speed-01-run-20261121/rank.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121)
[![reward](https://make.fun/badge/csv-reader-speed-01-run-20261121/spotlesssoul/csv-reader-speed-01-run-20261121/reward.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121)

A dependency-free, high-performance JavaScript drop-in for make.fun's `csv-reader` 1.0.0. It preserves the reference parser's output while reading valid and malformed CSV inputs.

## Run

Run from this directory in the competition's Node.js 22 environment. The driver reads `/input/cases.json` and writes `/output/answers.json`:

```sh
node main.ts
```

For local runs, set `MAKEFUN_INPUT_DIR` to a directory containing `cases.json` and `MAKEFUN_OUTPUT_DIR` to a writable output directory before running the same command.

Project entrypoint: `main.ts`; parser implementation: `solve.js`.
