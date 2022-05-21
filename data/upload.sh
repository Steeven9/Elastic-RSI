#!/usr/bin/env bash

# Creates the index, uploads mappings, and POSTs data to ElasticSearch.
# Usage:
# ./upload.sh <elastic_index> <files>

ELASTIC_INDEX=$1
shift

# Create index
printf "\nCreating index... "
curl -u "group3:${ELASTIC_PASSWORD}" \
  -X PUT "${ELASTIC_URL}/${ELASTIC_INDEX}"

# Upload mappings
printf "\nUploading mappings... "
cat mappings.json | curl -u "group3:${ELASTIC_PASSWORD}" \
  -X POST \
  --data-binary @- "${ELASTIC_URL}/${ELASTIC_INDEX}/_mappings/" \
  -H "Content-Type: application/json"

# Upload the data
for f in $@; do \
  printf "\nUploading ${f}... "
  cat "${f}" | curl -u "group3:${ELASTIC_PASSWORD}" \
    -X POST \
    --data-binary @- "${ELASTIC_URL}/${ELASTIC_INDEX}/_bulk/" \
    -H "Content-Type: application/json"
done

printf "\nDone!\n"
