# 🚀 Panduan Deployment Lengkap - IWARE Perizinan ke VPS

Panduan step-by-step untuk deploy aplikasi IWARE Perizinan ke VPS dari awal sampai berhasil.

## 📋 Daftar Isi

1. [Persiapan VPS](#1-persiapan-vps)
2. [Setup Domain](#2-setup-domain)
3. [Install Dependencies](#3-install-dependencies)
4. [Clone & Setup Aplikasi](#4-clone--setup-aplikasi)
5. [Konfigurasi Environment](#5-konfigurasi-environment)
6. [Build & Run Docker](#6-build--run-docker)
7. [Setup Nginx](#7-setup-nginx)
8. [Setup SSL Certificate](#8-setup-ssl-certificate)
9. [Initialize Database](#9-initialize-database)
10. [Testing](#10-testing)
11. [Monitoring & Maintenance](#11-monitoring--maintenance)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Persiapan VPS

### 1.1 Spesifikasi Minimum VPS

- **RAM**: 2GB (recommended 4GB)
- **Storage**: 20GB SSD
- **OS**: Ubuntu 20.04 / 22.04 LTS
- **CPU**: 2 Core

### 1.2 Login ke VPS

```bash
# Login via SSH
ssh root@YOUR_VPS_IP

# Atau jika menggunakan user biasa
ssh username@YOUR_VPS_IP
```

### 1.3 Update System

```bash
# Update package list
sudo apt update

# Upgrade packages
sudo apt upgrade -y

# Install basic tools
sudo apt install -y curl wget git nano ufw
```

### 1.4 Setup Firewall

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP & HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 1.5 Create Non-Root User (Optional tapi Recommended)

```bash
# Create user
sudo adduser iware

# Add to sudo group
sudo usermod -aG sudo iware

# Switch to new user
su - iware
```

---

## 2. Setup Domain

### 2.1 Konfigurasi DNS

Login ke provider domain Anda (Namecheap, GoDaddy, Cloudflare, dll) dan tambahkan DNS records:

```
Type    Name    Value           TTL
A       @       YOUR_VPS_IP     Auto
A       www     YOUR_VPS_IP     Auto
```

### 2.2 Verifikasi DNS

```bash
# Check DNS propagation
ping iwareid.com
ping www.iwareid.com

# Atau gunakan
nslookup iwareid.com
```

⏰ **Catatan**: DNS propagation bisa memakan waktu 5 menit - 24 jam

---

## 3. Install Dependencies

### 3.1 Install Docker

```bash
# Download Docker installation script
curl -fsSL https://get.docker.com -o get-docker.sh

# Run installation
sudo sh get-docker.sh

# Add current user to docker group
sudo usermod -aG docker $USER

# Apply group changes
newgrp docker

# Verify installation
docker --version
```

### 3.2 Install Docker Compose

```bash
# Install docker-compose
sudo apt install -y docker-compose

# Verify installation
docker-compose --version
```

### 3.3 Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### 3.4 Install Certbot (untuk SSL)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
```

---

## 4. Clone & Setup Aplikasi

### 4.1 Create Directory

```bash
# Create directory
sudo mkdir -p /var/www
cd /var/www
```

### 4.2 Clone Repository

```bash
# Clone repository (ganti dengan URL repo Anda)
sudo git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git iware

# Change ownership
sudo chown -R $USER:$USER /var/www/iware

# Navigate to project
cd /var/www/iware
```

### 4.3 Verify Files

```bash
# Check structure
ls -la

# Should see:
# - backend/
# - frontend/
# - docker-compose.yml
# - nginx-vps.conf
# - DEPLOYMENT.md
```

---

## 5. Konfigurasi Environment

### 5.1 Copy Environment Template

```bash
# Copy template
cp .env.docker .env
```

### 5.2 Generate JWT Secret

```bash
# Generate secure JWT secret
cd backend
node scripts/generate-jwt-secret.js

# Copy output JWT secret
```

### 5.3 Edit Environment File

```bash
# Edit .env file
cd /var/www/iware
nano .env
```

Ubah nilai berikut:

```env
# MySQL Configuration - GANTI PASSWORD!
MYSQL_ROOT_PASSWORD=YOUR_STRONG_PASSWORD_HERE
MYSQL_DATABASE=iware_perizinan
MYSQL_USER=iware
MYSQL_PASSWORD=YOUR_STRONG_PASSWORD_HERE

# Backend Configuration
BACKEND_PORT=5000
NODE_ENV=production

# JWT Secret - PASTE DARI GENERATE SCRIPT!
JWT_SECRET=YOUR_GENERATED_JWT_SECRET_HERE

# Frontend Configuration - GANTI DENGAN DOMAIN ANDA!
REACT_APP_API_URL=https://iwareid.com

# CORS Configuration - GANTI DENGAN DOMAIN ANDA!
FRONTEND_URL=https://iwareid.com,https://www.iwareid.com

# WhatsApp Integration
WHATSAPP_ENABLED=false
```

**Simpan**: `Ctrl + O`, Enter, `Ctrl + X`

### 5.4 Verify Environment

```bash
# Check .env file
cat .env

# Make sure all values are correct
```

---

## 6. Build & Run Docker

### 6.1 Build Images

```bash
cd /var/www/iware

# Build all services
docker-compose build

# This will take 5-10 minutes
```

### 6.2 Start Services

```bash
# Start all services in background
docker-compose up -d

# Check running containers
docker-compose ps
```

Expected output:
```
NAME                COMMAND                  SERVICE    STATUS
iware-backend       "docker-entrypoint.s…"   backend    Up
iware-frontend      "/docker-entrypoint.…"   frontend   Up
iware-mysql         "docker-entrypoint.s…"   mysql      Up
```

### 6.3 Check Logs

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Press Ctrl+C to exit logs
```

### 6.4 Verify Services

```bash
# Check backend health
curl http://localhost:5000/api/health

# Check frontend
curl http://localhost:3000

# Check MySQL
docker exec -it iware-mysql mysql -u iware -p
# Enter password, then type: SHOW DATABASES; EXIT;
```

---

## 7. Setup Nginx

### 7.1 Copy Nginx Configuration

```bash
# Copy config file
sudo cp /var/www/iware/nginx-vps.conf /etc/nginx/sites-available/iwareid.com

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/iwareid.com /etc/nginx/sites-enabled/

# Remove default config
sudo rm /etc/nginx/sites-enabled/default
```

### 7.2 Test Nginx Configuration

```bash
# Test configuration
sudo nginx -t

# Should show: "syntax is ok" and "test is successful"
```

### 7.3 Restart Nginx

```bash
# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

---

## 8. Setup SSL Certificate

### 8.1 Generate SSL Certificate

```bash
# Run Certbot
sudo certbot --nginx -d iwareid.com -d www.iwareid.com
```

Ikuti prompt:
1. Enter email address
2. Agree to terms (Y)
3. Share email (Y/N - pilih sesuai keinginan)
4. Redirect HTTP to HTTPS (pilih 2)

### 8.2 Verify SSL

```bash
# Check certificate
sudo certbot certificates

# Test auto-renewal
sudo certbot renew --dry-run
```

### 8.3 Test HTTPS

```bash
# Test dengan curl
curl https://iwareid.com

# Atau buka di browser
# https://iwareid.com
```

---

## 9. Initialize Database

### 9.1 Wait for MySQL Ready

```bash
# Check MySQL is healthy
docker-compose ps mysql

# Should show "healthy" status
```

### 9.2 Run Database Initialization

```bash
# Initialize database
docker exec -it iware-backend node scripts/init-database.js
```

Expected output:
```
✅ Database initialized successfully
✅ Tables created
✅ Admin user created
```

### 9.3 Verify Database

```bash
# Login to MySQL
docker exec -it iware-mysql mysql -u iware -p

# Enter password, then run:
USE iware_perizinan;
SHOW TABLES;
SELECT * FROM users;
EXIT;
```

### 9.4 Import Karyawan (Optional)

```bash
# If you have karyawan data
docker exec -it iware-backend node scripts/import-karyawan.js
```

---

## 10. Testing

### 10.1 Test Backend API

```bash
# Health check
curl https://iwareid.com/api/health

# Login test
curl -X POST https://iwareid.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 10.2 Test Frontend

Buka browser dan akses:
- https://iwareid.com
- https://www.iwareid.com

### 10.3 Test Login

1. Buka https://iwareid.com
2. Login dengan:
   - Username: `admin`
   - Password: `admin123`
3. Verify dashboard muncul

### 10.4 Test Upload

1. Login sebagai admin
2. Coba upload foto di form pengajuan
3. Verify file tersimpan

---

## 11. Monitoring & Maintenance

### 11.1 Check Container Status

```bash
# Check all containers
docker-compose ps

# Check resource usage
docker stats

# Check logs
docker-compose logs -f --tail=100
```

### 11.2 Backup Database

```bash
# Create backup directory
mkdir -p /var/www/iware/backups

# Backup database
docker exec iware-mysql mysqldump -u iware -p iware_perizinan > /var/www/iware/backups/backup-$(date +%Y%m%d-%H%M%S).sql

# List backups
ls -lh /var/www/iware/backups/
```

### 11.3 Automated Backup (Cron)

```bash
# Edit crontab
crontab -e

# Add this line (backup every day at 2 AM)
0 2 * * * docker exec iware-mysql mysqldump -u iware -pYOUR_PASSWORD iware_perizinan > /var/www/iware/backups/backup-$(date +\%Y\%m\%d).sql

# Save and exit
```

### 11.4 Update Application

```bash
cd /var/www/iware

# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Check logs
docker-compose logs -f
```

### 11.5 Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mysql
```

---

## 12. Troubleshooting

### 12.1 Container Won't Start

```bash
# Check logs
docker-compose logs [service-name]

# Check container status
docker ps -a

# Remove and recreate
docker-compose down
docker-compose up -d
```

### 12.2 Database Connection Error

```bash
# Check MySQL is running
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql

# Wait 30 seconds then restart backend
sleep 30
docker-compose restart backend
```

### 12.3 Port Already in Use

```bash
# Check what's using port 5000
sudo lsof -i :5000

# Kill process
sudo kill -9 PID

# Or change port in .env
```

### 12.4 Nginx Error

```bash
# Check nginx error log
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### 12.5 SSL Certificate Error

```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Restart nginx
sudo systemctl restart nginx
```

### 12.6 Frontend Not Loading

```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up -d --build frontend

# Clear browser cache
# Ctrl + Shift + R (hard refresh)
```

### 12.7 Upload Not Working

```bash
# Check uploads directory permissions
ls -la /var/www/iware/backend/uploads

# Fix permissions
sudo chown -R 1000:1000 /var/www/iware/backend/uploads
sudo chmod -R 755 /var/www/iware/backend/uploads

# Restart backend
docker-compose restart backend
```

---

## 📊 Useful Commands

### Docker Commands

```bash
# View all containers
docker ps -a

# View logs
docker-compose logs -f [service]

# Restart service
docker-compose restart [service]

# Stop all
docker-compose down

# Start all
docker-compose up -d

# Rebuild
docker-compose up -d --build

# Remove all (including volumes)
docker-compose down -v

# Execute command in container
docker exec -it [container-name] [command]
```

### System Commands

```bash
# Check disk space
df -h

# Check memory
free -h

# Check CPU
top

# Check network
netstat -tulpn

# Check processes
ps aux | grep node
```

---

## 🔒 Security Checklist

- [x] Firewall enabled (ufw)
- [x] SSL certificate installed
- [x] Strong database password
- [x] JWT secret generated
- [x] Non-root user created
- [ ] SSH key authentication (recommended)
- [ ] Fail2ban installed (recommended)
- [ ] Regular backups scheduled
- [ ] Monitoring setup

---

## 📞 Support

Jika mengalami masalah:

1. Check logs: `docker-compose logs -f`
2. Check status: `docker-compose ps`
3. Restart services: `docker-compose restart`
4. Check troubleshooting section di atas

---

## 🎉 Selamat!

Aplikasi IWARE Perizinan sudah berhasil di-deploy ke VPS!

Akses aplikasi di: **https://iwareid.com**

Default login:
- Username: `admin`
- Password: `admin123`

**PENTING**: Segera ganti password default setelah login pertama kali!
