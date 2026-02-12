#!/bin/bash

# IWARE Perizinan - Monitoring Script
# Usage: bash monitor.sh

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

clear
echo "=========================================="
echo "  IWARE Perizinan - System Monitor"
echo "=========================================="
echo ""

# Function to check service health
check_service() {
    SERVICE=$1
    if docker-compose ps | grep $SERVICE | grep -q "Up"; then
        echo -e "${GREEN}✅ $SERVICE is running${NC}"
        return 0
    else
        echo -e "${RED}❌ $SERVICE is not running${NC}"
        return 1
    fi
}

# Function to check URL
check_url() {
    URL=$1
    NAME=$2
    if curl -s -o /dev/null -w "%{http_code}" $URL | grep -q "200"; then
        echo -e "${GREEN}✅ $NAME is accessible${NC}"
        return 0
    else
        echo -e "${RED}❌ $NAME is not accessible${NC}"
        return 1
    fi
}

# 1. Docker Services Status
echo -e "${BLUE}📦 Docker Services Status:${NC}"
check_service "mysql"
check_service "backend"
check_service "frontend"
echo ""

# 2. Service Health Checks
echo -e "${BLUE}🏥 Health Checks:${NC}"
check_url "http://localhost:5000/api/health" "Backend API"
check_url "http://localhost:3000" "Frontend"
echo ""

# 3. Container Resource Usage
echo -e "${BLUE}💻 Container Resource Usage:${NC}"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" | head -4
echo ""

# 4. System Resources
echo -e "${BLUE}🖥️  System Resources:${NC}"
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print "  " 100 - $1"%"}'

echo "Memory Usage:"
free -h | awk 'NR==2{printf "  Used: %s / %s (%.2f%%)\n", $3, $2, $3*100/$2}'

echo "Disk Usage:"
df -h / | awk 'NR==2{printf "  Used: %s / %s (%s)\n", $3, $2, $5}'
echo ""

# 5. Database Status
echo -e "${BLUE}🗄️  Database Status:${NC}"
if docker exec iware-mysql mysqladmin ping -h localhost -u iware -p${MYSQL_PASSWORD:-Jasadenam66/} 2>/dev/null | grep -q "alive"; then
    echo -e "${GREEN}✅ MySQL is alive${NC}"
    
    # Get database size
    DB_SIZE=$(docker exec iware-mysql mysql -u iware -p${MYSQL_PASSWORD:-Jasadenam66/} -e "SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' FROM information_schema.tables WHERE table_schema = 'iware_perizinan';" 2>/dev/null | tail -1)
    echo "  Database Size: ${DB_SIZE} MB"
    
    # Get table count
    TABLE_COUNT=$(docker exec iware-mysql mysql -u iware -p${MYSQL_PASSWORD:-Jasadenam66/} -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'iware_perizinan';" 2>/dev/null | tail -1)
    echo "  Tables: ${TABLE_COUNT}"
else
    echo -e "${RED}❌ MySQL is not responding${NC}"
fi
echo ""

# 6. Recent Logs (Errors)
echo -e "${BLUE}📋 Recent Errors (Last 10):${NC}"
ERROR_COUNT=$(docker-compose logs --tail=100 2>/dev/null | grep -i "error" | wc -l)
if [ $ERROR_COUNT -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $ERROR_COUNT errors in logs${NC}"
    docker-compose logs --tail=100 2>/dev/null | grep -i "error" | tail -10
else
    echo -e "${GREEN}✅ No recent errors${NC}"
fi
echo ""

# 7. Nginx Status
echo -e "${BLUE}🌐 Nginx Status:${NC}"
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx is running${NC}"
    
    # Check nginx error log
    NGINX_ERRORS=$(sudo tail -100 /var/log/nginx/error.log 2>/dev/null | wc -l)
    echo "  Recent errors: $NGINX_ERRORS"
else
    echo -e "${RED}❌ Nginx is not running${NC}"
fi
echo ""

# 8. SSL Certificate Status
echo -e "${BLUE}🔒 SSL Certificate Status:${NC}"
if command -v certbot >/dev/null 2>&1; then
    CERT_INFO=$(sudo certbot certificates 2>/dev/null | grep "Expiry Date" | head -1)
    if [ ! -z "$CERT_INFO" ]; then
        echo "  $CERT_INFO"
        
        # Check if expiring soon (30 days)
        EXPIRY_DATE=$(echo $CERT_INFO | grep -oP '\d{4}-\d{2}-\d{2}')
        DAYS_LEFT=$(( ($(date -d "$EXPIRY_DATE" +%s) - $(date +%s)) / 86400 ))
        
        if [ $DAYS_LEFT -lt 30 ]; then
            echo -e "${YELLOW}⚠️  Certificate expires in $DAYS_LEFT days${NC}"
        else
            echo -e "${GREEN}✅ Certificate valid for $DAYS_LEFT days${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  No SSL certificate found${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Certbot not installed${NC}"
fi
echo ""

# 9. Backup Status
echo -e "${BLUE}💾 Backup Status:${NC}"
if [ -d "backups" ]; then
    BACKUP_COUNT=$(ls -1 backups/*.sql 2>/dev/null | wc -l)
    if [ $BACKUP_COUNT -gt 0 ]; then
        echo "  Total backups: $BACKUP_COUNT"
        LATEST_BACKUP=$(ls -t backups/*.sql 2>/dev/null | head -1)
        if [ ! -z "$LATEST_BACKUP" ]; then
            BACKUP_DATE=$(stat -c %y "$LATEST_BACKUP" | cut -d' ' -f1)
            BACKUP_SIZE=$(du -h "$LATEST_BACKUP" | cut -f1)
            echo "  Latest backup: $BACKUP_DATE ($BACKUP_SIZE)"
            
            # Check if backup is recent (within 7 days)
            DAYS_OLD=$(( ($(date +%s) - $(stat -c %Y "$LATEST_BACKUP")) / 86400 ))
            if [ $DAYS_OLD -gt 7 ]; then
                echo -e "${YELLOW}⚠️  Last backup is $DAYS_OLD days old${NC}"
            else
                echo -e "${GREEN}✅ Backup is recent ($DAYS_OLD days old)${NC}"
            fi
        fi
    else
        echo -e "${YELLOW}⚠️  No backups found${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Backup directory not found${NC}"
fi
echo ""

# 10. Network Connectivity
echo -e "${BLUE}🌍 Network Connectivity:${NC}"
if ping -c 1 8.8.8.8 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Internet connection OK${NC}"
else
    echo -e "${RED}❌ No internet connection${NC}"
fi
echo ""

# Summary
echo "=========================================="
echo -e "${BLUE}📊 Summary${NC}"
echo "=========================================="

ISSUES=0

# Check critical services
docker-compose ps | grep -q "mysql.*Up" || ((ISSUES++))
docker-compose ps | grep -q "backend.*Up" || ((ISSUES++))
docker-compose ps | grep -q "frontend.*Up" || ((ISSUES++))

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ All systems operational${NC}"
else
    echo -e "${RED}⚠️  $ISSUES critical issue(s) detected${NC}"
    echo "Run 'docker-compose logs -f' for details"
fi

echo ""
echo "Last updated: $(date)"
echo ""
echo "Commands:"
echo "  View logs:     docker-compose logs -f"
echo "  Restart:       docker-compose restart"
echo "  Full status:   docker-compose ps"
echo ""
