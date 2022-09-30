#!/bin/bash

# Wait until DB is running (only if a host was specified)
if [[ ! -z "${DB_HOST}" ]]; then
    printf "Waiting for DB at %s" "${DB_HOST} "
    while ! pg_isready -h $DB_HOST -p $DB_PORT &> /dev/null; do
        sleep 1
        printf "."
    done
    printf " done.\n"
fi

# Applies DB schema on first boot only,
# based on: https://stackoverflow.com/a/50638207
if [ ! -e /home/node/db_initialized ]; then
    cd /usr/src/app/
    # Clear database and apply sample data on first boot
    npx prisma migrate reset --force --skip-generate

    touch /home/node/db_initialized
    
    cd -
fi

# Start NestJS
node /usr/src/app/dist/src/main.js
