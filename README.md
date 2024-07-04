# Skill Service

![Build Status](https://jenkins-2.sse.uni-hildesheim.de/buildStatus/icon?job=Teaching_NM-Skill-Service/main/)
![Tests](https://jenkins-2.sse.uni-hildesheim.de/buildStatus/icon?job=Teaching_NM-Skill-Service/main&subject=Tests&status=${numberOfTest})
![Line Coverage](https://jenkins-2.sse.uni-hildesheim.de/buildStatus/icon?job=Teaching_NM-Skill-Service/main&subject=Coverage&status=${lineCoverage})
![Lines of Code](https://jenkins-2.sse.uni-hildesheim.de/buildStatus/icon?job=Teaching_NM-Skill-Service/main&subject=Lines%20of%20Code&status=${lineOfCode}&color=blue)

The Competence Repository Service allows content creators / teachers to develop their own competence repositories (i.e., taxonomies), share them with others, and use them to model required and offered competencies of a course.

## Installation

```bash
npm install
```

## Configuration

The service can be configured via the `.env` file placed in the root of this repository. These parameters may be overwritten by environment variables, as environment variable takes precedence over the parameters defined in the configuration file.

## Database operations

```bash
# Start the dev-db docker container
npm run db:start

# Reset db without applying seed (e.g., after db is in inconsistent state but seed not needed)
npx prisma db push --force-reset

# Apply sample data (without clearing existing data)
npx prisma db seed

# Clear data and seed (e.g., after db is in inconsistent state and seed data is expected for local tests)
npm run db:redeploy

# Create and deploy a new db migration (after the db schema has been changed), will also seed the db (applying sample data)
npx prisma migrate dev

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
# unit / integration tests (requires empty DB)
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Release Management

1. Merge all stable branches into `main`, which shall be included into the release.
2. Create a new data base migration, only if the prisma schema was changed since the last release:
   `npx prisma migrate dev --name <a_concise_name_describing_the_db_change>`
   Replace `<a_concise_name_describing_the_db_change>` with an appropriate name that describes the change.
3. Create a new _tag_ in the Git repository, use [semantic versioning according to our guide line](https://github.com/e-Learning-by-SSE/nm-skill-lib/blob/main/semver.md). Also add a description to the _tag_ that describes the change of the new release. Push the commit (depending on the tool, it may require some additional parameters to include tags).
4. Log into Jenkins and build the new release, it must not fail. Otherwise fix and prepare a new release
5. Log into GitHub and prepare a new release based on the given tag. Also add here the release description and add the link to the Docker container, which was built by Jenkins.
6. Ideally: Test the container + migration locally.
7. Increment the version number inside the `package.json` before adding any further changes to the _main_ branch.

## Used Packages / Frameworks

-   [Nest](https://github.com/nestjs/nest): Server-side backend
-   [Prisma](https://www.prisma.io): ORM / database access
-   class-validator, class-transformer: For validating requests
-   argon2: Hashing passwords and Tokens
-   [@nestjs/passport, passport, @nestjs/jwt passport-jwt, @types/passport-jwt](https://docs.nestjs.com/security/authentication): For authentication
-   [swagger](https://swagger.io/): REST API documentation

## Docker

Automatically built docker images are available at our [GitHub Docker Repository](https://github.com/orgs/e-learning-by-sse/packages/container/package/nm-competence-repository)

## License

This project is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.html).
