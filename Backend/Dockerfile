# Backend Dockerfile
FROM node:16-alpine

# Install necessary packages
RUN apk add --no-cache bash

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the entire backend directory into the container
COPY . .

# Add wait-for script to manage startup timing with PostgreSQL
ADD https://raw.githubusercontent.com/eficode/wait-for/v2.1.3/wait-for /usr/bin/wait-for
RUN chmod +x /usr/bin/wait-for

# Expose the backend port
EXPOSE 5000

# Start the backend server with wait-for script
CMD ["wait-for", "postgres:5432", "--", "node", "server.js"]
