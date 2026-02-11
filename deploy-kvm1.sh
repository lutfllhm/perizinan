#!/bin/bash

# ============================================
# Deploy Script untuk KVM 1 (2GB RAM)
# Optimized for low resource VPS
# ============================================

set -e

echo "🚀 Starting KVM 1 Deployment for iwareid.com..."
echo "============================================"
echo "⚠️  This is optimized for 2GB RAM VPS"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
DEPLOY_DIR="/var/www/backend"
COMPOSE_FILE="docker-compose.yml"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root (use sudo)${NC}"
    exit 1
fi

# Check available memory
TOTAL_MEM=$(free -m | awk 'NR==2{print $2}')
if [ "$TOTAL_MEM" -lt 1800 ]; then
    echo -e "${RED}❌ Insufficient memory! Need at least 2GB RAM${NC}"
    echo "Available: ${TOTAL_MEM}MB"
    exit 1
fi

# Check if swap exists
SWAP_SIZE=$(free -m | awk 'NR==3{print $2}')
if [ "$SWAP_SIZE" -lt 1000 ]; then
    echo -e "${YELLOW}⚠️  Warning: No swap detected or swap too small${NC}"
    echo "Recommended: Create 2GB swap file"
    echo ""
    read -p "Create swap now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Creating 2GB swap..."
        fallocate -l 2G /swapfile
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile
        echo '/swapfile none swap sw 0 0' >> /etc/fstab
        sysctl vm.swappiness=10
        echo 'vm.swappiness=10' >> /etc/sysctl.conf
        echo -e "${GREEN}✅ Swap created${NC}"
    fi
fi

# Navigate to deployment directory
echo -e "\n${YELLOW}📁 Step 1: Navigating to deployment directory...${NC}"
cd $DEPLOY_DIR || {
    echo -e "${RED}❌ Directory $DEPLOY_DIR not found!${NC}"
    exit 1
}
echo -e "${GREEN}✅ Current directory: $(pwd)${NC}"

# Set permissions
echo -e "\n${YELLOW}📁 Step 2: Setting permissions...${NC}"
chmod -R 755 .
mkdir -p backend/uploads
chmod -R 777 backend/uploads
echo -e "${GREEN}✅ Permissions set${NC}"

# Copy environment files
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

# Stop existing containers
echo -e "\n${YELLOW}🛑 Step 4: Stopping existing containers...${NC}"
docker-compose -f $COMPOSE_FILE down || echo "No containers to stop"
echo -e "${GREEN}✅ Containers stopped${NC}"

# Clean up to free memory
echo -e "\n${YELLOW}🧹 Step 5: Cleaning up Docker to free memory...${NC}"
docker system prune -f
echo -e "${GREEN}✅ Cleanup complete${NC}"

# Build and start containers ONE BY ONE (important for low RAM)
echo -e "\n${YELLOW}🐳 Step 6: Building containers (one by one to save RAM)...${NC}"
echo "This will take 10-15 minutes on KVM 1..."
echo ""

# MySQL first
echo -e "${YELLOW}Building MySQL...${NC}"
docker-compose -f $COMPOSE_FILE up -d mysql
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ MySQL container started${NC}"
else
    echo -e "${RED}❌ Failed to start MySQL${NC}"
    exit 1
fi

# Wait for MySQL
echo -e "${YELLOW}⏳ Waiting for MySQL to be ready (60 seconds)...${NC}"
sleep 60

# Check MySQL health
MYSQL_READY=0
for i in {1..10}; do
    if docker exec iware-mysql mysqladmin ping -h localhost -u root -pJasadenam66/ --silent 2>/dev/null; then
        MYSQL_READY=1
        break
    fi
    echo "Waiting for MySQL... attempt $i/10"
    sleep 5
done

if [ $MYSQL_READY -eq 1 ]; then
    echo -e "${GREEN}✅ MySQL is ready${NC}"
else
    echo -e "${RED}❌ MySQL failed to start${NC}"
    docker logs iware-mysql
    exit 1
fi

# Backend second
echo -e "\n${YELLOW}Building Backend...${NC}"
docker-compose -f $COMPOSE_FILE up -d backend
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend container started${NC}"
else
    echo -e "${RED}❌ Failed to start Backend${NC}"
    exit 1
fi

# Wait for backend
echo -e "${YELLOW}⏳ Waiting for Backend to be ready (30 seconds)...${NC}"
sleep 30

# Frontend last
echo -e "\n${YELLOW}Building Frontend...${NC}"
docker-compose -f $COMPOSE_FILE up -d frontend
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend container started${NC}"
else
    echo -e "${RED}❌ Failed to start Frontend${NC}"
    exit 1
fi

# Wait for frontend
echo -e "${YELLOW}⏳ Waiting for Frontend to be ready (30 seconds)...${NC}"
sleep 30

# Initialize database
echo -e "\n${YELLOW}🗄️  Step 7: Initializing database...${NC}"
docker exec iware-backend sh -c "DB_USER=root node scripts/init-database.js" || {
    echo -e "${YELLOW}⚠️  Database might already be initialized${NC}"
}

# Show container status
echo -e "\n${YELLOW}📊 Step 8: Checking container status...${NC}"
docker-compose -f $COMPOSE_FILE ps

# Show memory usage
echo -e "\n${YELLOW}💾 Step 9: Checking memory usage...${NC}"
free -h
echo ""
docker stats --no-stream

# Health checks
echo -e "\n${YELLOW}🏥 Step 10: Running health checks...${NC}"

# Check backend
echo "Checking backend..."
sleep 5
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health 2>/dev/null || echo "000")
if [ "$BACKEND_HEALTH" = "200" ]; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${YELLOW}⚠️  Backend health check: HTTP $BACKEND_HEALTH${NC}"
fi

# Check frontend
echo "Checking frontend..."
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
if [ "$FRONTEND_HEALTH" = "200" ]; then
    echo -e "${GREEN}✅ Frontend is healthy${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend health check: HTTP $FRONTEND_HEALTH${NC}"
fi

# Final summary
echo -e "\n============================================"
echo -e "${GREEN}✅ KVM 1 Deployment completed!${NC}"
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
echo "📊 Resource monitoring:"
echo "   free -h                    # Check memory"
echo "   docker stats               # Check containers"
echo "   docker-compose logs -f     # View logs"
echo ""
echo "🔐 Default credentials:"
echo "   Admin: admin / admin123"
echo "   HRD: hrd / hrd123"
echo ""
echo -e "${YELLOW}⚠️  KVM 1 Performance Notes:${NC}"
echo "   - Response time: 2-5 seconds (normal)"
echo "   - Max concurrent users: 5-10"
echo "   - Restart if memory > 85%: docker-compose restart"
echo "   - Consider upgrade to KVM 2 for better performance"
echo ""
echo -e "${YELLOW}⚠️  Remember to change default passwords!${NC}"
