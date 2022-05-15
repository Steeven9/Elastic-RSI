#!/usr/bin/env bash

# Calls both the converter and the uploader
# Usage:
# ./ingestData.sh <ELASTIC_PASSWORD> <elastic URL>

# Build the tool
cd converter
./build.sh ../data/converter

# Parse data
cd ../data
rm *.part
./converter output.ndjson *.log -v

# Upload to Elasticsearch
ELASTIC_URL=$2 ELASTIC_INDEX=rsi ./upload.sh $1 output.njdson.*.part
