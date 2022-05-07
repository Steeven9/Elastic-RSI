# How to upload the data

1. Run `./convert_all.sh file1.log file2.log` to convert to the `ndjson` format
2. Run `ELASTIC_URL=https://example.com ELASTIC_INDEX=test ./upload.sh PASSWORD file1.njdson file2.njdson` to upload the data
