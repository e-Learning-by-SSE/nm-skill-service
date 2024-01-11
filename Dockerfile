# Base image
FROM node:18-alpine as build

# Required:
# * openssl1.1-compat: Prisma Client to work in container
# RUN apk add --update --no-cache openssl1.1-compat

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node package.json package-lock.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY --chown=node:node . ./

# Delete test files before compilation
RUN rm -rf test/
RUN rm -rf src/**/*.spec.ts

# Generate Prisma client
RUN npx prisma generate
# Allow runnig prisma commands, based on: https://stackoverflow.com/a/72602624
RUN chown node:node -R node_modules/.prisma

# Creates a "dist" folder with the production build
RUN npm run build

# Delete source files after deletion
RUN rm -rf src/ Jenkinsfile README.md docker/ docker-compose.yml tsconfig.build.json tsconfig.json .dockerignore

# Create Log folder
RUN mkdir -p /usr/src/app/logs


# Multistage build: Keep only result instead of all intermediate layers
FROM node:18-alpine
COPY --from=build /usr/src/app /usr/src/app

# Required:
# * openssl1.1-compat: Prisma Client to work in container
# * bash: entry-script
# * pg_isready: To test if DB is up, bevor application starts
# RUN apk add --update --no-cache openssl1.1-compat bash postgresql-libs postgresql-client
RUN apk add --update --no-cache bash postgresql-libs postgresql-client

# Prepare startup script
COPY docker/entry.sh /entry.sh
RUN chmod +x /entry.sh

# Use the node user from the image (instead of the root user)
USER node
# RUN chown node:node -R /usr/src/app/logs

# Start the server using the production build
ENTRYPOINT ["/entry.sh"]
EXPOSE 3000
