#!/bin/bash

# Rebuild and restart specific service

set -e

if [ -z "$1" ]; then
    echo "Usage: ./docker-rebuild.sh [service]"
    echo "Services: mysql, backend, frontend, all"
    exit 1
fi

SERVICE=$1

echo "🔄 Rebuilding $SERVICE..."

if [ "$SERVICE" = "all" ]; then
    echo "Stopping all services..."
    docker-compose down
    
    echo "Rebuilding all services..."
    docker-compose build --no-cache
    
    echo "Starting all services..."
    docker-compose up -d
else
    echo "Stopping $SERVICE..."
    docker-compose stop $SERVICE
    
    echo "Rebuilding $SERVICE..."
    docker-compose build --no-cache $SERVICE
    
    echo "Starting $SERVICE..."
    docker-compose up -d $SERVICE
fi

echo ""
echo "✅ Rebuild complete!"
echo ""
echo "Check status with: ./docker-status.sh"
echo "View logs with: docker-compose logs -f $SERVICE"
