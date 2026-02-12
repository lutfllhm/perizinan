#!/bin/bash

# IWARE Perizinan - VPS Deployment Script
# Usage: bash deploy.sh

set -e

echo "🚀 IWARE Perizinan - VPS Deployment Script"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}❌ Please do not run as root${NC}"
    exit 1
fi

# Function to check command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Check prerequisites
echo "📋 Step 1: Checking prerequisites..."
echo ""

if ! command_exists docker; then
    echo -e "${RED}❌ Docker not found${NC}"
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✅ Docker installed${NC}"
    echo -e "${YELLOW}⚠️  Please logout and login again, then run this script again${NC}"
    exit 0
fi

if ! command_exists docker-compose; then
    echo -e "${RED}❌ Docker Compose not found${NC}"
    echo "Installing Docker Compose..."
    sudo apt install -y docker-compose
    echo -e "${GREEN}✅ Docker Compose installed${NC}"
fi

if ! command_exists nginx; then
    echo -e "${RED}❌ Nginx not found${NC}"
    echo "Installing Nginx..."
    sudo apt update
    sudo apt install -y nginx
    sudo systemctl enable nginx
    echo -e "${GREEN}✅ Nginx installed${NC}"
fi

if ! command_exists certbot; then
    echo -e "${RED}❌ Certbot not found${NC}"
    echo "Installing Certbot..."
    sudo apt install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✅ Certbot installed${NC}"
fi

echo -e "${GREEN}✅ All prerequisites met${NC}"
echo ""

# Step 2: Setup environment
echo "⚙️  Step 2: Setting up environment..."
echo ""

if [ ! -f .env ]; then
    if [ -f .env.docker ]; then
        cp .env.docker .env
        echo -e "${GREEN}✅ Environment file created${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env file and update:${NC}"
        echo "   - MYSQL_PASSWORD"
        echo "   - JWT_SECRET"
        echo "   - REACT_APP_API_URL"
        echo "   - FRONTEND_URL"
        echo ""
        read -p "Press Enter after editing .env file..."
    else
        echo -e "${RED}❌ .env.docker template not found${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Environment file exists${NC}"
fi

# Step 3: Build Docker images
echo "🔨 Step 3: Building Docker images..."
echo ""

docker-compose build
echo -e "${GREEN}✅ Docker images built${NC}"
echo ""

# Step 4: Start services
echo "🚀 Step 4: Starting services..."
echo ""

docker-compose up -d
echo -e "${GREEN}✅ Services started${NC}"
echo ""

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Step 5: Check services
echo "🔍 Step 5: Checking services..."
echo ""

if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Services are running${NC}"
    docker-compose ps
else
    echo -e "${RED}❌ Some services failed to start${NC}"
    docker-compose logs
    exit 1
fi

echo ""

# Step 6: Initialize database
echo "💾 Step 6: Initializing database..."
echo ""

if docker exec iware-backend node scripts/init-database.js; then
    echo -e "${GREEN}✅ Database initialized${NC}"
else
    echo -e "${YELLOW}⚠️  Database initialization failed or already initialized${NC}"
fi

echo ""

# Step 7: Setup Nginx
echo "🌐 Step 7: Setting up Nginx..."
echo ""

if [ -f nginx-vps.conf ]; then
    sudo cp nginx-vps.conf /etc/nginx/sites-available/iwareid.com
    sudo ln -sf /etc/nginx/sites-available/iwareid.com /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    if sudo nginx -t; then
        sudo systemctl restart nginx
        echo -e "${GREEN}✅ Nginx configured${NC}"
    else
        echo -e "${RED}❌ Nginx configuration error${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ nginx-vps.conf not found${NC}"
    exit 1
fi

echo ""

# Step 8: SSL Certificate
echo "🔒 Step 8: SSL Certificate setup..."
echo ""
echo -e "${YELLOW}⚠️  Make sure your domain is pointing to this server${NC}"
read -p "Enter your domain (e.g., iwareid.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${YELLOW}⚠️  Skipping SSL setup${NC}"
else
    read -p "Setup SSL for $DOMAIN and www.$DOMAIN? (y/n): " SETUP_SSL
    if [ "$SETUP_SSL" = "y" ]; then
        sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN
        echo -e "${GREEN}✅ SSL certificate installed${NC}"
    else
        echo -e "${YELLOW}⚠️  SSL setup skipped${NC}"
        echo "You can run this later: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    fi
fi

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo "=========================================="
echo ""
echo "📊 Service Status:"
docker-compose ps
echo ""
echo "🌐 Access your application:"
if [ ! -z "$DOMAIN" ]; then
    echo "   https://$DOMAIN"
    echo "   https://www.$DOMAIN"
else
    echo "   http://$(curl -s ifconfig.me)"
fi
echo ""
echo "🔑 Default Login:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "📝 Useful commands:"
echo "   View logs:     docker-compose logs -f"
echo "   Restart:       docker-compose restart"
echo "   Stop:          docker-compose down"
echo "   Start:         docker-compose up -d"
echo ""
echo "⚠️  IMPORTANT: Change default admin password after first login!"
echo ""
