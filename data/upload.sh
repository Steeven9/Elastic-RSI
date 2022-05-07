#!/usr/bin/env bash

# Creates the index, uploads mappings, and POSTs data to ElasticSearch.
# Usage:
# ELASTIC_URL=https://example.com ELASTIC_INDEX=test ./upload.sh <ELASTIC_PASSWORD> <files>

ELASTIC_PWD=$1
shift

printf "Creating index..."
# Create index
curl -u "group3:${ELASTIC_PWD}" -X PUT "${ELASTIC_URL}/${ELASTIC_INDEX}"

printf "\nUploading mappings..."
# Upload mappings
cat mappings.json | curl -u "group3:${ELASTIC_PWD}" \
    -X POST \
    --data-binary @- "${ELASTIC_URL}/${ELASTIC_INDEX}/_mappings/" \
    -H "Content-Type: application/json"

# Upload the data
for f in $@; do \
  printf "\nUploading ${f}..."
  cat "${f}" | curl -u "group3:${ELASTIC_PWD}" \
    -X POST \
    --data-binary @- "${ELASTIC_URL}/${ELASTIC_INDEX}/_bulk/" \
    -H "Content-Type: application/json"
done

printf "\nDone!"
