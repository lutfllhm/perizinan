#!/bin/bash

# IWARE Perizinan - VPS Deployment Script
# Domain: iwareid.com

set -e

echo "🚀 Starting IWARE Perizinan Deployment..."
echo "================================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="iwareid.com"
APP_DIR="/var/www/iware"
EMAIL="admin@iwareid.com"  # Change this to your email

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Step 1: Update system
print_info "Step 1: Updating system packages..."
apt update && apt upgrade -y
print_success "System updated"

# Step 2: Install Docker
print_info "Step 2: Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl enable docker
    systemctl start docker
    print_success "Docker installed"
else
    print_success "Docker already installed"
fi

# Step 3: Install Docker Compose
print_info "Step 3: Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed"
else
    print_success "Docker Compose already installed"
fi

# Step 4: Install Nginx
print_info "Step 4: Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
    print_success "Nginx installed"
else
    print_success "Nginx already installed"
fi

# Step 5: Install Certbot for SSL
print_info "Step 5: Installing Certbot..."
if ! command -v certbot &> /dev/null; then
    apt install -y certbot python3-certbot-nginx
    print_success "Certbot installed"
else
    print_success "Certbot already installed"
fi

# Step 6: Setup application directory
print_info "Step 6: Setting up application directory..."
mkdir -p $APP_DIR
cd $APP_DIR

# If this script is run from the repo, copy files
if [ -f "docker-compose.yml" ]; then
    print_info "Files already in place"
else
    print_error "Please clone your repository to $APP_DIR first"
    exit 1
fi

# Step 7: Setup environment file
print_info "Step 7: Setting up environment variables..."
if [ ! -f ".env" ]; then
    cp .env.docker .env
    print_success "Environment file created"
else
    print_info "Environment file already exists"
fi

# Step 8: Create uploads directory
print_info "Step 8: Creating uploads directory..."
mkdir -p backend/uploads
chmod 755 backend/uploads
print_success "Uploads directory created"

# Step 9: Start Docker containers
print_info "Step 9: Starting Docker containers..."
docker-compose down 2>/dev/null || true
docker-compose up -d --build
print_success "Docker containers started"

# Wait for services to be ready
print_info "Waiting for services to start..."
sleep 30

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    print_success "All containers are running"
else
    print_error "Some containers failed to start"
    docker-compose logs
    exit 1
fi

# Step 10: Configure Nginx
print_info "Step 10: Configuring Nginx..."
cp nginx-vps.conf /etc/nginx/sites-available/$DOMAIN

# Remove default site if exists
rm -f /etc/nginx/sites-enabled/default

# Create symlink
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t
if [ $? -eq 0 ]; then
    systemctl reload nginx
    print_success "Nginx configured"
else
    print_error "Nginx configuration error"
    exit 1
fi

# Step 11: Setup SSL with Let's Encrypt
print_info "Step 11: Setting up SSL certificate..."
print_info "Make sure your domain $DOMAIN points to this server's IP"
read -p "Press Enter to continue with SSL setup (or Ctrl+C to cancel)..."

certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect

if [ $? -eq 0 ]; then
    print_success "SSL certificate installed"
    
    # Setup auto-renewal
    systemctl enable certbot.timer
    systemctl start certbot.timer
    print_success "SSL auto-renewal configured"
else
    print_error "SSL setup failed. You can run it manually later with:"
    echo "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi

# Step 12: Setup firewall
print_info "Step 12: Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    print_success "Firewall configured"
else
    print_info "UFW not installed, skipping firewall setup"
fi

# Step 13: Create backup script
print_info "Step 13: Creating backup script..."
cat > /usr/local/bin/backup-iware.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/iware"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup database
docker exec iware-mysql mysqldump -u iware -pIwareDB2026!@# iware_perizinan > $BACKUP_DIR/db_$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/iware/backend/uploads

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /usr/local/bin/backup-iware.sh
print_success "Backup script created"

# Setup daily backup cron
print_info "Setting up daily backup..."
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-iware.sh") | crontab -
print_success "Daily backup scheduled at 2 AM"

# Final checks
echo ""
echo "================================================"
print_success "🎉 Deployment Complete!"
echo "================================================"
echo ""
echo "📋 Summary:"
echo "  • Domain: https://$DOMAIN"
echo "  • Backend API: https://$DOMAIN/api"
echo "  • Database: MySQL (Docker container)"
echo "  • SSL: Let's Encrypt"
echo "  • Backup: Daily at 2 AM"
echo ""
echo "🔐 Default Login:"
echo "  • Username: admin"
echo "  • Password: admin123"
echo "  ⚠️  CHANGE PASSWORD IMMEDIATELY!"
echo ""
echo "📊 Useful Commands:"
echo "  • View logs: docker-compose logs -f"
echo "  • Restart: docker-compose restart"
echo "  • Stop: docker-compose down"
echo "  • Start: docker-compose up -d"
echo "  • Backup: /usr/local/bin/backup-iware.sh"
echo ""
echo "🔍 Check Status:"
echo "  • Containers: docker-compose ps"
echo "  • Nginx: systemctl status nginx"
echo "  • SSL: certbot certificates"
echo ""
print_info "Visit https://$DOMAIN to access your application"
echo "================================================"
