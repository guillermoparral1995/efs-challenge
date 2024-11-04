# Start from the official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the app port
EXPOSE 3000

# This CMD is a placeholder, as the actual command is defined in docker-compose.yml
CMD ["npm", "run", "start"]
