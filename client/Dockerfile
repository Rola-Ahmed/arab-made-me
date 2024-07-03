# client/Dockerfile

# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install --force

# Copy the rest of the application files to the working directory
COPY . .

# Build the React application
RUN npm run build

# Install a lightweight HTTP server to serve the built React application
RUN npm install -g serve

Run npm start

# Expose the port the application will run on
EXPOSE 3000

# Define the command to run the application
CMD ["serve", "-s", "build"]
