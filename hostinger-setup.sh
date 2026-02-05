#!/bin/bash

echo "==================================="
echo "IWARE Perizinan - Hostinger Setup"
echo "==================================="

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Install backend dependencies
echo "⚙️  Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "✅ Setup completed!"
echo ""
echo "📋 Next steps for Hostinger:"
echo "1. Upload semua file ke public_html"
echo "2. Setup Node.js App di cPanel:"
echo "   - Application Root: /backend"
echo "   - Application Startup File: server.js"
echo "   - Application URL: /api"
echo "3. Setup MySQL database di cPanel"
echo "4. Copy .env.example ke .env dan isi konfigurasi"
echo "5. Jalankan: node backend/scripts/init-database.js"
echo ""
