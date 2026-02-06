#!/bin/bash

# Fix permissions for IWARE Perizinan
echo "🔧 Fixing permissions..."

# Set directory permissions
chmod -R 755 .

# Set uploads directory permissions
chmod -R 777 backend/uploads

# Make scripts executable
chmod +x deploy-vps.sh
chmod +x start-dev.sh
chmod +x fix-permissions.sh

# Set log directory permissions if exists
if [ -d "logs" ]; then
    chmod -R 755 logs
fi

echo "✅ Permissions fixed!"
echo ""
echo "Directory permissions:"
ls -la backend/uploads
