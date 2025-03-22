#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR=$(dirname "$SCRIPT_DIR")

LOCAL_PATH="$PROJECT_DIR/deployments/traefik"
REMOTE_PATH=~/deployments/traefik

cd "$PROJECT_DIR"

ssh millau "mkdir -p $REMOTE_PATH/letsencrypt"
rsync -av \
  --exclude=letsentrypt \
  "$LOCAL_PATH/" \
  millau:$REMOTE_PATH