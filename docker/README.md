# Docker Build

This folder contains build files to setup a docker container.
The containerized application uses by default the

## Building

Execute the following command from the project root to build a new image:

```bash
docker build . -f docker/Dockerfile
```

You may optionally specify a name

```bash
docker build . -f Dockerfile -t <competence-repository>
```

The image exposes port 3000.

## Configuration & Execution

The image does not contain a database. Either the db connection parameters or the complete connection sting must be passed as environment variables. Please do not use localhost to refer to the database even if it runs on the same host. Use the host's IP instead.

### Detailed Configuration With Multiple Parameters

Parameters (and illustrative values) that may be passed as environment variables via an docker-compose script.

```bash
DB_USER=postgres
DB_PASSWORD=admin
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=competence-repository-db
```

The container will check and wait for a running postgres instance, if and only if **DB_HOST** is defined.

### Configuration via a Single Connection String

The following example demonstrates how to run a detached container (`name=competence-repository`) on port 80 with a database (`ip=192.168.1.1`) and default postgres credentials.

```bash
docker run -d -p 80:3000 -e DATABASE_URL="postgresql://postgres:admin@192.168.1.1:5431/competence-repository-db?schema=public" -t competence-repository
```

The following example demonstrates how to run a detached container (`name=competence-repository`) on port 80 with a database (`ip=192.168.1.1`) and default postgres credentials and adding a environment variable called ACTION to control initialization of DB 
docker run -d -p 80:3000 -e DATABASE_URL="postgresql://postgres:admin@192.168.1.1:5431/competence-repository-db?schema=public" -e ACTION="DEMO_SEED" -t competence-repository1 