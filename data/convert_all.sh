#!/usr/bin/env bash

# How to use:
#     ./convert_all.sh <files>

SPLIT_LINES=10000

echo "This might take a while, depending on file size"
for f in $@; do \
    echo "Splitting and converting ${f}..."
    split -l $SPLIT_LINES $f "${f}.part."
    for p in $(find . -maxdepth 1 -type f -name "${f}\.part\.*"); do \
        ./conversion.sh $p > "$p.ndjson"
    done
done

echo "Done!"
