# Deployment Guide - IWARE Perizinan

## Prerequisites

- VPS dengan minimal 2GB RAM, 20GB storage
- Docker dan Docker Compose terinstall
- Domain sudah pointing ke IP VPS
- Port 80, 443, 3000, 5000, 3306 terbuka

## Quick Start

### 1. Install Docker di VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Clone Repository

```bash
git clone <your-repository-url> /var/www/iware
cd /var/www/iware
```

### 3. Setup Environment

```bash
# Copy environment file
cp .env.docker .env

# Edit .env dan ganti:
# - MYSQL_PASSWORD (password database)
# - JWT_SECRET (generate dengan: node backend/scripts/generate-jwt-secret.js)
# - REACT_APP_API_URL (domain Anda)
# - FRONTEND_URL (domain Anda)
nano .env
```

### 4. Build dan Run

```bash
# Build dan start semua services
docker-compose up -d --build

# Check logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 5. Initialize Database

```bash
# Jalankan database initialization
docker exec -it iware-backend node scripts/init-database.js
```

### 6. Setup Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt install nginx certbot python3-certbot-nginx -y

# Copy nginx config
sudo cp nginx-vps.conf /etc/nginx/sites-available/iwareid.com
sudo ln -s /etc/nginx/sites-available/iwareid.com /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### 7. Setup SSL Certificate

```bash
# Generate SSL certificate dengan Let's Encrypt
sudo certbot --nginx -d iwareid.com -d www.iwareid.com

# Auto-renewal sudah aktif secara default
```

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f [service-name]

# Rebuild services
docker-compose up -d --build

# Remove all (including volumes)
docker-compose down -v
```

## Maintenance

### Backup Database

```bash
# Backup
docker exec iware-mysql mysqldump -u iware -p iware_perizinan > backup.sql

# Restore
docker exec -i iware-mysql mysql -u iware -p iware_perizinan < backup.sql
```

### Update Application

```bash
cd /var/www/iware
git pull
docker-compose up -d --build
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

## Troubleshooting

### Container tidak start

```bash
# Check logs
docker-compose logs [service-name]

# Check container status
docker ps -a

# Restart service
docker-compose restart [service-name]
```

### Database connection error

```bash
# Check MySQL is running
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql
```

### Port already in use

```bash
# Check what's using the port
sudo lsof -i :5000
sudo lsof -i :3000

# Kill the process or change port in .env
```

## Security Checklist

- [ ] Ganti MYSQL_PASSWORD di .env
- [ ] Generate JWT_SECRET baru
- [ ] Setup firewall (ufw)
- [ ] Enable SSL certificate
- [ ] Backup database secara berkala
- [ ] Update system secara berkala

## Support

Untuk bantuan lebih lanjut, hubungi tim development.
