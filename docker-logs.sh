#!/bin/bash

# ============================================
# Docker Logs Viewer
# Quick access to container logs
# ============================================

# Colors
BLUE='\033[0;34m'
NC='\033[0m'

echo "📝 Docker Container Logs"
echo "========================"
echo ""
echo "Select container to view logs:"
echo "1) All containers"
echo "2) MySQL"
echo "3) Backend"
echo "4) Frontend"
echo "5) Follow all logs (real-time)"
echo ""
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo -e "\n${BLUE}=== All Container Logs ===${NC}"
        docker-compose logs --tail=100
        ;;
    2)
        echo -e "\n${BLUE}=== MySQL Logs ===${NC}"
        docker logs iware-mysql --tail=100
        ;;
    3)
        echo -e "\n${BLUE}=== Backend Logs ===${NC}"
        docker logs iware-backend --tail=100
        ;;
    4)
        echo -e "\n${BLUE}=== Frontend Logs ===${NC}"
        docker logs iware-frontend --tail=100
        ;;
    5)
        echo -e "\n${BLUE}=== Following All Logs (Ctrl+C to stop) ===${NC}"
        docker-compose logs -f
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
