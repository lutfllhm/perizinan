#!/bin/bash

# Deploy Script untuk www.iwareid.com
# Jalankan script ini di VPS setelah upload file

echo "🚀 Starting deployment for www.iwareid.com..."

# Set working directory
cd /var/www/iwareid || exit

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
docker-compose down

# Build and start containers
echo "🐳 Building and starting Docker containers..."
docker-compose up -d --build

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
sleep 30

# Check if database needs initialization
echo "🗄️ Checking database..."
docker exec iware-backend sh -c "node scripts/init-database.js" || echo "Database already initialized or error occurred"

# Show container status
echo "📊 Container status:"
docker-compose ps

# Show logs
echo "📝 Recent logs:"
docker-compose logs --tail=50

echo ""
echo "✅ Deployment completed!"
echo ""
echo "Next steps:"
echo "1. Setup Nginx: cp nginx-iwareid.conf /etc/nginx/sites-available/iwareid"
echo "2. Enable site: ln -s /etc/nginx/sites-available/iwareid /etc/nginx/sites-enabled/"
echo "3. Test Nginx: nginx -t"
echo "4. Restart Nginx: systemctl restart nginx"
echo "5. Install SSL: certbot --nginx -d iwareid.com -d www.iwareid.com"
echo ""
echo "Access your app at: https://www.iwareid.com"
