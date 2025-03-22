#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR=$(dirname "$SCRIPT_DIR")

LOCAL_PATH="$PROJECT_DIR/deployments/app"
REMOTE_PATH=~/deployments/app

DRY_RUN=false
FULL=false

show_help() {
    echo "Usage: $(basename "$0") [OPTIONS]"
    echo ""
    echo "Options :"
    echo "  -f, --full       Démarrer tous les services"
    echo "  -d, --dry-run    Exécuter en mode simulation"
    echo "  -h, --help       Afficher cette aide"
    exit 0
}

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    -d|--dry-run) DRY_RUN=true ;;
    -f|--full) FULL=true ;;
    -h|--help) show_help ;;
    *) echo "Option inconnue: $1" && show_help;;
  esac
  shift
done

echo "Generate compose.yaml file"
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

if [ "$DRY_RUN" = true ]; then
  exit 0
fi

echo "Copy files into VPS"
ssh millau "mkdir -p $REMOTE_PATH"
rsync -av \
  "$LOCAL_PATH/" \
  millau:$REMOTE_PATH

echo "🚀 Deploy"
if [ "$FULL" = true ]; then
  ssh millau "cd $REMOTE_PATH && \
    docker compose up -d"
else
  ssh millau "cd $REMOTE_PATH && \
    docker compose pull rg.fr-par.scw.cloud/pentatrion/rr-front:latest && \
    docker compose up -d --no-deps --force-recreate front"
fi
