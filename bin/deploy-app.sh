#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR=$(dirname "$SCRIPT_DIR")

LOCAL_PATH="$PROJECT_DIR/deployments/app"
REMOTE_PATH=~/deployments/app

cd "$PROJECT_DIR"
mkdir -p "$LOCAL_PATH"
docker compose \
  -f compose.yaml \
  -f compose.prod.yaml \
  config \
  --no-normalize \
  --no-path-resolution \
  --no-interpolate \
  -o "$LOCAL_PATH/compose.yaml"

ssh millau "mkdir -p $REMOTE_PATH"
rsync -av \
  "$LOCAL_PATH/" \
  millau:$REMOTE_PATH