# Backend Dockerfile
FROM node:16-alpine

# Install bash
RUN apk add --no-cache bash

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Bundle app source
COPY . .

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "run", "dev"]
