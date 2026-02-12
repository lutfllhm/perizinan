#!/bin/bash

# ============================================
# Docker Restart Script
# Quick restart for containers
# ============================================

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🔄 Docker Container Restart"
echo "==========================="
echo ""
echo "Select what to restart:"
echo "1) All containers"
echo "2) MySQL only"
echo "3) Backend only"
echo "4) Frontend only"
echo "5) Backend + Frontend"
echo ""
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo -e "\n${YELLOW}Restarting all containers...${NC}"
        docker-compose restart
        echo -e "${GREEN}✅ All containers restarted${NC}"
        ;;
    2)
        echo -e "\n${YELLOW}Restarting MySQL...${NC}"
        docker-compose restart mysql
        echo -e "${GREEN}✅ MySQL restarted${NC}"
        ;;
    3)
        echo -e "\n${YELLOW}Restarting Backend...${NC}"
        docker-compose restart backend
        echo -e "${GREEN}✅ Backend restarted${NC}"
        ;;
    4)
        echo -e "\n${YELLOW}Restarting Frontend...${NC}"
        docker-compose restart frontend
        echo -e "${GREEN}✅ Frontend restarted${NC}"
        ;;
    5)
        echo -e "\n${YELLOW}Restarting Backend + Frontend...${NC}"
        docker-compose restart backend frontend
        echo -e "${GREEN}✅ Backend and Frontend restarted${NC}"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}Current status:${NC}"
docker-compose ps
