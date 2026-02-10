# 🚀 Panduan Lengkap Deployment ke VPS Hostinger

**Aplikasi Full-Stack (React + Node.js + MySQL)**  
**Metode: Docker + Nginx + SSL**  
**Terakhir diupdate: Februari 2026**

---

## 📑 Daftar Isi

1. [Persiapan Awal](#1-persiapan-awal)
2. [Setup VPS Hostinger](#2-setup-vps-hostinger)
3. [Install Dependencies](#3-install-dependencies)
4. [Upload Aplikasi](#4-upload-aplikasi)
5. [Konfigurasi Environment](#5-konfigurasi-environment)
6. [Setup Docker](#6-setup-docker)
7. [Setup Nginx](#7-setup-nginx)
8. [Setup SSL Certificate](#8-setup-ssl-certificate)
9. [Inisialisasi Database](#9-inisialisasi-database)
10. [Testing & Troubleshooting](#10-testing--troubleshooting)
11. [Maintenance & Backup](#11-maintenance--backup)

---

## 1. Persiapan Awal

### 1.1 Yang Kamu Butuhkan

- [ ] Akun Hostinger
- [ ] VPS Hostinger (minimal KVM 2: 2 CPU, 4GB RAM)
- [ ] Domain (opsional, tapi sangat direkomendasikan)
- [ ] Software di komputer lokal:
  - FileZilla atau WinSCP (untuk upload file)
  - PuTTY atau Terminal (untuk SSH)
  - Git (opsional)

### 1.2 Beli VPS Hostinger

1. Login ke **hpanel.hostinger.com**
2. Pilih **VPS** → **Order VPS**
3. Pilih paket minimal **KVM 2** (Rp 69.000/bulan)
4. Pilih lokasi server: **Singapore** (paling dekat dengan Indonesia)
5. Pilih OS: **Ubuntu 22.04 LTS** (64-bit)
6. Selesaikan pembayaran


### 1.3 Setup Domain (Opsional)

**Jika kamu punya domain:**

1. Login ke **hpanel.hostinger.com**
2. Pilih **Domains** → Pilih domain kamu
3. Klik **DNS / Name Servers**
4. Tambahkan A Record:
   - **Type**: A
   - **Name**: @ (untuk root domain)
   - **Points to**: [IP VPS kamu]
   - **TTL**: 14400
5. Tambahkan A Record lagi:
   - **Type**: A
   - **Name**: www
   - **Points to**: [IP VPS kamu]
   - **TTL**: 14400
6. Tunggu propagasi DNS (5-30 menit)

**Jika tidak punya domain:**
- Kamu tetap bisa akses aplikasi pakai IP VPS
- Contoh: `http://123.456.789.10`

---

## 2. Setup VPS Hostinger

### 2.1 Akses VPS Panel

1. Login ke **hpanel.hostinger.com**
2. Pilih **VPS** → Pilih VPS kamu
3. Catat informasi penting:
   - **IP Address**: 123.456.789.10
   - **SSH Username**: root
   - **SSH Password**: (klik "Show" untuk lihat)
   - **SSH Port**: 22

### 2.2 Koneksi SSH ke VPS

**Windows (pakai PuTTY):**
1. Download PuTTY dari putty.org
2. Buka PuTTY
3. Host Name: [IP VPS kamu]
4. Port: 22
5. Connection type: SSH
6. Klik **Open**
7. Login dengan username: `root`
8. Masukkan password

**Windows (pakai CMD/PowerShell):**
```bash
ssh root@123.456.789.10
```

**Mac/Linux:**
```bash
ssh root@123.456.789.10
```

### 2.3 Update Sistem

Setelah login ke VPS, jalankan:

```bash
# Update package list
apt update

# Upgrade semua package
apt upgrade -y

# Install tools dasar
apt install -y curl wget git nano ufw
```

Tunggu sampai selesai (5-10 menit).


---

## 3. Install Dependencies

### 3.1 Install Docker

```bash
# Download script instalasi Docker
curl -fsSL https://get.docker.com -o get-docker.sh

# Jalankan script
sh get-docker.sh

# Verifikasi instalasi
docker --version
```

Output yang diharapkan:
```
Docker version 25.0.x, build xxxxx
```

### 3.2 Install Docker Compose

```bash
# Install Docker Compose
apt install docker-compose -y

# Verifikasi instalasi
docker-compose --version
```

Output yang diharapkan:
```
docker-compose version 1.29.x, build xxxxx
```

### 3.3 Install Nginx

```bash
# Install Nginx
apt install nginx -y

# Start Nginx
systemctl start nginx

# Enable Nginx auto-start saat boot
systemctl enable nginx

# Cek status Nginx
systemctl status nginx
```

Tekan `q` untuk keluar dari status view.

### 3.4 Install Certbot (untuk SSL)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Verifikasi instalasi
certbot --version
```

### 3.5 Test Nginx

Buka browser, akses: `http://[IP-VPS-kamu]`

Kamu harus lihat halaman "Welcome to nginx!"


---

## 4. Upload Aplikasi

### 4.1 Buat Folder Aplikasi

```bash
# Buat folder untuk aplikasi
mkdir -p /var/www/aplikasi

# Masuk ke folder
cd /var/www/aplikasi
```

### 4.2 Upload File Aplikasi

**Metode 1: Pakai Git (Jika punya repository)**

```bash
# Clone repository
git clone https://github.com/username/repo-name.git .

# Atau jika private repo
git clone https://username:token@github.com/username/repo-name.git .
```

**Metode 2: Upload Manual pakai FileZilla (Recommended)**

1. Download FileZilla dari filezilla-project.org
2. Buka FileZilla
3. Klik **File** → **Site Manager**
4. Klik **New Site**, beri nama "VPS Hostinger"
5. Isi konfigurasi:
   - **Protocol**: SFTP
   - **Host**: [IP VPS kamu]
   - **Port**: 22
   - **Logon Type**: Normal
   - **User**: root
   - **Password**: [password VPS kamu]
6. Klik **Connect**
7. Di panel kanan, navigasi ke: `/var/www/aplikasi`
8. Di panel kiri, pilih folder project kamu di komputer
9. Drag & drop semua file ke panel kanan
10. Tunggu upload selesai (tergantung ukuran file & kecepatan internet)

**Metode 3: Pakai SCP dari komputer lokal**

```bash
# Dari komputer lokal (bukan di VPS)
scp -r /path/to/your/project/* root@[IP-VPS]:/var/www/aplikasi/
```

### 4.3 Verifikasi Upload

```bash
# Cek isi folder
ls -la /var/www/aplikasi

# Kamu harus lihat folder: backend, frontend, docker-compose.yml, dll
```


---

## 5. Konfigurasi Environment

### 5.1 Setup Backend Environment

```bash
# Masuk ke folder aplikasi
cd /var/www/aplikasi

# Edit file .env backend
nano backend/.env
```

**Isi file `backend/.env`:**

```env
NODE_ENV=production
PORT=5000

# Database Configuration
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=Password_Kuat_123!@#
DB_NAME=aplikasi_db
DB_PORT=3306

# JWT Secret (generate random string)
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

# Upload Configuration
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=10485760

# CORS
CORS_ORIGIN=*
```

**Cara save di nano:**
- Tekan `Ctrl + X`
- Tekan `Y`
- Tekan `Enter`

### 5.2 Generate JWT Secret

```bash
# Generate random JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy output-nya dan paste ke `JWT_SECRET` di file `.env`

### 5.3 Setup Frontend Environment

```bash
# Edit file .env frontend
nano frontend/.env
```

**Jika pakai domain:**
```env
REACT_APP_API_URL=https://yourdomain.com/api
```

**Jika pakai IP:**
```env
REACT_APP_API_URL=http://123.456.789.10/api
```

Save file (Ctrl+X, Y, Enter).

### 5.4 Set Permissions

```bash
# Set ownership
chown -R root:root /var/www/aplikasi

# Set permissions
chmod -R 755 /var/www/aplikasi

# Buat folder uploads jika belum ada
mkdir -p /var/www/aplikasi/backend/uploads
chmod -R 777 /var/www/aplikasi/backend/uploads
```


---

## 6. Setup Docker

### 6.1 Cek docker-compose.yml

```bash
# Lihat isi docker-compose.yml
cat docker-compose.yml
```

Pastikan file sudah benar. Jika perlu edit:

```bash
nano docker-compose.yml
```

**Contoh docker-compose.yml yang benar:**

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: mysql_container
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: Password_Kuat_123!@#
      MYSQL_DATABASE: aplikasi_db
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"
    networks:
      - app-network
    command: --default-authentication-plugin=mysql_native_password

  backend:
    build: ./backend
    container_name: backend_container
    restart: always
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./backend/uploads:/app/uploads
    depends_on:
      - mysql
    networks:
      - app-network

  frontend:
    build: ./frontend
    container_name: frontend_container
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  mysql_data:

networks:
  app-network:
    driver: bridge
```

### 6.2 Cek Dockerfile Backend

```bash
# Lihat Dockerfile backend
cat backend/Dockerfile
```

**Jika belum ada, buat:**

```bash
nano backend/Dockerfile
```

**Isi:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```


### 6.3 Cek Dockerfile Frontend

```bash
# Lihat Dockerfile frontend
cat frontend/Dockerfile
```

**Jika belum ada, buat:**

```bash
nano frontend/Dockerfile
```

**Isi:**

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 6.4 Buat nginx.conf untuk Frontend

```bash
nano frontend/nginx.conf
```

**Isi:**

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6.5 Build & Run Docker Containers

```bash
# Pastikan di folder /var/www/aplikasi
cd /var/www/aplikasi

# Build dan jalankan semua container
docker-compose up -d --build
```

**Proses ini akan:**
1. Download image MySQL
2. Build image backend (5-10 menit)
3. Build image frontend (10-15 menit)
4. Start semua container

**Tunggu sampai selesai!**

### 6.6 Cek Status Container

```bash
# Lihat status semua container
docker-compose ps
```

Output yang diharapkan:
```
NAME                  STATUS              PORTS
mysql_container       Up 2 minutes        0.0.0.0:3306->3306/tcp
backend_container     Up 2 minutes        0.0.0.0:5000->5000/tcp
frontend_container    Up 2 minutes        0.0.0.0:3000->80/tcp
```

Semua harus status **Up**.

### 6.7 Cek Logs (Jika Ada Error)

```bash
# Lihat logs semua container
docker-compose logs -f

# Atau lihat logs spesifik
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

Tekan `Ctrl+C` untuk keluar dari logs.


---

## 7. Setup Nginx

### 7.1 Buat Konfigurasi Nginx

```bash
# Buat file konfigurasi
nano /etc/nginx/sites-available/aplikasi
```

**Jika pakai DOMAIN:**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
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
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Upload files
    location /uploads {
        proxy_pass http://localhost:5000/uploads;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Max upload size
    client_max_body_size 10M;
}
```

**Jika pakai IP (tanpa domain):**

```nginx
server {
    listen 80;
    server_name _;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
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
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Upload files
    location /uploads {
        proxy_pass http://localhost:5000/uploads;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Max upload size
    client_max_body_size 10M;
}
```

Save file (Ctrl+X, Y, Enter).


### 7.2 Aktifkan Konfigurasi

```bash
# Hapus konfigurasi default
rm /etc/nginx/sites-enabled/default

# Buat symbolic link
ln -s /etc/nginx/sites-available/aplikasi /etc/nginx/sites-enabled/

# Test konfigurasi Nginx
nginx -t
```

Output yang diharapkan:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 7.3 Restart Nginx

```bash
# Restart Nginx
systemctl restart nginx

# Cek status
systemctl status nginx
```

Status harus **active (running)**.

### 7.4 Test Akses Aplikasi

Buka browser:
- **Jika pakai domain**: `http://yourdomain.com`
- **Jika pakai IP**: `http://123.456.789.10`

Kamu harus bisa lihat aplikasi frontend!


---

## 8. Setup SSL Certificate

**⚠️ Langkah ini HANYA untuk yang pakai DOMAIN. Skip jika pakai IP.**

### 8.1 Pastikan Domain Sudah Pointing

```bash
# Test DNS resolution
ping yourdomain.com
```

Harus resolve ke IP VPS kamu.

### 8.2 Install SSL Certificate

```bash
# Install certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**Ikuti instruksi:**
1. Masukkan email kamu
2. Agree to terms: ketik `Y`
3. Share email: ketik `N` (opsional)
4. Redirect HTTP to HTTPS: pilih `2` (Redirect)

### 8.3 Verifikasi SSL

Buka browser: `https://yourdomain.com`

Kamu harus lihat gembok hijau (secure connection).

### 8.4 Auto-Renewal SSL

```bash
# Test auto-renewal
certbot renew --dry-run
```

Jika sukses, certificate akan auto-renew setiap 90 hari.

### 8.5 Setup Cron Job untuk Auto-Renewal

```bash
# Edit crontab
crontab -e
```

Pilih editor (pilih nano, biasanya nomor 1).

Tambahkan baris ini di paling bawah:

```
0 3 * * * certbot renew --quiet
```

Save (Ctrl+X, Y, Enter).


---

## 9. Inisialisasi Database

### 9.1 Tunggu MySQL Ready

```bash
# Cek logs MySQL
docker-compose logs mysql | grep "ready for connections"
```

Tunggu sampai muncul pesan "ready for connections".

### 9.2 Masuk ke Container Backend

```bash
# Masuk ke container backend
docker exec -it backend_container sh
```

Prompt akan berubah jadi `#` atau `/app #`.

### 9.3 Jalankan Script Inisialisasi

```bash
# Jalankan init database
node scripts/init-database.js
```

**Output yang diharapkan:**
```
✓ Database connected
✓ Tables created
✓ Admin user created
✓ Database initialized successfully
```

### 9.4 Verifikasi Database

```bash
# Masih di dalam container backend
# Cek koneksi database
node -e "const mysql = require('mysql2/promise'); mysql.createConnection({host:'mysql',user:'root',password:'Password_Kuat_123!@#',database:'aplikasi_db'}).then(c => {console.log('✓ Connected'); c.end();})"
```

### 9.5 Keluar dari Container

```bash
# Keluar dari container
exit
```

### 9.6 Test Login Admin

Buka browser, akses aplikasi:
- **Domain**: `https://yourdomain.com`
- **IP**: `http://123.456.789.10`

**Login dengan:**
- Username: `admin`
- Password: `admin123` (atau sesuai yang di script init-database.js)

**⚠️ PENTING: Ganti password admin setelah login pertama!**


---

## 10. Testing & Troubleshooting

### 10.1 Setup Firewall

```bash
# Install UFW (jika belum)
apt install ufw -y

# Allow SSH (PENTING! Jangan lupa ini!)
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS
ufw allow 443/tcp

# Enable firewall
ufw enable

# Cek status
ufw status
```

### 10.2 Test Semua Fitur

**Checklist Testing:**

- [ ] Buka aplikasi di browser
- [ ] Login dengan akun admin
- [ ] Test navigasi antar halaman
- [ ] Test upload file/foto
- [ ] Test create data baru
- [ ] Test edit data
- [ ] Test delete data
- [ ] Test logout
- [ ] Test login lagi

### 10.3 Troubleshooting Common Issues

**Problem: Container tidak start**

```bash
# Cek logs
docker-compose logs

# Restart container
docker-compose restart

# Rebuild jika perlu
docker-compose down
docker-compose up -d --build
```

**Problem: Database connection error**

```bash
# Cek MySQL container
docker-compose logs mysql

# Cek environment variables
docker exec backend_container env | grep DB_

# Restart MySQL
docker-compose restart mysql
```

**Problem: Frontend tidak bisa akses backend**

```bash
# Cek backend logs
docker-compose logs backend

# Test backend API
curl http://localhost:5000/api/health

# Cek Nginx config
nginx -t
systemctl restart nginx
```

**Problem: Upload file error**

```bash
# Cek permissions folder uploads
ls -la /var/www/aplikasi/backend/uploads

# Set permissions
chmod -R 777 /var/www/aplikasi/backend/uploads

# Restart backend
docker-compose restart backend
```

**Problem: SSL certificate error**

```bash
# Renew certificate
certbot renew --force-renewal

# Restart Nginx
systemctl restart nginx
```

### 10.4 Monitoring

```bash
# Cek resource usage
docker stats

# Cek disk space
df -h

# Cek memory
free -h

# Cek running processes
top
```

Tekan `q` untuk keluar dari top.


---

## 11. Maintenance & Backup

### 11.1 Backup Database

**Manual Backup:**

```bash
# Backup database
docker exec mysql_container mysqldump -u root -pPassword_Kuat_123!@# aplikasi_db > backup-$(date +%Y%m%d).sql

# Lihat file backup
ls -lh backup-*.sql
```

**Auto Backup (Cron Job):**

```bash
# Edit crontab
crontab -e
```

Tambahkan:

```bash
# Backup database setiap hari jam 2 pagi
0 2 * * * docker exec mysql_container mysqldump -u root -pPassword_Kuat_123!@# aplikasi_db > /var/www/aplikasi/backup-$(date +\%Y\%m\%d).sql
```

### 11.2 Restore Database

```bash
# Restore dari backup
docker exec -i mysql_container mysql -u root -pPassword_Kuat_123!@# aplikasi_db < backup-20260210.sql
```

### 11.3 Update Aplikasi

**Jika ada update code:**

```bash
# Masuk ke folder aplikasi
cd /var/www/aplikasi

# Pull update (jika pakai Git)
git pull

# Atau upload file baru pakai FileZilla

# Rebuild dan restart
docker-compose down
docker-compose up -d --build

# Cek logs
docker-compose logs -f
```

### 11.4 Restart Aplikasi

```bash
# Restart semua container
docker-compose restart

# Atau restart spesifik
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mysql
```

### 11.5 Stop Aplikasi

```bash
# Stop semua container
docker-compose stop

# Start lagi
docker-compose start
```

### 11.6 Hapus Semua Container & Data

**⚠️ HATI-HATI: Ini akan hapus semua data!**

```bash
# Stop dan hapus container
docker-compose down

# Hapus termasuk volumes (database akan hilang!)
docker-compose down -v
```

### 11.7 Monitoring Logs

```bash
# Lihat logs real-time
docker-compose logs -f

# Lihat 100 baris terakhir
docker-compose logs --tail=100

# Lihat logs spesifik service
docker-compose logs -f backend
```

### 11.8 Cek Disk Space

```bash
# Cek disk usage
df -h

# Cek Docker disk usage
docker system df

# Clean up Docker (hapus unused images, containers, dll)
docker system prune -a
```


---

## 12. Optimasi & Best Practices

### 12.1 Setup Swap (Jika RAM Kurang)

```bash
# Buat swap file 2GB
fallocate -l 2G /swapfile

# Set permissions
chmod 600 /swapfile

# Setup swap
mkswap /swapfile

# Enable swap
swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Verifikasi
free -h
```

### 12.2 Enable Gzip Compression di Nginx

```bash
# Edit nginx config
nano /etc/nginx/nginx.conf
```

Tambahkan di dalam `http {}` block:

```nginx
# Gzip Settings
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
```

Restart Nginx:

```bash
systemctl restart nginx
```

### 12.3 Setup Log Rotation

```bash
# Buat config log rotation
nano /etc/logrotate.d/docker-compose
```

Isi:

```
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=10M
    missingok
    delaycompress
    copytruncate
}
```

### 12.4 Security Hardening

**Disable Root Login SSH:**

```bash
# Edit SSH config
nano /etc/ssh/sshd_config
```

Ubah:
```
PermitRootLogin no
```

**Buat user baru:**

```bash
# Buat user
adduser deploy

# Tambahkan ke sudo group
usermod -aG sudo deploy

# Tambahkan ke docker group
usermod -aG docker deploy
```

**Restart SSH:**

```bash
systemctl restart sshd
```

### 12.5 Setup Monitoring dengan Netdata (Opsional)

```bash
# Install Netdata
bash <(curl -Ss https://my-netdata.io/kickstart.sh)

# Allow port 19999
ufw allow 19999/tcp

# Akses monitoring
# http://[IP-VPS]:19999
```


---

## 13. Checklist Final

### Pre-Deployment

- [ ] VPS Hostinger sudah aktif
- [ ] Domain sudah pointing ke VPS (jika pakai domain)
- [ ] SSH bisa akses VPS
- [ ] File aplikasi sudah siap

### Installation

- [ ] Sistem sudah di-update (`apt update && apt upgrade`)
- [ ] Docker sudah terinstall
- [ ] Docker Compose sudah terinstall
- [ ] Nginx sudah terinstall
- [ ] Certbot sudah terinstall (jika pakai SSL)

### Configuration

- [ ] File aplikasi sudah di-upload ke `/var/www/aplikasi`
- [ ] File `.env` backend sudah dikonfigurasi
- [ ] File `.env` frontend sudah dikonfigurasi
- [ ] JWT secret sudah di-generate
- [ ] Permissions folder sudah di-set

### Docker

- [ ] `docker-compose.yml` sudah benar
- [ ] Dockerfile backend sudah ada
- [ ] Dockerfile frontend sudah ada
- [ ] Container MySQL running
- [ ] Container Backend running
- [ ] Container Frontend running

### Nginx

- [ ] Konfigurasi Nginx sudah dibuat
- [ ] Nginx config test passed (`nginx -t`)
- [ ] Nginx sudah restart
- [ ] Aplikasi bisa diakses via browser

### SSL (Jika Pakai Domain)

- [ ] Domain sudah resolve ke IP VPS
- [ ] SSL certificate sudah terinstall
- [ ] HTTPS bisa diakses
- [ ] Auto-renewal sudah di-setup

### Database

- [ ] MySQL container running
- [ ] Database sudah diinisialisasi
- [ ] Admin user sudah dibuat
- [ ] Bisa login ke aplikasi

### Security

- [ ] Firewall sudah dikonfigurasi
- [ ] Port 22, 80, 443 sudah di-allow
- [ ] Password admin sudah diganti

### Testing

- [ ] Login berhasil
- [ ] Navigasi halaman berhasil
- [ ] Upload file berhasil
- [ ] CRUD operations berhasil
- [ ] Logout berhasil

### Maintenance

- [ ] Backup database sudah di-setup
- [ ] Log rotation sudah dikonfigurasi
- [ ] Monitoring sudah di-setup (opsional)


---

## 14. Command Reference (Cheat Sheet)

### Docker Commands

```bash
# Lihat semua container
docker ps -a

# Lihat logs
docker-compose logs -f

# Restart container
docker-compose restart

# Stop container
docker-compose stop

# Start container
docker-compose start

# Rebuild container
docker-compose up -d --build

# Hapus container
docker-compose down

# Masuk ke container
docker exec -it backend_container sh
docker exec -it mysql_container bash

# Lihat resource usage
docker stats

# Clean up
docker system prune -a
```

### Nginx Commands

```bash
# Test config
nginx -t

# Restart Nginx
systemctl restart nginx

# Stop Nginx
systemctl stop nginx

# Start Nginx
systemctl start nginx

# Status Nginx
systemctl status nginx

# Reload config
systemctl reload nginx
```

### MySQL Commands

```bash
# Backup database
docker exec mysql_container mysqldump -u root -p[PASSWORD] aplikasi_db > backup.sql

# Restore database
docker exec -i mysql_container mysql -u root -p[PASSWORD] aplikasi_db < backup.sql

# Masuk ke MySQL
docker exec -it mysql_container mysql -u root -p

# Show databases
docker exec mysql_container mysql -u root -p[PASSWORD] -e "SHOW DATABASES;"
```

### System Commands

```bash
# Cek disk space
df -h

# Cek memory
free -h

# Cek CPU & processes
top

# Cek network
netstat -tulpn

# Cek firewall
ufw status

# Restart VPS
reboot
```

### SSL Commands

```bash
# Install SSL
certbot --nginx -d domain.com -d www.domain.com

# Renew SSL
certbot renew

# Test renewal
certbot renew --dry-run

# List certificates
certbot certificates
```


---

## 15. FAQ & Common Issues

### Q: Aplikasi tidak bisa diakses setelah deployment?

**A: Cek beberapa hal ini:**

```bash
# 1. Cek semua container running
docker-compose ps

# 2. Cek logs untuk error
docker-compose logs

# 3. Cek Nginx status
systemctl status nginx

# 4. Cek firewall
ufw status

# 5. Test port
curl http://localhost:3000
curl http://localhost:5000/api/health
```

### Q: Database connection error?

**A: Pastikan:**

```bash
# 1. MySQL container running
docker-compose ps mysql

# 2. Cek environment variables
docker exec backend_container env | grep DB_

# 3. Test koneksi dari backend
docker exec -it backend_container sh
node -e "const mysql = require('mysql2/promise'); mysql.createConnection({host:'mysql',user:'root',password:'YOUR_PASSWORD',database:'aplikasi_db'}).then(c => {console.log('Connected'); c.end();})"
```

### Q: Upload file tidak berfungsi?

**A: Cek permissions:**

```bash
# Set permissions folder uploads
chmod -R 777 /var/www/aplikasi/backend/uploads

# Restart backend
docker-compose restart backend
```

### Q: Frontend tidak bisa hit backend API?

**A: Cek CORS dan environment:**

```bash
# 1. Cek frontend .env
cat frontend/.env

# 2. Pastikan REACT_APP_API_URL benar
# Harus: https://yourdomain.com/api atau http://IP/api

# 3. Rebuild frontend
docker-compose up -d --build frontend
```

### Q: SSL certificate error?

**A: Troubleshoot SSL:**

```bash
# 1. Cek domain resolve
ping yourdomain.com

# 2. Cek certificate
certbot certificates

# 3. Renew certificate
certbot renew --force-renewal

# 4. Restart Nginx
systemctl restart nginx
```

### Q: VPS kehabisan disk space?

**A: Clean up:**

```bash
# 1. Cek disk usage
df -h

# 2. Clean Docker
docker system prune -a

# 3. Hapus old backups
rm /var/www/aplikasi/backup-*.sql

# 4. Clean logs
journalctl --vacuum-time=7d
```

### Q: Aplikasi lambat?

**A: Optimasi:**

```bash
# 1. Cek resource usage
docker stats

# 2. Tambah swap jika RAM kurang
# (lihat section 12.1)

# 3. Enable Gzip di Nginx
# (lihat section 12.2)

# 4. Restart semua
docker-compose restart
systemctl restart nginx
```

### Q: Lupa password admin?

**A: Reset password:**

```bash
# Masuk ke container backend
docker exec -it backend_container sh

# Jalankan script reset password
node scripts/reset-admin-password.js

# Atau manual via MySQL
docker exec -it mysql_container mysql -u root -p
USE aplikasi_db;
UPDATE users SET password='$2b$10$...' WHERE username='admin';
```

### Q: Bagaimana cara update aplikasi?

**A: Update process:**

```bash
# 1. Backup database dulu
docker exec mysql_container mysqldump -u root -p[PASSWORD] aplikasi_db > backup-before-update.sql

# 2. Pull/upload code baru
cd /var/www/aplikasi
git pull  # atau upload via FileZilla

# 3. Rebuild
docker-compose down
docker-compose up -d --build

# 4. Test aplikasi
```

### Q: Container terus restart?

**A: Debug:**

```bash
# Lihat logs detail
docker-compose logs [service-name]

# Cek error di backend
docker-compose logs backend | grep -i error

# Cek MySQL ready
docker-compose logs mysql | grep "ready for connections"
```


---

## 16. Support & Resources

### Official Documentation

- **Docker**: https://docs.docker.com
- **Docker Compose**: https://docs.docker.com/compose
- **Nginx**: https://nginx.org/en/docs
- **Certbot**: https://certbot.eff.org
- **Node.js**: https://nodejs.org/docs
- **React**: https://react.dev
- **MySQL**: https://dev.mysql.com/doc

### Hostinger Resources

- **Hostinger Help Center**: https://support.hostinger.com
- **VPS Tutorial**: https://support.hostinger.com/en/collections/1742614-vps
- **hPanel**: https://hpanel.hostinger.com

### Useful Tools

- **FileZilla** (SFTP Client): https://filezilla-project.org
- **PuTTY** (SSH Client): https://www.putty.org
- **Postman** (API Testing): https://www.postman.com
- **Netdata** (Monitoring): https://www.netdata.cloud

### Community

- **Stack Overflow**: https://stackoverflow.com
- **Docker Community**: https://forums.docker.com
- **Nginx Forum**: https://forum.nginx.org

---

## 17. Kesimpulan

Selamat! 🎉 Aplikasi kamu sekarang sudah live di VPS Hostinger.

### Yang Sudah Kamu Capai:

✅ Setup VPS dari nol  
✅ Install Docker & dependencies  
✅ Deploy aplikasi full-stack  
✅ Setup database MySQL  
✅ Konfigurasi Nginx reverse proxy  
✅ Install SSL certificate (jika pakai domain)  
✅ Setup firewall & security  
✅ Konfigurasi backup & maintenance  

### Next Steps:

1. **Ganti password admin** segera setelah login pertama
2. **Setup backup otomatis** untuk database
3. **Monitor aplikasi** secara berkala
4. **Update aplikasi** saat ada fitur baru
5. **Optimasi performance** jika diperlukan

### Tips Penting:

- 💾 **Backup database** secara rutin
- 🔒 **Update password** secara berkala
- 📊 **Monitor resource** VPS (CPU, RAM, Disk)
- 🔄 **Update sistem** secara berkala (`apt update && apt upgrade`)
- 📝 **Cek logs** jika ada masalah
- 🛡️ **Keep security** up to date

---

**Dibuat dengan ❤️ untuk deployment di VPS Hostinger**  
**Versi: 1.0 - Februari 2026**

---

## 📞 Need Help?

Jika ada masalah atau pertanyaan:

1. Cek section **FAQ & Common Issues** (Section 15)
2. Lihat **logs** untuk error details
3. Cek **Troubleshooting** (Section 10.3)
4. Hubungi support Hostinger jika masalah VPS

**Good luck! 🚀**
