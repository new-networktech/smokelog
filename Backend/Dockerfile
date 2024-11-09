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

# Expose the backend port
EXPOSE 5000

# Start the backend server directly
CMD ["node", "server.js"]
