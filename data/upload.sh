#!/usr/bin/env bash

# How to run:
#   ./upload.sh PASSWORD file1.csv file2.csv

ELASTIC_PWD=$1
shift

echo "Creating index..."
# Create index
curl -u "group3:${ELASTIC_PWD}" -X PUT "https://elastic.soulsbros.ch/rsi"

echo "Uploading mappings..."
# Upload mappings
cat mappings.json | curl -u "group3:${ELASTIC_PWD}" \
    -X POST \
    --data-binary @- "https://elastic.soulsbros.ch/rsi/_mappings/" \
    -H "Content-Type: application/json"

# Upload the data
for f in $@; do \
  echo "Parsing ${f}..."
  # Data conversion
  ./conversion.sh $f > "${f}.ndjson"
  echo "Uploading ${f}.ndjson..."
  cat "${f}.ndjson"| curl -u "group3:${ELASTIC_PWD}" \
    -X POST \
    --data-binary @- "https://elastic.soulsbros.ch/rsi/_bulk/" \
    -H "Content-Type: application/json"
done

echo "Done!"

