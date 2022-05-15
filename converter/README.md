# Data conversion tool

## Build

```shell
./build.sh converter
```

## Run

```shell
./converter output.ndjson input1.log input2.log
```

### Flags

* `-e, --entries-per-file=<entriesPerFile>` Entries per `.part` file
  * Defaults to 1024
  * Increasing this number will reduce the number of `.part` files generated
    but each one will become bigger
* `-t, --tasks=<maxTasks>` Max async tasks for parsing the inputs
  * Defaults to 2048
  * Increasing this number speeds up the conversion but requires more memory
* `-v, --verbose` Print execution logs

See the help message for all options:

```shell
./converter --help
```

## Datasets

Geo shapes sourced from: http://download.geonames.org/export/dump/
