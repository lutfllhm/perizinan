#!/bin/bash

# VPS Diagnostic Script for IWARE Perizinan
# Usage: bash vps-diagnostic.sh

echo "=========================================="
echo "🔍 IWARE Perizinan VPS Diagnostic Tool"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Check Docker Containers
echo "1️⃣  Checking Docker Containers..."
echo "-----------------------------------"
docker-compose ps
echo ""

# 2. Check Backend Health
echo "2️⃣  Checking Backend Health..."
echo "-----------------------------------"
HEALTH_CHECK=$(curl -s http://localhost:5001/api/health)
if [ -z "$HEALTH_CHECK" ]; then
    echo -e "${RED}❌ Backend tidak merespons${NC}"
else
    echo -e "${GREEN}✅ Backend OK: $HEALTH_CHECK${NC}"
fi
echo ""

# 3. Check Karyawan API
echo "3️⃣  Checking Karyawan API..."
echo "-----------------------------------"
KARYAWAN_CHECK=$(curl -s http://localhost:5001/api/karyawan | jq -r '.data | length' 2>/dev/null)
if [ -z "$KARYAWAN_CHECK" ] || [ "$KARYAWAN_CHECK" == "null" ]; then
    echo -e "${RED}❌ API Karyawan error atau tidak ada data${NC}"
elif [ "$KARYAWAN_CHECK" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Database karyawan kosong (0 records)${NC}"
else
    echo -e "${GREEN}✅ Database karyawan OK ($KARYAWAN_CHECK records)${NC}"
fi
echo ""

# 4. Check Database Connection
echo "4️⃣  Checking Database..."
echo "-----------------------------------"
DB_COUNT=$(docker exec iware-mysql mysql -u iware -pYourSecureDBPassword2026!@# iware_perizinan -e "SELECT COUNT(*) as total FROM karyawan;" -s -N 2>/dev/null)
if [ -z "$DB_COUNT" ]; then
    echo -e "${RED}❌ Tidak bisa connect ke database${NC}"
elif [ "$DB_COUNT" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Database karyawan kosong${NC}"
else
    echo -e "${GREEN}✅ Database OK ($DB_COUNT karyawan)${NC}"
fi
echo ""

# 5. Check Backend Logs
echo "5️⃣  Recent Backend Logs..."
echo "-----------------------------------"
docker-compose logs backend | tail -20
echo ""

# 6. Check Nginx
echo "6️⃣  Checking Nginx..."
echo "-----------------------------------"
sudo nginx -t 2>&1
echo ""

# 7. Check Ports
echo "7️⃣  Checking Ports..."
echo "-----------------------------------"
echo "Port 5001 (Backend):"
sudo netstat -tulpn | grep :5001 || echo "  Not in use"
echo "Port 3001 (Frontend):"
sudo netstat -tulpn | grep :3001 || echo "  Not in use"
echo "Port 3307 (MySQL):"
sudo netstat -tulpn | grep :3307 || echo "  Not in use"
echo ""

# 8. Summary
echo "=========================================="
echo "📊 SUMMARY"
echo "=========================================="

# Check if all services are running
BACKEND_RUNNING=$(docker-compose ps | grep iware-backend | grep "Up" | wc -l)
FRONTEND_RUNNING=$(docker-compose ps | grep iware-frontend | grep "Up" | wc -l)
MYSQL_RUNNING=$(docker-compose ps | grep iware-mysql | grep "Up" | wc -l)

if [ "$BACKEND_RUNNING" -eq 1 ] && [ "$FRONTEND_RUNNING" -eq 1 ] && [ "$MYSQL_RUNNING" -eq 1 ]; then
    echo -e "${GREEN}✅ All containers are running${NC}"
else
    echo -e "${RED}❌ Some containers are not running${NC}"
fi

if [ ! -z "$KARYAWAN_CHECK" ] && [ "$KARYAWAN_CHECK" -gt 0 ]; then
    echo -e "${GREEN}✅ Karyawan data available${NC}"
else
    echo -e "${RED}❌ Karyawan data missing${NC}"
    echo ""
    echo "🔧 RECOMMENDED ACTION:"
    echo "   Run: docker-compose restart backend"
    echo "   Wait 30 seconds for auto-import to complete"
fi

echo ""
echo "=========================================="
echo "✅ Diagnostic Complete"
echo "=========================================="
