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

* `-e, --entries-per-file=<entriesPerFile>` Entries per '.part' file
* `-v, --verbose` Print execution logs

See the help message for all options:

```shell
./converter --help
```

## Datasets

Geo shapes sourced from: http://download.geonames.org/export/dump/
