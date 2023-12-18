#!/bin/bash
printf "${DB_ACTION}"
printf "${DB_HOST}"

# Wait until DB is running (only if a host was specified)
if [[ ! -z "${DB_HOST}" ]]; then
    printf "Waiting for DB at %s" "${DB_HOST} "
    while ! pg_isready -h $DB_HOST -p $DB_PORT &> /dev/null; do
        sleep 1
        printf "."
    done
    printf " done.\n"
fi

# Check the value of the ACTION variable
case "${DB_ACTION}" in
    "DEMO_SEED")
        # Initialize the database and apply sample data
        if [ ! -e /home/node/db_initialized ]; then
            printf "Initializing the database and applying sample data...\n"
            cd /usr/src/app/
            npx prisma db push --accept-data-loss
            npx prisma db seed
            touch /home/node/db_initialized
            cd -
            printf "Database initialization completed.\n"
            cd /usr/src/app/
            node /usr/src/app/dist/src/main.js
        fi
        ;;

    "INIT")
        # Start the NestJS application
        printf "Initializing the database and fills these with administrative values\n"
        cd /usr/src/app/
        npx prisma db push
        cd /usr/src/app/
        node /usr/src/app/dist/src/main.js
        ;;
    
    "RESET")
        # Start the NestJS application
        printf "Resetting and Initializing the database\n"
        cd /usr/src/app/
        npx prisma db push --force-reset
        cd /usr/src/app/
        node /usr/src/app/dist/src/main.js
        ;;

    "MIGRATE")
        # Start the NestJS application
        printf "Migrate the database \n"
        cd /usr/src/app/
        npx prisma db push --accept-data-loss
        npx prisma migrate deploy
        cd /usr/src/app/
        node /usr/src/app/dist/src/main.js
        ;;

    *)
        echo "Unknown or no ACTION provided."
        ;;
esac
