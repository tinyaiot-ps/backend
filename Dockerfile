# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the TypeScript application
RUN npm run build

# Expose the port your application runs on
EXPOSE 5000

# Start the application
CMD ["npm", "run", "serve"]