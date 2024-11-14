# Frontend Dockerfile

# Stage 1: Build the React app
FROM node:16-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Set environment variables if they are needed during build time
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build the React app
RUN npm run build

# Stage 2: Serve the build files with Nginx (Alpine version)
FROM nginx:alpine

# Copy built files from the previous stage to the Nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Remove the default Nginx configuration file and add our custom one
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set environment to production
ENV NODE_ENV production

# Expose port 80 for serving the frontend
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
