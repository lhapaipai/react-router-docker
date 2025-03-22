#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR=$(dirname "$SCRIPT_DIR")

cd "$PROJECT_DIR"

if [ ! -f "$PROJECT_DIR/ansible/host_vars/millau/vault.yaml" ]; then
  echo "create ./ansible/host_vars/millau/vault.yaml file"
  echo "vault_admin_password: XXX" > "$PROJECT_DIR/ansible/host_vars/millau/vault.yaml"
fi

SECRETS_DIR="$PROJECT_DIR/deployments/app/secrets"
if [ ! -d "$SECRETS_DIR" ]; then
  echo "create ./deployments/app/secrets directory"

  mkdir -p "$SECRETS_DIR"

  touch "$SECRETS_DIR/DATABASE_URL"
  touch "$SECRETS_DIR/POSTGRES_PASSWORD"

  echo "for deployments you will need to define ./deployments/app/secrets variables"
fi