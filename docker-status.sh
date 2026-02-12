#!/bin/bash

# Quick status check script

echo "🔍 Docker Container Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker-compose ps

echo ""
echo "🏥 Health Checks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# MySQL
echo -n "MySQL:    "
if docker exec iware-mysql mysqladmin ping -h localhost -uroot -p"Jasadenam66/" --silent 2>/dev/null; then
    echo "✅ Healthy"
else
    echo "❌ Unhealthy"
fi

# Backend
echo -n "Backend:  "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health 2>/dev/null || echo "000")
if [ "$STATUS" = "200" ]; then
    echo "✅ Healthy (HTTP $STATUS)"
else
    echo "❌ Unhealthy (HTTP $STATUS)"
fi

# Frontend
echo -n "Frontend: "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
if [ "$STATUS" = "200" ]; then
    echo "✅ Healthy (HTTP $STATUS)"
else
    echo "❌ Unhealthy (HTTP $STATUS)"
fi

echo ""
echo "💾 Resource Usage"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

echo ""
echo "📊 Disk Usage"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker system df

echo ""
echo "🌐 Access URLs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:5000/api/health"
echo "MySQL:     localhost:3306"
