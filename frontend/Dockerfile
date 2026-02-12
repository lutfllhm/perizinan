# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm ci --legacy-peer-deps --no-audit --no-fund || npm install --legacy-peer-deps --no-audit --no-fund

# Copy application files
COPY . .

# Set build-time environment variable
ARG REACT_APP_API_URL=https://iwareid.com/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false

# Build application with increased memory
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

# Verify build output
RUN ls -la /app/build && \
    test -f /app/build/index.html || (echo "Build failed: index.html not found" && exit 1)

# Production stage
FROM nginx:alpine

# Install wget for healthcheck
RUN apk add --no-cache wget curl

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Set timezone
ENV TZ=Asia/Jakarta

# Create nginx cache directory with proper permissions
RUN mkdir -p /var/cache/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
