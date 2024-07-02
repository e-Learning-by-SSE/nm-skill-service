#!/bin/bash
#!/bin/bash
RED='\033[0;31m'
NC='\033[0m' # No Color
printf "${DB_ACTION}"
printf "${DB_HOST}"

detect_migrations() {
    # Based on: https://stackoverflow.com/a/2108296
    for dir in /usr/src/app/prisma/migrations/*/
        do
        # Extract migration name
        dir=${dir%*/}
        migration="${dir##*/}"

        echo -e "Found migration ${RED}${migration}${NC}; marked as applied"
        npx prisma migrate resolve --applied $migration
    done
}


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
        echo "Initializing the database and applying sample data..."
        
        # Initilize DB and apply seed data
        cd /usr/src/app/
        npx prisma db push --accept-data-loss
        npx prisma db seed
		detect_migrations
        echo "Database initialization completed."
        
        node /usr/src/app/dist/src/main.js
        ;;

    "INIT")
        # Initialize the database, if not already initialized
        echo "Initializing the database if not already initialized"
        
        # Initilize, but do not reset existing data
        cd /usr/src/app/
        npx prisma db push
		detect_migrations
        
        node /usr/src/app/dist/src/main.js
        ;;
    
    "RESET")
        # Resets the database and initializes it
        echo "Resetting and Initializing the database"
        
        # Reset the database
        cd /usr/src/app/
        npx prisma db push --force-reset
		detect_migrations

        node /usr/src/app/dist/src/main.js
        ;;

    "MIGRATE")
        # Start the NestJS application
        echo "Database already initialized, apply migrations"
        
        # Apply only migrations
        cd /usr/src/app/
        npx prisma migrate deploy

        # Start the server
        node /usr/src/app/dist/src/main.js
        ;;

    *)
        echo "Unknown or no ACTION provided."
        ;;
esac
