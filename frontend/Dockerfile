FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy build files
COPY --from=build /app/build ./build

# Expose port
EXPOSE 3000

# Start application
CMD ["serve", "-s", "build", "-l", "3000"]
