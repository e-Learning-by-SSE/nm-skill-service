# Base image
FROM node:16-alpine

# Required for Prisma Client to work in container
RUN apk add --no-cache openssl
# Required for entry script
RUN apk add --no-cache bash

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node package.json package-lock.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY --chown=node:node . ./

# Generate Prisma client
RUN npx prisma generate
# Allow runnig prisma commands, based on: https://stackoverflow.com/a/72602624
RUN chown node:node -R node_modules/.prisma

# Creates a "dist" folder with the production build
RUN npm run build

# Prepare startup script
ADD docker/entry.sh /entry.sh
RUN chmod +x /entry.sh

# Use the node user from the image (instead of the root user)
USER node

# Start the server using the production build
ENTRYPOINT ["/entry.sh"]
EXPOSE 3000
