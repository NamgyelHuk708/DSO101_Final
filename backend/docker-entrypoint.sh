#!/bin/sh
set -e

# Only attempt migrations if database exists
if [ -n "$DATABASE_URL" ]; then
  knex migrate:latest
fi

exec "$@"