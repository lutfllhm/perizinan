#!/bin/bash
# Hostinger Build Script

set -e

echo "🚀 Starting Hostinger build process..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Build frontend
echo "🎨 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Install backend dependencies
echo "⚙️  Installing backend dependencies..."
cd backend
npm install
cd ..

echo "✅ Build completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Setup Node.js App in cPanel"
echo "2. Configure MySQL database"
echo "3. Update backend/.env with your credentials"
echo "4. Run: node backend/scripts/init-database.js"
