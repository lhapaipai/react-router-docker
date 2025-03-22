#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR=$(dirname "$SCRIPT_DIR")

cd "$PROJECT_DIR"

./generate-ansible-vars.sh

if [ ! -f "$PROJECT_DIR/ansible/.vault_pass" ]; then
  echo "create ./ansible/.vault_pass file"
  echo "YOUR-PASSWORD > $PROJECT_DIR/ansible/.vault_pass file"
fi

SECRETS_DIR="$PROJECT_DIR/deployments/app/secrets"
if [ ! -d "$SECRETS_DIR" ]; then
  echo "create ./deployments/app/secrets directory"

  mkdir -p "$SECRETS_DIR"

  touch "$SECRETS_DIR/DATABASE_URL"
  touch "$SECRETS_DIR/POSTGRES_PASSWORD"

  echo "for deployments you will need to define ./deployments/app/secrets variables"
fi