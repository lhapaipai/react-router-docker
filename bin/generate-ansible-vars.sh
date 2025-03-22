#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR=$(dirname "$SCRIPT_DIR")

ANSIBLE_DIR="$PROJECT_DIR/ansible"

DEFAULT_ANSIBLE_USER="root"
DEFAULT_ADMIN_USER="bob"
DEFAULT_ADMIN_PASSWORD="secret"
DEFAULT_DISTRIB_CODENAME="jammy"
DEFAULT_SERVER_HOSTNAME="vps1.yourdomain.com"
DEFAULT_ARCH="amd64"

read -p "Nom d'utilisateur Ansible [$DEFAULT_ANSIBLE_USER] : " ANSIBLE_USER
ANSIBLE_USER=${ANSIBLE_USER:-$DEFAULT_ANSIBLE_USER}

read -p "Nom d'utilisateur administrateur [$DEFAULT_ADMIN_USER] : " ADMIN_USER
ADMIN_USER=${ADMIN_USER:-$DEFAULT_ADMIN_USER}

read -p "Mot de passe utilisateur administrateur [$DEFAULT_ADMIN_PASSWORD] : " ADMIN_USER
ADMIN_PASSWORD=${ADMIN_PASSWORD:-$DEFAULT_ADMIN_PASSWORD}


read -p "Nom de code de la distribution [$DEFAULT_DISTRIB_CODENAME] : " DISTRIB_CODENAME
DISTRIB_CODENAME=${DISTRIB_CODENAME:-$DEFAULT_DISTRIB_CODENAME}

read -p "Nom d'hôte du serveur [$DEFAULT_SERVER_HOSTNAME] : " SERVER_HOSTNAME
SERVER_HOSTNAME=${SERVER_HOSTNAME:-$DEFAULT_SERVER_HOSTNAME}

read -p "Architecture [$DEFAULT_ARCH] : " ARCH
ARCH=${ARCH:-$DEFAULT_ARCH}

# Déduire HOSTNAME à partir de SERVER_HOSTNAME
HOSTNAME=$(echo "$SERVER_HOSTNAME" | cut -d'.' -f1)

if [ -d "$ANSIBLE_DIR/host_vars/$HOSTNAME" ]; then
  echo "./ansible/host_vars/$HOSTNAME already exists"
  exit 0
fi

mkdir -p "$ANSIBLE_DIR/host_vars/$HOSTNAME"

## vars.yaml
echo "---
hostname: $HOSTNAME

ansible_user: $ANSIBLE_USER

admin_user: $ADMIN_USER
admin_password: \"{{ vault_admin_password }}\"

distrib_codename: $DISTRIB_CODENAME

server_hostname: $SERVER_HOSTNAME

arch: $ARCH" > "$ANSIBLE_DIR/host_vars/$HOSTNAME/vars.yaml"

echo "./ansible/host_vars/$HOSTNAME/vars.yaml created"

## vault.yaml
CRYPTED_ADMIN_PASSWORD=$(echo "$ADMIN_PASSWORD" | mkpasswd -s -m yescrypt)

echo "vault_admin_password: $CRYPTED_ADMIN_PASSWORD" > "$ANSIBLE_DIR/host_vars/$HOSTNAME/vault.yaml"
echo "./ansible/host_vars/$HOSTNAME/vault.yaml created"

## hosts
echo "$HOSTNAME ansible_host=$SERVER_HOSTNAME" >> "$ANSIBLE_DIR/hosts"