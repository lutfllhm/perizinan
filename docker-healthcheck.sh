#!/bin/bash

# ============================================
# Docker Health Check Script
# Check status of all containers
# ============================================

echo "🏥 Docker Container Health Check"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if containers are running
echo "📊 Container Status:"
docker-compose ps
echo ""

# Check MySQL
echo -n "MySQL: "
if docker exec iware-mysql mysqladmin ping -h localhost -u root -p"${MYSQL_ROOT_PASSWORD:-Jasadenam66/}" --silent 2>/dev/null; then
    echo -e "${GREEN}✅ Healthy${NC}"
else
    echo -e "${RED}❌ Unhealthy${NC}"
    echo "MySQL Logs:"
    docker logs iware-mysql --tail=20
fi

# Check Backend
echo -n "Backend: "
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health 2>/dev/null || echo "000")
if [ "$BACKEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Healthy (HTTP $BACKEND_STATUS)${NC}"
else
    echo -e "${RED}❌ Unhealthy (HTTP $BACKEND_STATUS)${NC}"
    echo "Backend Logs:"
    docker logs iware-backend --tail=20
fi

# Check Frontend
echo -n "Frontend: "
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Healthy (HTTP $FRONTEND_STATUS)${NC}"
else
    echo -e "${RED}❌ Unhealthy (HTTP $FRONTEND_STATUS)${NC}"
    echo "Frontend Logs:"
    docker logs iware-frontend --tail=20
fi

echo ""
echo "📈 Resource Usage:"
docker stats --no-stream

echo ""
echo "💾 Disk Usage:"
docker system df

echo ""
echo "🔍 To view logs:"
echo "  docker-compose logs -f"
echo "  docker logs iware-mysql -f"
echo "  docker logs iware-backend -f"
echo "  docker logs iware-frontend -f"
