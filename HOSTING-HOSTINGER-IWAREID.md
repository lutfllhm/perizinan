# 🚀 Hosting di VPS Hostinger - iwareid.com

Panduan lengkap hosting aplikasi IWARE Perizinan di VPS Hostinger dengan domain iwareid.com dari NOL sampai SELESAI.

---

## 📋 Yang Anda Butuhkan

- ✅ VPS Hostinger (sudah dibeli)
- ✅ Domain iwareid.com (sudah dibeli)
- ✅ Akses SSH ke VPS
- ✅ Source code aplikasi ini

---

## 🎯 LANGKAH 1: Setup VPS Hostinger

### 1.1 Login ke hPanel Hostinger

1. Buka: https://hpanel.hostinger.com
2. Login dengan akun Hostinger Anda
3. Pilih menu **VPS** di sidebar

### 1.2 Akses VPS

1. Klik VPS Anda
2. Catat informasi berikut:
   - **IP Address:** (contoh: 123.45.67.89)
   - **SSH Port:** (biasanya 22)
   - **Root Password:** (cek email atau reset di hPanel)

### 1.3 Connect ke VPS via SSH

**Windows (PowerShell/CMD):**
```cmd
ssh root@123.45.67.89
```

**Mac/Linux (Terminal):**
```bash
ssh root@123.45.67.89
```

Masukkan password root saat diminta.

**Alternatif:** Gunakan **Browser SSH** di hPanel Hostinger (klik tombol "Browser SSH")

---

## 🎯 LANGKAH 2: Update & Install Dependencies

### 2.1 Update System

```bash
# Update package list
apt update

# Upgrade packages
apt upgrade -y
```

### 2.2 Install Node.js 18.x

```bash
# Install curl
apt install curl -y

# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

# Install Node.js
apt install nodejs -y

# Verify installation
node -v
npm -v
```

Output harus menunjukkan Node.js v18.x.x

### 2.3 Install MySQL

```bash
# Install MySQL Server
apt install mysql-server -y

# Start MySQL
systemctl start mysql
systemctl enable mysql

# Secure MySQL installation
mysql_secure_installation
```

Saat setup MySQL:
- Set root password: **Buat password yang kuat** (catat!)
- Remove anonymous users: **Y**
- Disallow root login remotely: **Y**
- Remove test database: **Y**
- Reload privilege tables: **Y**

### 2.4 Install Nginx

```bash
# Install Nginx
apt install nginx -y

# Start Nginx
systemctl start nginx
systemctl enable nginx

# Check status
systemctl status nginx
```

### 2.5 Install PM2

```bash
# Install PM2 globally
npm install -g pm2

# Verify installation
pm2 -v
```

### 2.6 Install Git

```bash
# Install Git
apt install git -y

# Verify installation
git --version
```

---

## 🎯 LANGKAH 3: Upload Source Code

### 3.1 Buat Folder Aplikasi

```bash
# Buat folder
mkdir -p /var/www/iwareid

# Masuk ke folder
cd /var/www/iwareid
```

### 3.2 Upload Source Code

**Opsi A: Via Git (Recommended)**

Jika source code ada di GitHub/GitLab:
```bash
git clone https://github.com/username/iware-perizinan.git .
```

**Opsi B: Via FTP/SFTP**

1. Gunakan FileZilla atau WinSCP
2. Connect ke VPS:
   - Host: `123.45.67.89`
   - Username: `root`
   - Password: `your_root_password`
   - Port: `22`
3. Upload semua file ke `/var/www/iwareid/`

**Opsi C: Via ZIP Upload**

Di komputer lokal:
```bash
# Compress source code
zip -r iware-perizinan.zip . -x "node_modules/*" "frontend/node_modules/*" "backend/node_modules/*" "frontend/build/*"
```

Upload via SFTP, lalu di VPS:
```bash
cd /var/www/iwareid
unzip iware-perizinan.zip
rm iware-perizinan.zip
```

### 3.3 Verify Files

```bash
ls -la
```

Pastikan semua file ada (backend/, frontend/, package.json, dll)

---

## 🎯 LANGKAH 4: Setup Database

### 4.1 Login ke MySQL

```bash
mysql -u root -p
```

Masukkan password MySQL root yang tadi dibuat.

### 4.2 Buat Database & User

```sql
-- Buat database
CREATE DATABASE iware_perizinan;

-- Buat user khusus (ganti password!)
CREATE USER 'iware_user'@'localhost' IDENTIFIED BY 'IwarePassword123!';

-- Berikan akses
GRANT ALL PRIVILEGES ON iware_perizinan.* TO 'iware_user'@'localhost';

-- Reload privileges
FLUSH PRIVILEGES;

-- Keluar
EXIT;
```

**CATAT:**
- Database: `iware_perizinan`
- User: `iware_user`
- Password: `IwarePassword123!` (ganti dengan password Anda!)

---

## 🎯 LANGKAH 5: Install Dependencies

### 5.1 Install Dependencies

```bash
cd /var/www/iwareid

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Kembali ke root
cd /var/www/iwareid
```

Tunggu hingga selesai (5-10 menit).

---

## 🎯 LANGKAH 6: Configure Environment

### 6.1 Generate JWT Secret

```bash
cd /var/www/iwareid/backend
node scripts/generate-jwt-secret.js
```

**CATAT** output JWT secret yang dihasilkan!

### 6.2 Setup Backend Environment

```bash
cd /var/www/iwareid/backend

# Copy template
cp .env.production .env

# Edit file
nano .env
```

Isi dengan konfigurasi berikut:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MySQL Configuration
DB_HOST=localhost
DB_USER=iware_user
DB_PASSWORD=IwarePassword123!
DB_NAME=iware_perizinan

# JWT Secret (paste dari step 6.1)
JWT_SECRET=paste_jwt_secret_disini

# Frontend URL for CORS
FRONTEND_URL=https://iwareid.com

# WhatsApp API Configuration (Optional - bisa diaktifkan nanti)
WHATSAPP_API_URL=https://api.fonnte.com/send
WHATSAPP_API_TOKEN=
WHATSAPP_ENABLED=false
WHATSAPP_HRD_NUMBER=085708600406
```

**Penting:**
- Ganti `DB_PASSWORD` dengan password MySQL Anda
- Ganti `JWT_SECRET` dengan hasil generate tadi
- `FRONTEND_URL` sudah benar: `https://iwareid.com`

Save: **Ctrl+X**, **Y**, **Enter**

### 6.3 Setup Frontend Environment

```bash
cd /var/www/iwareid/frontend

# Create .env file
nano .env
```

Isi dengan:

```env
REACT_APP_API_URL=https://iwareid.com
```

Save: **Ctrl+X**, **Y**, **Enter**

---

## 🎯 LANGKAH 7: Initialize Database

### 7.1 Run Database Initialization

```bash
cd /var/www/iwareid/backend
npm run init-db
```

Output harus menunjukkan:
```
✅ Database tables initialized successfully!
✅ Default admin user created (admin/admin123)
```

### 7.2 Verify Database

```bash
mysql -u iware_user -p iware_perizinan
```

Masukkan password, lalu:

```sql
-- Cek tables
SHOW TABLES;

-- Cek users
SELECT * FROM users;

-- Keluar
EXIT;
```

Harus ada 2 tables: `users` dan `pengajuan`

---

## 🎯 LANGKAH 8: Build Frontend

### 8.1 Build Production

```bash
cd /var/www/iwareid/frontend
npm run build
```

Tunggu hingga selesai (2-5 menit).

### 8.2 Verify Build

```bash
ls -la build/
```

Harus ada folder `build/` dengan file-file HTML, CSS, JS.

---

## 🎯 LANGKAH 9: Setup PM2

### 9.1 Start Backend dengan PM2

```bash
cd /var/www/iwareid/backend
pm2 start server.js --name iware-backend
```

### 9.2 Install Serve & Start Frontend

```bash
# Install serve globally
npm install -g serve

# Start frontend
cd /var/www/iwareid/frontend
pm2 start "serve -s build -l 3000" --name iware-frontend
```

### 9.3 Save PM2 Configuration

```bash
# Save PM2 process list
pm2 save

# Setup PM2 startup script
pm2 startup

# Copy & paste command yang muncul, contoh:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

### 9.4 Verify PM2

```bash
pm2 list
```

Harus ada 2 processes:
- `iware-backend` - status: **online**
- `iware-frontend` - status: **online**

### 9.5 Test Backend

```bash
curl http://localhost:5000/health
```

Output harus: `{"status":"OK",...}`

---

## 🎯 LANGKAH 10: Point Domain ke VPS

### 10.1 Get VPS IP

```bash
curl ifconfig.me
```

**CATAT** IP address ini (contoh: 123.45.67.89)

### 10.2 Setup DNS di Hostinger

1. Login ke hPanel Hostinger
2. Pilih menu **Domains**
3. Klik **Manage** pada domain `iwareid.com`
4. Pilih tab **DNS / Name Servers**
5. Klik **Manage DNS Records**

### 10.3 Tambah DNS Records

**Hapus semua A records yang ada**, lalu tambahkan:

**Record 1:**
```
Type: A
Name: @
Points to: 123.45.67.89 (IP VPS Anda)
TTL: 3600
```

**Record 2:**
```
Type: A
Name: www
Points to: 123.45.67.89 (IP VPS Anda)
TTL: 3600
```

Klik **Save** atau **Add Record**

### 10.4 Tunggu DNS Propagation

Tunggu 5-30 menit, lalu test:

```bash
# Di VPS atau komputer lokal
ping iwareid.com
```

Jika IP yang muncul sesuai dengan VPS IP, berarti DNS sudah propagate!

---

## 🎯 LANGKAH 11: Setup Nginx

### 11.1 Create Nginx Configuration

```bash
nano /etc/nginx/sites-available/iwareid.com
```

Paste konfigurasi berikut:

```nginx
server {
    listen 80;
    server_name iwareid.com www.iwareid.com;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Frontend - React App
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:5000/health;
        access_log off;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:5000/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/iwareid-access.log;
    error_log /var/log/nginx/iwareid-error.log;
}
```

Save: **Ctrl+X**, **Y**, **Enter**

### 11.2 Enable Site

```bash
# Create symlink
ln -s /etc/nginx/sites-available/iwareid.com /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t
```

Output harus: `syntax is ok` dan `test is successful`

### 11.3 Restart Nginx

```bash
systemctl restart nginx
```

### 11.4 Test Domain (HTTP)

Buka browser: `http://iwareid.com`

Aplikasi seharusnya sudah bisa diakses (masih HTTP, belum HTTPS)!

---

## 🎯 LANGKAH 12: Setup SSL/HTTPS (Let's Encrypt)

### 12.1 Install Certbot

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y
```

### 12.2 Obtain SSL Certificate

```bash
certbot --nginx -d iwareid.com -d www.iwareid.com
```

Ikuti instruksi:

1. **Email address:** Masukkan email Anda (untuk notifikasi)
2. **Terms of Service:** Ketik **Y** (agree)
3. **Share email with EFF:** Ketik **N** (optional)
4. **Redirect HTTP to HTTPS:** Ketik **2** (Yes, redirect)

Tunggu proses selesai (1-2 menit).

### 12.3 Verify SSL

Buka browser: `https://iwareid.com`

Harus ada icon gembok 🔒 di address bar!

### 12.4 Test SSL Rating

Buka: https://www.ssllabs.com/ssltest/analyze.html?d=iwareid.com

Rating harus **A** atau **A+**

### 12.5 Setup Auto-Renewal

```bash
# Test renewal
certbot renew --dry-run
```

Jika berhasil, certificate akan auto-renew setiap 60 hari.

---

## 🎯 LANGKAH 13: Setup Firewall

### 13.1 Configure UFW

```bash
# Allow SSH (PENTING!)
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

Output harus menunjukkan port 22, 80, 443 allowed.

---

## 🎯 LANGKAH 14: Fix Permissions

### 14.1 Set Ownership

```bash
cd /var/www/iwareid

# Set ownership
chown -R www-data:www-data .

# Set permissions
chmod -R 755 .

# Set uploads directory
chmod -R 777 backend/uploads
```

---

## 🎯 LANGKAH 15: Final Testing

### 15.1 Test Endpoints

```bash
# Health check
curl https://iwareid.com/health

# API health
curl https://iwareid.com/api/health
```

Kedua harus return JSON dengan status OK.

### 15.2 Test Login

1. Buka browser: `https://iwareid.com`
2. Klik **Login**
3. Masukkan:
   - Username: `admin`
   - Password: `admin123`
4. Klik **Login**

Harus berhasil masuk ke dashboard!

### 15.3 Change Default Password

1. Di dashboard, klik **Manajemen Akun** atau **Profile**
2. Pilih tab **Ganti Password**
3. Masukkan:
   - Password Lama: `admin123`
   - Password Baru: `password_baru_anda`
   - Konfirmasi: `password_baru_anda`
4. Klik **Ubah Password**

### 15.4 Test Mobile

Buka `https://iwareid.com` di smartphone untuk test responsive design.

---

## 🎯 LANGKAH 16: Monitoring & Maintenance

### 16.1 Check PM2 Status

```bash
pm2 list
pm2 logs
pm2 monit
```

### 16.2 Check Nginx Logs

```bash
# Access log
tail -f /var/log/nginx/iwareid-access.log

# Error log
tail -f /var/log/nginx/iwareid-error.log
```

### 16.3 Restart Services

```bash
# Restart PM2 apps
pm2 restart all

# Restart Nginx
systemctl restart nginx

# Restart MySQL
systemctl restart mysql
```

### 16.4 Backup Database

```bash
# Create backup
mysqldump -u iware_user -p iware_perizinan > /root/backup-$(date +%Y%m%d).sql

# Restore backup (jika diperlukan)
mysql -u iware_user -p iware_perizinan < /root/backup-20260206.sql
```

---

## ✅ SELESAI! Aplikasi Sudah Live!

### 🎉 Informasi Akses

**Website:** https://iwareid.com

**Login Admin:**
- Username: `admin`
- Password: `password_baru_anda` (yang sudah diubah)

**API Endpoint:** https://iwareid.com/api

**Health Check:** https://iwareid.com/health

---

## 📊 Summary Konfigurasi

### Server
- **VPS:** Hostinger
- **OS:** Ubuntu 20.04/22.04
- **IP:** 123.45.67.89 (ganti dengan IP Anda)

### Domain
- **Domain:** iwareid.com
- **DNS:** Pointing ke VPS IP
- **SSL:** Let's Encrypt (Auto-renewal)

### Database
- **Type:** MySQL 8.0
- **Database:** iware_perizinan
- **User:** iware_user
- **Password:** IwarePassword123! (ganti dengan password Anda)

### Application
- **Backend:** Node.js + Express (Port 5000)
- **Frontend:** React (Port 3000)
- **Process Manager:** PM2
- **Web Server:** Nginx (Port 80/443)

### Paths
- **Application:** /var/www/iwareid
- **Nginx Config:** /etc/nginx/sites-available/iwareid.com
- **SSL Cert:** /etc/letsencrypt/live/iwareid.com/
- **Logs:** /var/log/nginx/iwareid-*.log

---

## 🆘 Troubleshooting

### Website tidak bisa diakses

```bash
# Cek DNS
ping iwareid.com

# Cek Nginx
systemctl status nginx
nginx -t

# Cek PM2
pm2 list

# Cek firewall
ufw status
```

### 502 Bad Gateway

```bash
# Cek backend running
curl http://localhost:5000/health

# Restart PM2
pm2 restart all

# Cek logs
pm2 logs iware-backend
```

### Database connection error

```bash
# Cek MySQL running
systemctl status mysql

# Test connection
mysql -u iware_user -p iware_perizinan

# Cek backend .env
nano /var/www/iwareid/backend/.env
```

### SSL certificate error

```bash
# Renew certificate
certbot renew --force-renewal

# Restart Nginx
systemctl restart nginx
```

### Permission denied

```bash
cd /var/www/iwareid
chown -R www-data:www-data .
chmod -R 755 .
chmod -R 777 backend/uploads
```

---

## 🔄 Update Aplikasi

Jika ada update source code:

```bash
# Backup database
mysqldump -u iware_user -p iware_perizinan > /root/backup-before-update.sql

# Pull latest code (jika pakai Git)
cd /var/www/iwareid
git pull origin main

# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Rebuild frontend
cd /var/www/iwareid/frontend
npm run build

# Restart PM2
pm2 restart all

# Clear Nginx cache (optional)
systemctl restart nginx
```

---

## 📞 Support

Jika ada masalah:

1. **Cek logs:**
   ```bash
   pm2 logs
   tail -f /var/log/nginx/iwareid-error.log
   ```

2. **Restart services:**
   ```bash
   pm2 restart all
   systemctl restart nginx
   ```

3. **Test endpoints:**
   ```bash
   curl http://localhost:5000/health
   curl http://localhost:3000
   ```

4. **Contact Hostinger Support:**
   - Live Chat di hPanel
   - Email: support@hostinger.com

---

## 🎉 Selamat!

Aplikasi IWARE Perizinan sudah berhasil di-hosting di VPS Hostinger dengan domain **iwareid.com**!

**Akses sekarang:** https://iwareid.com

---

© 2026 IWARE. All rights reserved.
