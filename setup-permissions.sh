#!/bin/bash

# Setup all permissions for deployment

echo "🔧 Setting up permissions..."

# Make scripts executable
chmod +x deploy-vps.sh
chmod +x docker-status.sh
chmod +x docker-rebuild.sh
chmod +x docker-logs.sh
chmod +x docker-restart.sh
chmod +x docker-healthcheck.sh
chmod +x setup-permissions.sh

# Create required directories
mkdir -p backend/uploads
mkdir -p backend/logs

# Set directory permissions
chmod -R 777 backend/uploads
chmod -R 777 backend/logs

echo "✅ Permissions set successfully!"
echo ""
echo "You can now run:"
echo "  sudo ./deploy-vps.sh"
