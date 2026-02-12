#!/bin/bash

# IWARE Perizinan - Firewall Setup Script
# Usage: sudo bash setup-firewall.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔒 IWARE Perizinan - Firewall Setup"
echo "===================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root (use sudo)${NC}"
    exit 1
fi

# Check if ufw is installed
if ! command -v ufw >/dev/null 2>&1; then
    echo "Installing UFW..."
    apt update
    apt install -y ufw
fi

echo "Configuring firewall rules..."
echo ""

# Reset UFW to default
echo -e "${YELLOW}Resetting firewall to default...${NC}"
ufw --force reset

# Set default policies
echo "Setting default policies..."
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (IMPORTANT!)
echo -e "${GREEN}✅ Allowing SSH (port 22)${NC}"
ufw allow 22/tcp comment 'SSH'

# Allow HTTP
echo -e "${GREEN}✅ Allowing HTTP (port 80)${NC}"
ufw allow 80/tcp comment 'HTTP'

# Allow HTTPS
echo -e "${GREEN}✅ Allowing HTTPS (port 443)${NC}"
ufw allow 443/tcp comment 'HTTPS'

# Optional: Allow MySQL from localhost only (already restricted by Docker)
# ufw allow from 127.0.0.1 to any port 3306 comment 'MySQL localhost'

# Optional: Allow specific IP for MySQL access
read -p "Do you want to allow MySQL access from specific IP? (y/n): " ALLOW_MYSQL
if [ "$ALLOW_MYSQL" = "y" ]; then
    read -p "Enter IP address: " MYSQL_IP
    if [ ! -z "$MYSQL_IP" ]; then
        ufw allow from $MYSQL_IP to any port 3306 comment 'MySQL from specific IP'
        echo -e "${GREEN}✅ MySQL access allowed from $MYSQL_IP${NC}"
    fi
fi

# Enable UFW
echo ""
echo -e "${YELLOW}Enabling firewall...${NC}"
ufw --force enable

# Show status
echo ""
echo -e "${GREEN}✅ Firewall configured successfully!${NC}"
echo ""
echo "Current firewall rules:"
ufw status numbered

echo ""
echo "=========================================="
echo "Firewall Configuration Complete"
echo "=========================================="
echo ""
echo "Allowed ports:"
echo "  - 22  (SSH)"
echo "  - 80  (HTTP)"
echo "  - 443 (HTTPS)"
echo ""
echo "⚠️  IMPORTANT: Make sure you can still access SSH!"
echo "    Test SSH connection before closing this session."
echo ""
echo "Useful commands:"
echo "  Check status:  sudo ufw status"
echo "  Disable:       sudo ufw disable"
echo "  Enable:        sudo ufw enable"
echo "  Delete rule:   sudo ufw delete [number]"
echo ""
