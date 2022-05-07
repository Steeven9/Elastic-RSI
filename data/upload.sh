#!/usr/bin/env bash

# How to run:
#   ELASTIC_URL=https://example.com ELASTIC_INDEX=test ./upload.sh PASSWORD file1.njdson file2.njdson

ELASTIC_PWD=$1
shift

echo "Creating index..."
# Create index
curl -u "group3:${ELASTIC_PWD}" -X PUT "${ELASTIC_URL}/${ELASTIC_INDEX}"

echo "\nUploading mappings..."
# Upload mappings
cat mappings.json | curl -u "group3:${ELASTIC_PWD}" \
    -X POST \
    --data-binary @- "${ELASTIC_URL}/${ELASTIC_INDEX}/_mappings/" \
    -H "Content-Type: application/json"

# Upload the data
for f in $@; do \
  echo "\nUploading ${f}..."
  cat "${f}" | curl -u "group3:${ELASTIC_PWD}" \
    -X POST \
    --data-binary @- "${ELASTIC_URL}/${ELASTIC_INDEX}/_bulk/" \
    -H "Content-Type: application/json"
done

echo "\nDone"

