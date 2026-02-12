#!/bin/bash

# Quick Commands untuk IWARE Perizinan
# Usage: bash quick-commands.sh [command]

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

case "$1" in
    start)
        echo -e "${GREEN}🚀 Starting services...${NC}"
        docker-compose up -d
        docker-compose ps
        ;;
    
    stop)
        echo -e "${YELLOW}⏸️  Stopping services...${NC}"
        docker-compose down
        ;;
    
    restart)
        echo -e "${YELLOW}🔄 Restarting services...${NC}"
        docker-compose restart
        docker-compose ps
        ;;
    
    logs)
        echo -e "${GREEN}📋 Showing logs...${NC}"
        docker-compose logs -f --tail=100
        ;;
    
    status)
        echo -e "${GREEN}📊 Service Status:${NC}"
        docker-compose ps
        echo ""
        echo -e "${GREEN}💾 Disk Usage:${NC}"
        df -h | grep -E "Filesystem|/$"
        echo ""
        echo -e "${GREEN}🧠 Memory Usage:${NC}"
        free -h
        ;;
    
    backup)
        echo -e "${GREEN}💾 Creating database backup...${NC}"
        mkdir -p backups
        BACKUP_FILE="backups/backup-$(date +%Y%m%d-%H%M%S).sql"
        docker exec iware-mysql mysqldump -u iware -p iware_perizinan > $BACKUP_FILE
        echo -e "${GREEN}✅ Backup created: $BACKUP_FILE${NC}"
        ls -lh backups/ | tail -5
        ;;
    
    restore)
        if [ -z "$2" ]; then
            echo -e "${YELLOW}Usage: bash quick-commands.sh restore <backup-file>${NC}"
            echo "Available backups:"
            ls -lh backups/
            exit 1
        fi
        echo -e "${YELLOW}⚠️  Restoring database from $2${NC}"
        read -p "Are you sure? (y/n): " CONFIRM
        if [ "$CONFIRM" = "y" ]; then
            docker exec -i iware-mysql mysql -u iware -p iware_perizinan < $2
            echo -e "${GREEN}✅ Database restored${NC}"
        fi
        ;;
    
    update)
        echo -e "${GREEN}🔄 Updating application...${NC}"
        git pull
        docker-compose up -d --build
        echo -e "${GREEN}✅ Application updated${NC}"
        ;;
    
    clean)
        echo -e "${YELLOW}🧹 Cleaning up...${NC}"
        docker system prune -f
        echo -e "${GREEN}✅ Cleanup completed${NC}"
        ;;
    
    init-db)
        echo -e "${GREEN}💾 Initializing database...${NC}"
        docker exec -it iware-backend node scripts/init-database.js
        ;;
    
    mysql)
        echo -e "${GREEN}🗄️  Connecting to MySQL...${NC}"
        docker exec -it iware-mysql mysql -u iware -p iware_perizinan
        ;;
    
    backend-shell)
        echo -e "${GREEN}🐚 Opening backend shell...${NC}"
        docker exec -it iware-backend sh
        ;;
    
    ssl)
        if [ -z "$2" ]; then
            echo -e "${YELLOW}Usage: bash quick-commands.sh ssl <domain>${NC}"
            exit 1
        fi
        echo -e "${GREEN}🔒 Setting up SSL for $2${NC}"
        sudo certbot --nginx -d $2 -d www.$2
        ;;
    
    ssl-renew)
        echo -e "${GREEN}🔒 Renewing SSL certificates...${NC}"
        sudo certbot renew
        sudo systemctl restart nginx
        ;;
    
    *)
        echo "IWARE Perizinan - Quick Commands"
        echo "================================"
        echo ""
        echo "Usage: bash quick-commands.sh [command]"
        echo ""
        echo "Available commands:"
        echo "  start          - Start all services"
        echo "  stop           - Stop all services"
        echo "  restart        - Restart all services"
        echo "  logs           - View logs (real-time)"
        echo "  status         - Show service status"
        echo "  backup         - Backup database"
        echo "  restore <file> - Restore database from backup"
        echo "  update         - Update application from git"
        echo "  clean          - Clean up Docker resources"
        echo "  init-db        - Initialize database"
        echo "  mysql          - Connect to MySQL"
        echo "  backend-shell  - Open backend container shell"
        echo "  ssl <domain>   - Setup SSL certificate"
        echo "  ssl-renew      - Renew SSL certificates"
        echo ""
        ;;
esac
