#!/usr/bin/env bash

# Calls both the converter and the uploader
# Usage:
# ./ingestData.sh <elastic_index>

# Cleanup
if [ -f error.log ]; then
    rm error.log
fi
rm data/*.part

# Build the tool
cd converter
./build.sh ../data/converter

# Parse data
cd ../data
./converter output.ndjson rsi_*.log -v 2> ../error.log

# Delete previous index if it exists
if curl -u group3:${ELASTIC_PASSWORD} --silent --fail -X GET ${ELASTIC_URL}/$1 | grep "created" > /dev/null; then
    printf "\nDeleting old index... "
    curl -u group3:${ELASTIC_PASSWORD} -X DELETE ${ELASTIC_URL}/$1
fi

# Upload to Elasticsearch
./upload.sh $1 output.ndjson.*.part

if [ -f ../error.log ]; then
    printf "\nSome documents couldn't be augmented with info from RSI."
    printf "Please consult the error.log file for more info.\n"
fi
