#!/bin/bash

# VPS Quick Fix Script for IWARE Perizinan
# Usage: bash vps-quick-fix.sh

echo "=========================================="
echo "🔧 IWARE Perizinan VPS Quick Fix"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to wait with countdown
wait_with_countdown() {
    local seconds=$1
    local message=$2
    echo -e "${BLUE}⏳ $message${NC}"
    for ((i=$seconds; i>0; i--)); do
        echo -ne "   Waiting $i seconds...\r"
        sleep 1
    done
    echo -e "   ${GREEN}Done!${NC}                    "
}

# 1. Check current status
echo "1️⃣  Checking current status..."
echo "-----------------------------------"
KARYAWAN_COUNT=$(curl -s http://localhost:5001/api/karyawan | jq -r '.data | length' 2>/dev/null)

if [ ! -z "$KARYAWAN_COUNT" ] && [ "$KARYAWAN_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ System is working! ($KARYAWAN_COUNT karyawan found)${NC}"
    echo ""
    echo "No fix needed. Exiting..."
    exit 0
fi

echo -e "${YELLOW}⚠️  Issue detected. Starting fix...${NC}"
echo ""

# 2. Restart backend
echo "2️⃣  Restarting backend container..."
echo "-----------------------------------"
docker-compose restart backend
wait_with_countdown 30 "Waiting for backend to initialize and auto-import data..."
echo ""

# 3. Check if auto-import worked
echo "3️⃣  Verifying auto-import..."
echo "-----------------------------------"
KARYAWAN_COUNT=$(curl -s http://localhost:5001/api/karyawan | jq -r '.data | length' 2>/dev/null)

if [ ! -z "$KARYAWAN_COUNT" ] && [ "$KARYAWAN_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Auto-import successful! ($KARYAWAN_COUNT karyawan)${NC}"
    echo ""
    echo "=========================================="
    echo "✅ Fix Complete - System is now working!"
    echo "=========================================="
    exit 0
fi

echo -e "${YELLOW}⚠️  Auto-import didn't work. Trying manual import...${NC}"
echo ""

# 4. Manual import
echo "4️⃣  Running manual import script..."
echo "-----------------------------------"
docker exec -it iware-backend node scripts/import-real-karyawan.js
wait_with_countdown 10 "Waiting for import to complete..."
echo ""

# 5. Final verification
echo "5️⃣  Final verification..."
echo "-----------------------------------"
KARYAWAN_COUNT=$(curl -s http://localhost:5001/api/karyawan | jq -r '.data | length' 2>/dev/null)

if [ ! -z "$KARYAWAN_COUNT" ] && [ "$KARYAWAN_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Manual import successful! ($KARYAWAN_COUNT karyawan)${NC}"
    echo ""
    echo "=========================================="
    echo "✅ Fix Complete - System is now working!"
    echo "=========================================="
    exit 0
fi

# 6. If still not working, try full rebuild
echo -e "${RED}❌ Manual import failed. Trying full rebuild...${NC}"
echo ""

echo "6️⃣  Full rebuild (this may take a few minutes)..."
echo "-----------------------------------"
docker-compose down
wait_with_countdown 5 "Stopping containers..."
docker-compose up -d --build
wait_with_countdown 60 "Building and starting containers..."
echo ""

# 7. Final check
echo "7️⃣  Final check after rebuild..."
echo "-----------------------------------"
KARYAWAN_COUNT=$(curl -s http://localhost:5001/api/karyawan | jq -r '.data | length' 2>/dev/null)

if [ ! -z "$KARYAWAN_COUNT" ] && [ "$KARYAWAN_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Rebuild successful! ($KARYAWAN_COUNT karyawan)${NC}"
    echo ""
    echo "=========================================="
    echo "✅ Fix Complete - System is now working!"
    echo "=========================================="
else
    echo -e "${RED}❌ Fix failed. Manual intervention required.${NC}"
    echo ""
    echo "=========================================="
    echo "❌ Automatic fix failed"
    echo "=========================================="
    echo ""
    echo "Please check:"
    echo "1. Database credentials in .env.docker.production"
    echo "2. Backend logs: docker-compose logs backend"
    echo "3. MySQL logs: docker-compose logs mysql"
    echo ""
    echo "Or contact support with the output above."
fi
