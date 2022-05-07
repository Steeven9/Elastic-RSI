#!/usr/bin/env bash

SPLIT_LINES=500

for f in $@; do \
    split -l $SPLIT_LINES $f "${f}.part."
    for p in $(find . -maxdepth 1 -type f -name "${f}\.part\.\w\w"); do \
        ./conversion.sh $p > "$p.ndjson"
    done
done
