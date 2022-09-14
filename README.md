# Competence Repository Service

![Build Status](https://jenkins-2.sse.uni-hildesheim.de/buildStatus/icon?job=Teaching_Competence-Repository "Build Status")

The Competence Repository Service allows content creators / teachers to develop their own competence repositories (i.e., taxonomies), share them with others, and use them to model required and offered compenences of a course.

## Installation

```bash
npm install
```

## Database operations

```bash
# Start the dev-db docker container
npm run db:dev:start

# Wipe and restart dev-db, also applies current db schema
npm run db:dev:restart

# Create and deploy a new db migration (after the db schema has been changed), will also seed the db (applying sample data)
npx prisma migrate dev

# Apply sample data (without clearing existing data)
npx prisma db seed

# Clear data and seed
npx prisma migrate reset

# Run the web-based client to browse and manipulate the dev-db
npx prisma studio
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit / integreation tests (requires empty DB)
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Used Packages / Frameworks

- [Nest](https://github.com/nestjs/nest): Server-side backend
- [Prisma](https://www.prisma.io): ORM / database access
- class-validator, class-transformer: For validating requests
- argon2: Hashing passwords and Tokens
- [@nestjs/passport, passport, @nestjs/jwt passport-jwt, @types/passport-jwt](https://docs.nestjs.com/security/authentication): For authentication
- [swagger](https://swagger.io/): REST API documentation

## License

This project is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.html).
