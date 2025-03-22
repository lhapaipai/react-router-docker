#!/bin/sh
set -e


# Run command with node if the first argument contains a "-" or is not a system command. The last
# part inside the "{}" is a workaround for the following bug in ash/dash:
# https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=874264
if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ] || { [ -f "${1}" ] && ! [ -x "${1}" ]; }; then
  set -- node "$@"
fi

# docker_setup_env
if [ -d "/run/secrets" ]; then
  for SECRET_FILE in /run/secrets/*; do
    SECRET_NAME=$(basename "$SECRET_FILE")
    export "$SECRET_NAME"="$(cat "$SECRET_FILE")"
  done
fi

# docker_verify_minimum_env
if [ -z "$DATABASE_URL" ]; then
  # The - option suppresses leading tabs but *not* spaces. :)
  cat >&2 <<-'EOE'
Error: You must specify DATABASE_URL to a non-empty value.
Example: "-e DATABASE_URL=postgresql://user:secret@db:5432/app?schema=public" on "docker run".
Migration SKIPPED.
EOE
else
  ./node_modules/.bin/prisma migrate deploy
fi

exec "$@"
