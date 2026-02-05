#!/bin/bash
# Hostinger Start Script

echo "🚀 Starting IWARE Perizinan..."

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "⚠️  Warning: backend/.env not found!"
    echo "Copy backend/.env.hostinger to backend/.env and configure it."
    exit 1
fi

# Start backend
cd backend
node server.js
