#!/bin/bash

# IWARE Perizinan - Quick Update Script
# Untuk update code tanpa full deployment

set -e

echo "🔄 Updating IWARE Perizinan..."
echo "================================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Pull latest code
print_info "Pulling latest code from GitHub..."
git pull origin main
print_success "Code updated"

# Rebuild and restart containers
print_info "Rebuilding Docker containers..."
docker-compose down
docker-compose up -d --build
print_success "Containers restarted"

# Wait for services
print_info "Waiting for services to start..."
sleep 20

# Check status
print_info "Checking container status..."
docker-compose ps

echo ""
echo "================================================"
print_success "🎉 Update Complete!"
echo "================================================"
echo ""
echo "📊 Useful Commands:"
echo "  • View logs: docker-compose logs -f"
echo "  • Check status: docker-compose ps"
echo "  • Restart specific service: docker-compose restart backend"
echo ""
