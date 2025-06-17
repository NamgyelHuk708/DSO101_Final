#!/bin/sh
set -e

# Install knex globally if not present
if ! command -v knex &> /dev/null; then
  npm install -g knex
fi

# Run migrations if DB_URL exists
if [ -n "$DATABASE_URL" ]; then
  knex migrate:latest
fi

# Execute the main command
exec "$@"