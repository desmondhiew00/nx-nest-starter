# Dockerfile for admin-api

# Use the official Node.js image
FROM node:20-alpine AS build


# Create and change to the app directory
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install
RUN npx prisma generate

# Copy the application code
COPY . .

# Build the application
RUN npx nx reset
RUN npx nx build admin-api --prod

# Run the application
CMD ["node", "dist/apps/demo/main.js"]