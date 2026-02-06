#!/bin/bash

# Development startup script
echo "🚀 Starting IWARE Perizinan in Development Mode..."

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "⚠️  backend/.env not found. Creating from .env.vps..."
    cp backend/.env.vps backend/.env
    echo "✅ Created backend/.env"
    echo "⚠️  Please edit backend/.env and configure your database settings"
    exit 1
fi

# Start development servers
echo "Starting backend and frontend..."
npm run dev
