#!/bin/bash

# ============================================
# Deploy Script untuk iwareid.com
# Full Stack: Frontend + Backend + MySQL
# ============================================

set -e  # Exit on error

echo "🚀 Starting deployment for iwareid.com..."
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DEPLOY_DIR="/var/www/backend"
COMPOSE_FILE="docker-compose.yml"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root (use sudo)${NC}"
    exit 1
fi

# Step 1: Navigate to deployment directory
echo -e "\n${YELLOW}📁 Step 1: Navigating to deployment directory...${NC}"
cd $DEPLOY_DIR || {
    echo -e "${RED}❌ Directory $DEPLOY_DIR not found!${NC}"
    exit 1
}
echo -e "${GREEN}✅ Current directory: $(pwd)${NC}"

# Step 2: Set permissions
echo -e "\n${YELLOW}📁 Step 2: Setting permissions...${NC}"
chmod -R 755 .
mkdir -p backend/uploads
chmod -R 777 backend/uploads
echo -e "${GREEN}✅ Permissions set${NC}"

# Step 3: Copy environment files
echo -e "\n${YELLOW}⚙️  Step 3: Setting up environment files...${NC}"
if [ -f "backend/.env.production" ]; then
    cp backend/.env.production backend/.env
    echo -e "${GREEN}✅ Backend .env copied${NC}"
else
    echo -e "${RED}❌ backend/.env.production not found!${NC}"
    exit 1
fi

if [ -f "frontend/.env.production" ]; then
    cp frontend/.env.production frontend/.env
    echo -e "${GREEN}✅ Frontend .env copied${NC}"
else
    echo -e "${RED}❌ frontend/.env.production not found!${NC}"
    exit 1
fi

# Step 4: Stop existing containers
echo -e "\n${YELLOW}🛑 Step 4: Stopping existing containers...${NC}"
docker-compose -f $COMPOSE_FILE down || echo "No containers to stop"
echo -e "${GREEN}✅ Containers stopped${NC}"

# Step 5: Remove old images (optional, uncomment if needed)
# echo -e "\n${YELLOW}🗑️  Step 5: Removing old images...${NC}"
# docker-compose -f $COMPOSE_FILE down --rmi all
# echo -e "${GREEN}✅ Old images removed${NC}"

# Step 6: Build and start containers
echo -e "\n${YELLOW}🐳 Step 6: Building and starting Docker containers...${NC}"
echo "This may take 5-10 minutes..."
docker-compose -f $COMPOSE_FILE up -d --build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Containers built and started${NC}"
else
    echo -e "${RED}❌ Failed to start containers${NC}"
    exit 1
fi

# Step 7: Wait for MySQL to be ready
echo -e "\n${YELLOW}⏳ Step 7: Waiting for MySQL to be ready...${NC}"
echo "Waiting 30 seconds..."
sleep 30

# Check MySQL health
MYSQL_READY=0
for i in {1..10}; do
    if docker exec iware-mysql mysqladmin ping -h localhost -u root -pJasadenam66/ --silent; then
        MYSQL_READY=1
        break
    fi
    echo "Waiting for MySQL... attempt $i/10"
    sleep 3
done

if [ $MYSQL_READY -eq 1 ]; then
    echo -e "${GREEN}✅ MySQL is ready${NC}"
else
    echo -e "${RED}❌ MySQL failed to start${NC}"
    docker logs iware-mysql
    exit 1
fi

# Step 8: Initialize database
echo -e "\n${YELLOW}🗄️  Step 8: Initializing database...${NC}"
docker exec iware-backend sh -c "DB_USER=root node scripts/init-database.js" || {
    echo -e "${YELLOW}⚠️  Database might already be initialized${NC}"
}

# Step 9: Show container status
echo -e "\n${YELLOW}📊 Step 9: Checking container status...${NC}"
docker-compose -f $COMPOSE_FILE ps

# Step 10: Show recent logs
echo -e "\n${YELLOW}📝 Step 10: Recent logs...${NC}"
docker-compose -f $COMPOSE_FILE logs --tail=20

# Step 11: Health checks
echo -e "\n${YELLOW}🏥 Step 11: Running health checks...${NC}"

# Check backend health
echo "Checking backend..."
sleep 5
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health || echo "000")
if [ "$BACKEND_HEALTH" = "200" ]; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend health check failed (HTTP $BACKEND_HEALTH)${NC}"
fi

# Check frontend
echo "Checking frontend..."
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
if [ "$FRONTEND_HEALTH" = "200" ]; then
    echo -e "${GREEN}✅ Frontend is healthy${NC}"
else
    echo -e "${RED}❌ Frontend health check failed (HTTP $FRONTEND_HEALTH)${NC}"
fi

# Final summary
echo -e "\n============================================"
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo -e "============================================"
echo ""
echo "📋 Next steps:"
echo "1. Setup Nginx reverse proxy:"
echo "   cp nginx-vps.conf /etc/nginx/sites-available/iwareid"
echo "   ln -s /etc/nginx/sites-available/iwareid /etc/nginx/sites-enabled/"
echo "   rm /etc/nginx/sites-enabled/default"
echo "   nginx -t"
echo "   systemctl restart nginx"
echo ""
echo "2. Install SSL certificate:"
echo "   certbot --nginx -d iwareid.com -d www.iwareid.com"
echo ""
echo "3. Access your application:"
echo "   http://localhost:3000 (Frontend)"
echo "   http://localhost:5000/api/health (Backend)"
echo "   https://iwareid.com (Production)"
echo ""
echo "📊 Useful commands:"
echo "   docker-compose logs -f              # View all logs"
echo "   docker-compose ps                   # Check status"
echo "   docker-compose restart              # Restart all"
echo "   docker-compose down                 # Stop all"
echo ""
echo "🔐 Default credentials:"
echo "   Admin: admin / admin123"
echo "   HRD: hrd / hrd123"
echo ""
echo -e "${YELLOW}⚠️  Remember to change default passwords!${NC}"
