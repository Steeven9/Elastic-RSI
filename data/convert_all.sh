#!/usr/bin/env bash

# Splits logfiles in smaller parts and converts them to the right format.
# Usage:
# ./convert_all.sh <files>

SPLIT_LINES=10000

printf "⚠️ This might take a while, depending on file size"
for f in $@; do \
    printf "\nSplitting and converting ${f}..."
    split -l $SPLIT_LINES $f "${f}.part."
    for p in $(find . -maxdepth 1 -type f -name "${f}\.part\.*"); do \
        ./conversion.sh $p > "$p.ndjson"
    done
done

printf "\nDone!"
