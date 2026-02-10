FROM node:18-alpine as build

WORKDIR /app

# Copy all files first
COPY . .

# Set build-time environment variable
ARG REACT_APP_API_URL=https://www.iwareid.com/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Install dependencies
RUN npm install

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
