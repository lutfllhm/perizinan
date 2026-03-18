# 🚀 Panduan Deploy ke VPS Hostinger - license.iwareid.com

Panduan lengkap deployment aplikasi IWARE Perizinan ke VPS Hostinger menggunakan domain **license.iwareid.com**

## 📋 Persiapan

### Yang Dibutuhkan:
- ✅ VPS Hostinger (minimal 2GB RAM, 2 CPU cores)
- ✅ Domain: license.iwareid.com
- ✅ SSH access ke VPS
- ✅ Ubuntu 20.04/22.04 LTS

---

## 🔧 LANGKAH 1: Koneksi ke VPS

```bash
# Login ke VPS via SSH
ssh root@your-vps-ip

# Update sistem
sudo apt update && sudo apt upgrade -y
```

---

## 🐳 LANGKAH 2: Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verifikasi instalasi
docker --version
docker-compose --version

# Enable Docker service
sudo systemctl enable docker
sudo systemctl start docker
```

---

## 📦 LANGKAH 3: Clone Repository

```bash
# Buat direktori aplikasi
sudo mkdir -p /var/www/iware
cd /var/www/iware

# Clone repository (ganti dengan URL repo Anda)
git clone https://github.com/your-username/your-repo.git .

# Atau upload manual via SFTP/SCP
# scp -r ./iware root@your-vps-ip:/var/www/
```

---

## ⚙️ LANGKAH 4: Konfigurasi Environment

### 4.1 Setup Environment Variables

```bash
# Copy dan edit file .env.docker
cp .env.docker .env.docker.production
nano .env.docker.production
```

Isi dengan konfigurasi berikut:

```env
# Database Configuration
MYSQL_ROOT_PASSWORD=YourSecureRootPassword2026!@#
MYSQLDATABASE=iware_perizinan
MYSQLUSER=iware
MYSQLPASSWORD=YourSecureDBPassword2026!@#

# JWT Secret (generate dengan: openssl rand -hex 32)
JWT_SECRET=your_generated_jwt_secret_here

# Domain Configuration
FRONTEND_URL=https://license.iwareid.com
```

### 4.2 Setup Backend Environment

```bash
nano backend/.env.production
```

```env
PORT=5000
NODE_ENV=production
DB_HOST=mysql
DB_PORT=3306
DB_USER=iware
DB_PASSWORD=YourSecureDBPassword2026!@#
DB_NAME=iware_perizinan
JWT_SECRET=your_generated_jwt_secret_here
FRONTEND_URL=https://license.iwareid.com
```

### 4.3 Setup Frontend Environment

```bash
nano frontend/.env.production
```

```env
REACT_APP_API_URL=https://license.iwareid.com/api
```

---

## 🌐 LANGKAH 5: Konfigurasi Nginx

### 5.1 Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 5.2 Buat Konfigurasi Nginx

```bash
sudo nano /etc/nginx/sites-available/license.iwareid.com
```

Paste konfigurasi berikut:

```nginx
# HTTP - Redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name license.iwareid.com www.license.iwareid.com;
    
    # Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirect all HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS - Main Configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name license.iwareid.com www.license.iwareid.com;

    # SSL Configuration (akan diisi setelah install SSL)
    ssl_certificate /etc/letsencrypt/live/license.iwareid.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/license.iwareid.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Max upload size
    client_max_body_size 10M;

    # Frontend (React)
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files & uploads
    location /uploads {
        proxy_pass http://localhost:5001/uploads;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
```

### 5.3 Aktifkan Konfigurasi

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/license.iwareid.com /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test konfigurasi
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 🔒 LANGKAH 6: Setup SSL Certificate (Let's Encrypt)

### 6.1 Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 6.2 Dapatkan SSL Certificate

```bash
# Pastikan domain sudah pointing ke IP VPS
# Cek dengan: nslookup license.iwareid.com

# Generate SSL certificate
sudo certbot --nginx -d license.iwareid.com -d www.license.iwareid.com

# Ikuti instruksi:
# - Masukkan email Anda
# - Setuju terms of service
# - Pilih redirect HTTP ke HTTPS (recommended)
```

### 6.3 Auto-renewal SSL

```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Setup cron job untuk auto-renewal
sudo crontab -e

# Tambahkan baris ini:
0 3 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

---

## 🚀 LANGKAH 7: Build & Deploy Aplikasi

### 7.1 Update docker-compose.yml

```bash
nano docker-compose.yml
```

Pastikan environment variables sudah sesuai:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: iware-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQLDATABASE}
      MYSQL_USER: ${MYSQLUSER}
      MYSQL_PASSWORD: ${MYSQLPASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3307:3306"
    networks:
      - iware-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: iware-backend
    restart: always
    environment:
      PORT: 5000
      NODE_ENV: production
      DB_HOST: mysql
      DB_PORT: 3306
      DB_USER: ${MYSQLUSER}
      DB_PASSWORD: ${MYSQLPASSWORD}
      DB_NAME: ${MYSQLDATABASE}
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: https://license.iwareid.com
    volumes:
      - ./backend/uploads:/app/uploads
    ports:
      - "5001:5000"
    depends_on:
      - mysql
    networks:
      - iware-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        REACT_APP_API_URL: https://license.iwareid.com/api
    container_name: iware-frontend
    restart: always
    ports:
      - "3001:80"
    depends_on:
      - backend
    networks:
      - iware-network

volumes:
  mysql_data:

networks:
  iware-network:
    driver: bridge
```

### 7.2 Build dan Start Containers

```bash
# Load environment variables
export $(cat .env.docker.production | xargs)

# Build dan start semua services
docker-compose up -d --build

# Monitor logs
docker-compose logs -f
```

### 7.3 Tunggu hingga semua services ready (±2-3 menit)

```bash
# Check status
docker-compose ps

# Pastikan semua services "Up" dan "healthy"
```

---

## 🗄️ LANGKAH 8: Setup Database

### 8.1 Initialize Database

```bash
# Masuk ke backend container
docker exec -it iware-backend bash

# Jalankan database initialization
npm run init-db

# Import data karyawan (jika ada)
npm run import-karyawan

# Exit container
exit
```

### 8.2 Create Super Admin

```bash
# Buat super admin user
docker exec -it iware-backend node scripts/create-superadmin.js
```

---

## 🔥 LANGKAH 9: Setup Firewall

```bash
# Install UFW
sudo apt install ufw -y

# Allow SSH (PENTING!)
sudo ufw allow 22/tcp

# Allow HTTP & HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## ✅ LANGKAH 10: Verifikasi Deployment

### 10.1 Test Aplikasi

```bash
# Test backend API
curl https://license.iwareid.com/api/health

# Test frontend
curl https://license.iwareid.com
```

### 10.2 Buka di Browser

1. Buka: https://license.iwareid.com
2. Login dengan credentials default:
   - Username: `admin`
   - Password: `admin123`
3. ⚠️ **SEGERA GANTI PASSWORD!**

---

## 📊 Monitoring & Maintenance

### Check Status Services

```bash
# Docker containers
docker-compose ps

# Nginx status
sudo systemctl status nginx

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Restart Services

```bash
# Restart semua
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mysql

# Restart Nginx
sudo systemctl restart nginx
```

### Update Aplikasi

```bash
cd /var/www/iware

# Pull latest code
git pull origin main

# Rebuild dan restart
docker-compose down
docker-compose up -d --build
```

### Backup Database

```bash
# Manual backup
docker exec iware-mysql mysqldump -u iware -p iware_perizinan > backup-$(date +%Y%m%d-%H%M%S).sql

# Setup automated backup (cron)
sudo crontab -e

# Tambahkan:
0 2 * * * cd /var/www/iware && docker exec iware-mysql mysqldump -u iware -pYourSecureDBPassword2026!@# iware_perizinan > backups/backup-$(date +\%Y\%m\%d-\%H\%M\%S).sql
```

---

## 🐛 Troubleshooting

### 1. Container tidak start

```bash
# Check logs
docker-compose logs -f

# Restart container
docker-compose restart [service-name]

# Rebuild container
docker-compose up -d --build [service-name]
```

### 2. Database connection error

```bash
# Check MySQL container
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql

# Wait 30 seconds, then restart backend
sleep 30
docker-compose restart backend
```

### 3. SSL Certificate error

```bash
# Renew certificate
sudo certbot renew

# Restart Nginx
sudo systemctl restart nginx
```

### 4. Port sudah digunakan

```bash
# Check port usage
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
sudo netstat -tulpn | grep :3001
sudo netstat -tulpn | grep :5001

# Kill process jika perlu
sudo kill -9 [PID]
```

### 5. Nginx error

```bash
# Test konfigurasi
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### 6. Out of memory

```bash
# Check memory usage
free -h
docker stats

# Restart Docker
sudo systemctl restart docker
docker-compose up -d
```

---

## 🔐 Security Checklist

- ✅ SSL Certificate installed (HTTPS)
- ✅ Firewall configured (UFW)
- ✅ Strong database passwords
- ✅ JWT secret generated
- ✅ Default admin password changed
- ✅ Regular backups scheduled
- ✅ Auto SSL renewal configured
- ✅ Security headers enabled
- ✅ CORS properly configured

---

## 📞 Support

Jika mengalami masalah:

1. Check logs: `docker-compose logs -f`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Restart services: `docker-compose restart`
4. Check firewall: `sudo ufw status`

---

## 🎉 Selesai!

Aplikasi IWARE Perizinan sudah berhasil di-deploy di:
- 🌐 **URL**: https://license.iwareid.com
- 🔐 **Login**: admin / admin123 (segera ganti!)

**Jangan lupa:**
1. ✅ Ganti password admin
2. ✅ Setup backup otomatis
3. ✅ Monitor logs secara berkala
4. ✅ Update aplikasi secara rutin

---

Made with ❤️ for IWARE
