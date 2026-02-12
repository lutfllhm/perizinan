#!/bin/bash

# ============================================
# Setup Permissions Script
# Make all scripts executable
# ============================================

echo "🔧 Setting up permissions..."

# Make scripts executable
chmod +x deploy-vps.sh
chmod +x docker-healthcheck.sh
chmod +x docker-logs.sh
chmod +x docker-restart.sh
chmod +x setup-permissions.sh

# Create necessary directories
mkdir -p backend/uploads
mkdir -p backend/logs
mkdir -p frontend/build

# Set directory permissions
chmod -R 755 .
chmod -R 777 backend/uploads
chmod -R 777 backend/logs

echo "✅ Permissions set successfully!"
echo ""
echo "Available scripts:"
echo "  ./deploy-vps.sh          - Deploy application"
echo "  ./docker-healthcheck.sh  - Check container health"
echo "  ./docker-logs.sh         - View logs"
echo "  ./docker-restart.sh      - Restart containers"
