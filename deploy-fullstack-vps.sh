#!/bin/bash

# Deploy Script untuk Full Stack di VPS
# Frontend + Backend + MySQL di satu VPS

echo "🚀 Starting Full Stack Deployment for iwareid.com..."

# Set working directory
DEPLOY_DIR="/var/www/backend"
cd $DEPLOY_DIR || exit

# Set permissions
echo "📁 Setting permissions..."
chmod -R 755 .
mkdir -p backend/uploads
chmod -R 777 backend/uploads

# Copy environment files
echo "⚙️ Copying environment files..."
cp backend/.env.production backend/.env
cp frontend/.env.production frontend/.env

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose-fullstack.yml down

# Build and start containers
echo "🐳 Building and starting Docker containers..."
docker-compose -f docker-compose-fullstack.yml up -d --build

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
sleep 30

# Check if database needs initialization
echo "🗄️ Initializing database..."
docker exec iware-backend sh -c "DB_USER=root node scripts/init-database.js" || echo "Database already initialized"

# Show container status
echo "📊 Container status:"
docker-compose -f docker-compose-fullstack.yml ps

# Show logs
echo "📝 Recent logs:"
docker-compose -f docker-compose-fullstack.yml logs --tail=50

echo ""
echo "✅ Deployment completed!"
echo ""
echo "Next steps:"
echo "1. Setup Nginx: cp nginx-iwareid-fullstack.conf /etc/nginx/sites-available/iwareid"
echo "2. Enable site: ln -s /etc/nginx/sites-available/iwareid /etc/nginx/sites-enabled/"
echo "3. Remove default: rm /etc/nginx/sites-enabled/default"
echo "4. Test Nginx: nginx -t"
echo "5. Restart Nginx: systemctl restart nginx"
echo "6. Install SSL: certbot --nginx -d iwareid.com -d www.iwareid.com"
echo ""
echo "Access your app at: https://iwareid.com"
