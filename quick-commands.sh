#!/bin/bash

# Quick Commands for IWARE Management

APP_DIR="/var/www/iware"
cd $APP_DIR

case "$1" in
    start)
        echo "🚀 Starting services..."
        docker-compose up -d
        echo "✅ Services started"
        ;;
    
    stop)
        echo "🛑 Stopping services..."
        docker-compose down
        echo "✅ Services stopped"
        ;;
    
    restart)
        echo "🔄 Restarting services..."
        docker-compose restart
        echo "✅ Services restarted"
        ;;
    
    logs)
        echo "📋 Showing logs (Ctrl+C to exit)..."
        docker-compose logs -f
        ;;
    
    status)
        echo "📊 Service Status:"
        docker-compose ps
        echo ""
        echo "🌐 Nginx Status:"
        systemctl status nginx --no-pager
        ;;
    
    backup)
        echo "💾 Creating backup..."
        /usr/local/bin/backup-iware.sh
        echo "✅ Backup completed"
        ;;
    
    update)
        echo "🔄 Updating application..."
        git pull
        docker-compose down
        docker-compose up -d --build
        echo "✅ Application updated"
        ;;
    
    db-shell)
        echo "🗄️  Opening MySQL shell..."
        docker exec -it iware-mysql mysql -u iware -pIwareDB2026!@# iware_perizinan
        ;;
    
    backend-shell)
        echo "🔧 Opening backend shell..."
        docker exec -it iware-backend sh
        ;;
    
    clean)
        echo "🧹 Cleaning up..."
        docker system prune -f
        echo "✅ Cleanup completed"
        ;;
    
    ssl-renew)
        echo "🔒 Renewing SSL certificate..."
        certbot renew
        systemctl reload nginx
        echo "✅ SSL renewed"
        ;;
    
    *)
        echo "IWARE Quick Commands"
        echo "===================="
        echo ""
        echo "Usage: bash quick-commands.sh [command]"
        echo ""
        echo "Available commands:"
        echo "  start       - Start all services"
        echo "  stop        - Stop all services"
        echo "  restart     - Restart all services"
        echo "  logs        - View live logs"
        echo "  status      - Check service status"
        echo "  backup      - Create backup"
        echo "  update      - Update application"
        echo "  db-shell    - Open MySQL shell"
        echo "  backend-shell - Open backend container shell"
        echo "  clean       - Clean up Docker resources"
        echo "  ssl-renew   - Renew SSL certificate"
        echo ""
        ;;
esac
