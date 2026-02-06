#!/bin/bash

# Quick setup script for iwareid.com domain
# Run this after deploying the application

echo "🌐 Setup Domain iwareid.com"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get VPS IP
echo -e "${YELLOW}📍 VPS IP Address:${NC}"
curl -s ifconfig.me
echo ""
echo ""

# Update backend environment
echo -e "${YELLOW}🔧 Updating backend environment...${NC}"
if [ -f backend/.env ]; then
    cp backend/.env backend/.env.backup
    echo -e "${GREEN}✅ Backup created: backend/.env.backup${NC}"
fi

cp backend/.env.production backend/.env
echo -e "${GREEN}✅ Updated backend/.env for production${NC}"
echo ""

# Update frontend environment
echo -e "${YELLOW}🔧 Updating frontend environment...${NC}"
cp frontend/.env.production frontend/.env
echo -e "${GREEN}✅ Updated frontend/.env for production${NC}"
echo ""

# Rebuild frontend
echo -e "${YELLOW}🏗️  Rebuilding frontend...${NC}"
cd frontend
npm run build
cd ..
echo -e "${GREEN}✅ Frontend rebuilt${NC}"
echo ""

# Setup Nginx
echo -e "${YELLOW}🔧 Setting up Nginx...${NC}"
if [ -f /etc/nginx/sites-available/iwareid.com ]; then
    echo -e "${YELLOW}⚠️  Nginx config already exists${NC}"
else
    sudo cp nginx-iwareid.conf /etc/nginx/sites-available/iwareid.com
    sudo ln -s /etc/nginx/sites-available/iwareid.com /etc/nginx/sites-enabled/
    echo -e "${GREEN}✅ Nginx config created${NC}"
fi

# Test Nginx
echo -e "${YELLOW}🧪 Testing Nginx configuration...${NC}"
sudo nginx -t

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
    sudo systemctl reload nginx
    echo -e "${GREEN}✅ Nginx reloaded${NC}"
else
    echo -e "${RED}❌ Nginx configuration error${NC}"
    exit 1
fi
echo ""

# Restart application
echo -e "${YELLOW}🔄 Restarting application...${NC}"
if command -v pm2 &> /dev/null; then
    pm2 restart all
    echo -e "${GREEN}✅ PM2 restarted${NC}"
elif command -v docker-compose &> /dev/null; then
    docker-compose restart
    echo -e "${GREEN}✅ Docker containers restarted${NC}"
else
    echo -e "${YELLOW}⚠️  Please restart your application manually${NC}"
fi
echo ""

# Setup SSL
echo -e "${YELLOW}🔒 Ready to setup SSL?${NC}"
echo "Run the following command to get SSL certificate:"
echo ""
echo -e "${GREEN}sudo certbot --nginx -d iwareid.com -d www.iwareid.com${NC}"
echo ""

# Summary
echo "============================"
echo -e "${GREEN}✅ Setup completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Point your domain DNS to this VPS IP"
echo "2. Wait for DNS propagation (5-30 minutes)"
echo "3. Run: sudo certbot --nginx -d iwareid.com -d www.iwareid.com"
echo "4. Access: https://iwareid.com"
echo ""
echo "📖 Full guide: SETUP-DOMAIN-IWAREID.md"
