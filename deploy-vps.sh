#!/bin/bash

# ============================================
# Deploy Script untuk iwareid.com
# Full Stack: Frontend + Backend + MySQL
# VPS Deployment Automation
# ============================================

set -e  # Exit on error

echo "🚀 Starting deployment for iwareid.com..."
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOY_DIR="$(pwd)"
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

# Functions
print_step() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Step 1: Verify deployment directory
print_step "Step 1: Verifying deployment directory"
echo "Current directory: $DEPLOY_DIR"

if [ ! -f "$COMPOSE_FILE" ]; then
    print_error "docker-compose.yml not found in current directory!"
    exit 1
fi

if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "backend/ or frontend/ directory not found!"
    exit 1
fi

print_success "Deployment directory verified"

# Step 2: Create .env file if not exists
print_step "Step 2: Setting up environment variables"

if [ ! -f "$ENV_FILE" ]; then
    print_warning ".env file not found, creating from defaults..."
    cat > "$ENV_FILE" << 'EOF'
# MySQL Configuration
MYSQL_ROOT_PASSWORD=Jasadenam66/
MYSQL_DATABASE=iware_perizinan
MYSQL_USER=iware
MYSQL_PASSWORD=Jasadenam66/

# Backend Configuration
BACKEND_PORT=5000
NODE_ENV=production
JWT_SECRET=d73d71a47452c7af78f6bd888005afee23adba5f936da33d67ce5baed764db62

# Frontend Configuration
REACT_APP_API_URL=https://iwareid.com/api
FRONTEND_URL=https://iwareid.com,https://www.iwareid.com

# Optional
WHATSAPP_ENABLED=false
EOF
    print_success ".env file created"
else
    print_success ".env file already exists"
fi

# Step 3: Set permissions
print_step "Step 3: Setting permissions"
chmod -R 755 .
mkdir -p backend/uploads backend/logs
chmod -R 777 backend/uploads backend/logs
print_success "Permissions set"

# Step 4: Setup environment files for containers
print_step "Step 4: Setting up container environment files"

# Backend .env
if [ -f "backend/.env.production" ]; then
    cp backend/.env.production backend/.env
    print_success "Backend .env copied from .env.production"
elif [ -f "backend/.env.example" ]; then
    cp backend/.env.example backend/.env
    print_warning "Backend .env copied from .env.example (please verify settings)"
else
    print_warning "No backend .env template found, using docker-compose environment"
fi

# Frontend .env
if [ -f "frontend/.env.production" ]; then
    cp frontend/.env.production frontend/.env
    print_success "Frontend .env copied from .env.production"
elif [ -f "frontend/.env.example" ]; then
    cp frontend/.env.example frontend/.env
    print_warning "Frontend .env copied from .env.example (please verify settings)"
else
    print_warning "No frontend .env template found, using docker-compose build args"
fi

# Step 5: Check Docker installation
print_step "Step 5: Checking Docker installation"

if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed!"
    echo "Install Docker first: curl -fsSL https://get.docker.com | sh"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed!"
    echo "Install Docker Compose first"
    exit 1
fi

print_success "Docker $(docker --version)"
print_success "$(docker-compose --version)"

# Step 6: Stop existing containers
print_step "Step 6: Stopping existing containers"
docker-compose -f "$COMPOSE_FILE" down 2>/dev/null || print_warning "No containers to stop"
print_success "Containers stopped"

# Step 7: Clean up (optional)
print_step "Step 7: Cleaning up old resources"
echo "Removing unused Docker resources..."
docker system prune -f --volumes 2>/dev/null || true
print_success "Cleanup completed"

# Step 8: Pull base images
print_step "Step 8: Pulling base Docker images"
docker pull mysql:8.0
docker pull node:18-alpine
docker pull nginx:alpine
print_success "Base images pulled"

# Step 9: Build and start containers
print_step "Step 9: Building and starting containers"
echo "This may take 5-10 minutes on first run..."
echo ""

docker-compose -f "$COMPOSE_FILE" up -d --build

if [ $? -eq 0 ]; then
    print_success "Containers built and started"
else
    print_error "Failed to start containers"
    echo ""
    echo "Showing logs:"
    docker-compose -f "$COMPOSE_FILE" logs --tail=50
    exit 1
fi

# Step 10: Wait for services to be healthy
print_step "Step 10: Waiting for services to be healthy"

echo "Waiting for MySQL to be ready..."
MYSQL_READY=0
for i in {1..30}; do
    if docker exec iware-mysql mysqladmin ping -h localhost -u root -p"${MYSQL_ROOT_PASSWORD:-Jasadenam66/}" --silent 2>/dev/null; then
        MYSQL_READY=1
        break
    fi
    echo -n "."
    sleep 2
done
echo ""

if [ $MYSQL_READY -eq 1 ]; then
    print_success "MySQL is ready"
else
    print_error "MySQL failed to start"
    echo "MySQL logs:"
    docker logs iware-mysql --tail=50
    exit 1
fi

echo ""
echo "Waiting for Backend to be ready..."
BACKEND_READY=0
for i in {1..30}; do
    if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
        BACKEND_READY=1
        break
    fi
    echo -n "."
    sleep 2
done
echo ""

if [ $BACKEND_READY -eq 1 ]; then
    print_success "Backend is ready"
else
    print_warning "Backend might still be starting (check logs)"
fi

echo ""
echo "Waiting for Frontend to be ready..."
FRONTEND_READY=0
for i in {1..20}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        FRONTEND_READY=1
        break
    fi
    echo -n "."
    sleep 2
done
echo ""

if [ $FRONTEND_READY -eq 1 ]; then
    print_success "Frontend is ready"
else
    print_warning "Frontend might still be starting (check logs)"
fi

# Step 11: Initialize database
print_step "Step 11: Initializing database"
sleep 5

if docker exec iware-backend node scripts/init-database.js 2>/dev/null; then
    print_success "Database initialized"
else
    print_warning "Database might already be initialized or init script not found"
fi

# Step 12: Show container status
print_step "Step 12: Container Status"
docker-compose -f "$COMPOSE_FILE" ps

# Step 13: Health checks
print_step "Step 13: Running health checks"

# Check MySQL
echo -n "MySQL: "
if docker exec iware-mysql mysqladmin ping -h localhost -u root -p"${MYSQL_ROOT_PASSWORD:-Jasadenam66/}" --silent 2>/dev/null; then
    print_success "Healthy"
else
    print_error "Unhealthy"
fi

# Check Backend
echo -n "Backend: "
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health 2>/dev/null || echo "000")
if [ "$BACKEND_STATUS" = "200" ]; then
    print_success "Healthy (HTTP $BACKEND_STATUS)"
else
    print_error "Unhealthy (HTTP $BACKEND_STATUS)"
fi

# Check Frontend
echo -n "Frontend: "
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
if [ "$FRONTEND_STATUS" = "200" ]; then
    print_success "Healthy (HTTP $FRONTEND_STATUS)"
else
    print_error "Unhealthy (HTTP $FRONTEND_STATUS)"
fi

# Step 14: Show recent logs
print_step "Step 14: Recent logs"
echo "Last 10 lines from each service:"
echo ""
echo "=== MySQL ==="
docker logs iware-mysql --tail=10 2>&1 | tail -10
echo ""
echo "=== Backend ==="
docker logs iware-backend --tail=10 2>&1 | tail -10
echo ""
echo "=== Frontend ==="
docker logs iware-frontend --tail=10 2>&1 | tail -10

# Final summary
echo ""
print_step "🎉 Deployment Summary"
echo ""
print_success "Deployment completed successfully!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  Setup Nginx reverse proxy:"
echo "   ${BLUE}cp nginx-vps.conf /etc/nginx/sites-available/iwareid${NC}"
echo "   ${BLUE}ln -s /etc/nginx/sites-available/iwareid /etc/nginx/sites-enabled/${NC}"
echo "   ${BLUE}rm -f /etc/nginx/sites-enabled/default${NC}"
echo "   ${BLUE}nginx -t${NC}"
echo "   ${BLUE}systemctl restart nginx${NC}"
echo ""
echo "2️⃣  Install SSL certificate:"
echo "   ${BLUE}certbot --nginx -d iwareid.com -d www.iwareid.com${NC}"
echo ""
echo "3️⃣  Configure firewall:"
echo "   ${BLUE}ufw allow 22/tcp${NC}"
echo "   ${BLUE}ufw allow 80/tcp${NC}"
echo "   ${BLUE}ufw allow 443/tcp${NC}"
echo "   ${BLUE}ufw enable${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Access URLs:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Frontend:  ${GREEN}http://localhost:3000${NC}"
echo "   Backend:   ${GREEN}http://localhost:5000/api/health${NC}"
echo "   MySQL:     ${GREEN}localhost:3306${NC}"
echo "   Production: ${GREEN}https://iwareid.com${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Useful Commands:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   ${BLUE}docker-compose logs -f${NC}              # View all logs"
echo "   ${BLUE}docker-compose logs -f backend${NC}      # View backend logs"
echo "   ${BLUE}docker-compose ps${NC}                   # Check status"
echo "   ${BLUE}docker-compose restart${NC}              # Restart all"
echo "   ${BLUE}docker-compose restart backend${NC}      # Restart backend only"
echo "   ${BLUE}docker-compose down${NC}                 # Stop all"
echo "   ${BLUE}docker-compose up -d${NC}                # Start all"
echo "   ${BLUE}docker stats${NC}                        # Resource usage"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Default Credentials:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Admin: ${GREEN}admin${NC} / ${GREEN}admin123${NC}"
echo "   HRD:   ${GREEN}hrd${NC} / ${GREEN}hrd123${NC}"
echo ""
print_warning "IMPORTANT: Change default passwords after first login!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
