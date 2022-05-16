#!/usr/bin/env bash

# Exports our environment variables

export $(cat .env | xargs)
