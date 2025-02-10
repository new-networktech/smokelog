FROM node:16-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]