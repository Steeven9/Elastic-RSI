#!/usr/bin/env sh

# Converts a file to the correct format, ready for import.
# Usage:
# ./conversion.sh <file>

jq --slurp --raw-input --raw-output \
  'split("\n") | .[0:-1] | map(split(" ")) |
    map({
      "date": (.[0] + " " + .[1]),
      "masked_ip": .[2],
      "location": {
          "lon": .[4],
          "lat": .[3],
      },
      "req_type": .[5],
      "path": .[6],
      "http_version": .[7],
      "device_info": (.[8:] | join(" "))
    })' $1 | jq -c '.[] | {"index":{}}, .'
