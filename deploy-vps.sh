#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🚀 IWARE Perizinan - VPS Deployment${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js tidak ditemukan. Install Node.js terlebih dahulu.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node -v)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm tidak ditemukan. Install npm terlebih dahulu."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL tidak ditemukan. Pastikan MySQL sudah terinstall."
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm run install:all

# Setup environment
echo ""
echo "⚙️  Setting up environment..."
if [ ! -f backend/.env ]; then
    cp backend/.env.vps backend/.env
    echo "✅ Created backend/.env from .env.vps"
    echo "⚠️  PENTING: Edit backend/.env dan sesuaikan konfigurasi database!"
    read -p "Press enter to continue after editing .env file..."
fi

# Initialize database
echo ""
echo "🗄️  Initializing database..."
read -p "Apakah database sudah dibuat? (y/n): " db_created
if [ "$db_created" = "y" ]; then
    cd backend
    npm run init-db
    cd ..
    echo "✅ Database initialized"
else
    echo "⚠️  Buat database terlebih dahulu dengan:"
    echo "   CREATE DATABASE iware_perizinan;"
    exit 1
fi

# Build frontend
echo ""
echo "🏗️  Building frontend..."
npm run build

# Install PM2 if not exists
if ! command -v pm2 &> /dev/null; then
    echo ""
    read -p "PM2 tidak ditemukan. Install PM2? (y/n): " install_pm2
    if [ "$install_pm2" = "y" ]; then
        npm install -g pm2
        echo "✅ PM2 installed"
    fi
fi

# Start with PM2
if command -v pm2 &> /dev/null; then
    echo ""
    echo "🚀 Starting application with PM2..."
    
    # Stop existing processes
    pm2 delete iware-backend 2>/dev/null
    pm2 delete iware-frontend 2>/dev/null
    
    # Start backend
    cd backend
    pm2 start server.js --name iware-backend
    cd ..
    
    # Start frontend
    cd frontend
    pm2 start "serve -s build -l 3000" --name iware-frontend
    cd ..
    
    # Save PM2 configuration
    pm2 save
    
    echo ""
    echo "✅ Application started successfully!"
    echo ""
    echo "📊 PM2 Status:"
    pm2 list
    
    echo ""
    echo "🌐 Access aplikasi:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:5000"
    echo ""
    echo "👤 Default Admin:"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo ""
    echo "📝 Useful commands:"
    echo "   pm2 list          - List all processes"
    echo "   pm2 logs          - View logs"
    echo "   pm2 restart all   - Restart all processes"
    echo "   pm2 stop all      - Stop all processes"
else
    echo ""
    echo "⚠️  PM2 tidak terinstall. Jalankan manual:"
    echo "   cd backend && npm start"
    echo "   cd frontend && serve -s build -l 3000"
fi

echo ""
echo "✅ Deployment selesai!"
