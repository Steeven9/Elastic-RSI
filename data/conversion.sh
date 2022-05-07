#!/usr/bin/env sh

# Convert CSV to JSON documents

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
