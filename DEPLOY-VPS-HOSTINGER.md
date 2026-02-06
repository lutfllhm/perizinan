# 🚀 Panduan Deploy ke VPS Hostinger

Panduan lengkap untuk deploy aplikasi iWare (Frontend React + Backend Node.js) ke VPS Hostinger.

---

## 📋 Persiapan Awal

### Yang Anda Butuhkan:
- ✅ VPS Hostinger sudah aktif
- ✅ Domain sudah pointing ke IP VPS
- ✅ Akses SSH ke VPS
- ✅ Database MySQL sudah dibuat di Hostinger

---

## 🔧 LANGKAH 1: Akses VPS & Persiapan

### 1.1 Login ke VPS via SSH
```bash
ssh root@your-vps-ip
# atau
ssh username@your-vps-ip
```

### 1.2 Update sistem
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Install Node.js (jika belum ada)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Pastikan >= 18.0.0
npm --version
```

### 1.4 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 1.5 Install Nginx (Web Server)
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 1.6 Buat struktur folder
```bash
mkdir -p ~/iware-app/backend
mkdir -p ~/iware-app/frontend
```

---

## 📦 LANGKAH 2: Deploy Backend

### 2.1 Upload Backend ke VPS

**Opsi A: Menggunakan Git (Recommended)**
```bash
cd ~/iware-app
git clone https://your-repo-url.git .
# atau jika sudah ada repo
cd ~/iware-app
git pull origin main
```

**Opsi B: Menggunakan FTP/SFTP**
- Upload semua file dari folder `backend/` ke `~/iware-app/backend/`
- Gunakan FileZilla, WinSCP, atau FTP client lainnya

### 2.2 Install Dependencies
```bash
cd ~/iware-app/backend
npm install --production
```

### 2.3 Setup Environment Variables

**Copy template .env:**
```bash
cd ~/iware-app/backend
cp .env.hostinger .env
```

**Edit file .env:**
```bash
nano .env
```

**Isi dengan konfigurasi VPS Anda:**
```env
# ============================================
# SERVER CONFIGURATION
# ============================================
NODE_ENV=production
PORT=5000

# Ganti dengan domain Anda
API_URL=https://yourdomain.com/api
FRONTEND_URL=https://yourdomain.com

# ============================================
# DATABASE CONFIGURATION
# ============================================
# Ambil dari Hostinger Control Panel > MySQL Databases
DB_HOST=localhost
DB_USER=u123456789_iware
DB_PASSWORD=password_database_anda
DB_NAME=u123456789_iware
DB_PORT=3306

DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0

# ============================================
# JWT CONFIGURATION
# ============================================
# Generate menggunakan script (lihat langkah berikutnya)
JWT_SECRET=your_generated_jwt_secret_minimum_32_characters
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# ============================================
# CORS CONFIGURATION
# ============================================
CORS_ORIGIN=https://yourdomain.com
CORS_CREDENTIALS=true

# ============================================
# FILE UPLOAD
# ============================================
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,application/pdf

# ============================================
# ADMIN DEFAULT (untuk inisialisasi database)
# ============================================
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_NAMA=Administrator
```

**Simpan file:** Tekan `CTRL+X`, lalu `Y`, lalu `Enter`

### 2.4 Generate JWT Secret
```bash
cd ~/iware-app/backend
node scripts/generate-jwt-secret.js
```

**Copy hasil JWT Secret dan paste ke file .env:**
```bash
nano .env
# Update baris JWT_SECRET dengan hasil generate
```

### 2.5 Buat Database MySQL

**Login ke MySQL:**
```bash
mysql -u root -p
# atau
mysql -u your_db_user -p
```

**Buat database (jika belum):**
```sql
CREATE DATABASE u123456789_iware CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON u123456789_iware.* TO 'u123456789_iware'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2.6 Initialize Database
```bash
cd ~/iware-app/backend
node scripts/init-database.js
```

**Output yang diharapkan:**
```
✅ Database tables created successfully
✅ Admin user created
✅ Database initialized
```

### 2.7 Test Backend
```bash
cd ~/iware-app/backend
node server.js
```

**Jika berhasil, Anda akan melihat:**
```
Server running on port 5000
Database connected successfully
```

**Tekan CTRL+C untuk stop, lalu jalankan dengan PM2:**

### 2.8 Start Backend dengan PM2
```bash
cd ~/iware-app/backend
pm2 start server.js --name iware-backend
pm2 save
pm2 startup
# Ikuti instruksi yang muncul untuk auto-start saat reboot
```

**Cek status:**
```bash
pm2 status
pm2 logs iware-backend
```

---

## 🎨 LANGKAH 3: Deploy Frontend

### 3.1 Build Frontend di Komputer Lokal

**Di komputer lokal Anda:**
```bash
cd frontend
```

**Buat file `.env.production`:**
```bash
# Windows
notepad .env.production

# Mac/Linux
nano .env.production
```

**Isi dengan:**
```env
REACT_APP_API_URL=https://yourdomain.com
```

**Install dependencies & build:**
```bash
npm install
npm run build
```

**Folder `build/` akan terbuat dengan semua file production.**

### 3.2 Upload Frontend ke VPS

**Opsi A: Menggunakan SCP (dari komputer lokal)**
```bash
cd frontend
scp -r build/* username@your-vps-ip:~/iware-app/frontend/
```

**Opsi B: Menggunakan FTP/SFTP**
- Upload semua isi folder `frontend/build/` ke `~/iware-app/frontend/` di VPS
- Gunakan FileZilla atau WinSCP

**Opsi C: Build langsung di VPS (jika RAM cukup)**
```bash
cd ~/iware-app/frontend
npm install
npm run build
# Pindahkan hasil build
rm -rf ~/iware-app/frontend-dist
mv build ~/iware-app/frontend-dist
```

### 3.3 Set Permissions
```bash
cd ~/iware-app
sudo chown -R www-data:www-data frontend/
sudo chmod -R 755 frontend/
```

---

## 🌐 LANGKAH 4: Setup Nginx

### 4.1 Buat Konfigurasi Nginx
```bash
sudo nano /etc/nginx/sites-available/iware
```

**Paste konfigurasi berikut:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend - React App
    root /home/username/iware-app/frontend;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # Frontend - Serve static files
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Backend API - Proxy ke Node.js
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
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Upload files
    location /uploads {
        alias /home/username/iware-app/backend/uploads;
        autoindex off;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Hide Nginx version
    server_tokens off;
}
```

**⚠️ PENTING: Ganti `username` dengan username VPS Anda!**

**Simpan file:** `CTRL+X` → `Y` → `Enter`

### 4.2 Aktifkan Konfigurasi
```bash
sudo ln -s /etc/nginx/sites-available/iware /etc/nginx/sites-enabled/
```

### 4.3 Test Konfigurasi Nginx
```bash
sudo nginx -t
```

**Output yang diharapkan:**
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 4.4 Restart Nginx
```bash
sudo systemctl restart nginx
```

---

## 🔒 LANGKAH 5: Setup SSL (HTTPS)

### 5.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 5.2 Generate SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**Ikuti instruksi:**
- Masukkan email Anda
- Setuju terms of service
- Pilih opsi redirect HTTP ke HTTPS (recommended)

### 5.3 Test Auto-Renewal
```bash
sudo certbot renew --dry-run
```

**SSL akan auto-renew setiap 90 hari.**

---

## 🔥 LANGKAH 6: Setup Firewall

### 6.1 Install UFW (jika belum ada)
```bash
sudo apt install -y ufw
```

### 6.2 Konfigurasi Firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## ✅ LANGKAH 7: Verifikasi & Testing

### 7.1 Cek Backend
```bash
pm2 status
pm2 logs iware-backend
```

### 7.2 Cek Nginx
```bash
sudo systemctl status nginx
```

### 7.3 Test API
```bash
curl http://localhost:5000/api/health
# atau
curl https://yourdomain.com/api/health
```

### 7.4 Buka Browser
```
https://yourdomain.com
```

**Test login dengan:**
- Username: `admin`
- Password: `admin123` (atau sesuai .env)

---

## 🔄 Update Aplikasi (Setelah Deploy)

### Update Backend
```bash
cd ~/iware-app/backend
git pull origin main  # jika pakai git
npm install --production
pm2 restart iware-backend
```

### Update Frontend
```bash
# Di komputer lokal
cd frontend
npm run build

# Upload ke VPS
scp -r build/* username@your-vps-ip:~/iware-app/frontend/

# Di VPS
sudo systemctl reload nginx
```

---

## 🐛 Troubleshooting

### Backend tidak jalan
```bash
# Cek logs
pm2 logs iware-backend

# Cek port
sudo netstat -tulpn | grep 5000

# Restart backend
pm2 restart iware-backend
```

### Database connection error
```bash
# Test koneksi MySQL
mysql -u your_db_user -p your_db_name

# Cek .env file
cd ~/iware-app/backend
cat .env | grep DB_
```

### Frontend tidak load
```bash
# Cek Nginx error log
sudo tail -f /var/log/nginx/error.log

# Cek file permissions
ls -la ~/iware-app/frontend/

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 502 Bad Gateway
```bash
# Backend mungkin tidak jalan
pm2 status
pm2 restart iware-backend

# Cek firewall
sudo ufw status
```

### CORS Error
```bash
# Edit .env backend
cd ~/iware-app/backend
nano .env

# Pastikan CORS_ORIGIN sesuai domain
CORS_ORIGIN=https://yourdomain.com

# Restart backend
pm2 restart iware-backend
```

---

## 📊 Monitoring

### Cek Resource Usage
```bash
# CPU & Memory
htop

# Disk space
df -h

# PM2 monitoring
pm2 monit
```

### Setup PM2 Web Dashboard (Optional)
```bash
pm2 install pm2-server-monit
```

---

## 🔐 Security Best Practices

### 1. Ganti Password Admin
Login ke aplikasi → Settings → Change Password

### 2. Ganti Password Database
```bash
mysql -u root -p
ALTER USER 'your_db_user'@'localhost' IDENTIFIED BY 'new_strong_password';
FLUSH PRIVILEGES;
EXIT;

# Update .env
nano ~/iware-app/backend/.env
pm2 restart iware-backend
```

### 3. Disable Root Login SSH
```bash
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

### 4. Setup Fail2Ban
```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 📝 Checklist Deploy

- [ ] VPS sudah aktif & accessible via SSH
- [ ] Domain sudah pointing ke IP VPS
- [ ] Node.js & PM2 terinstall
- [ ] Nginx terinstall & running
- [ ] Database MySQL sudah dibuat
- [ ] Backend uploaded & .env configured
- [ ] JWT Secret generated
- [ ] Database initialized
- [ ] Backend running dengan PM2
- [ ] Frontend build & uploaded
- [ ] Nginx configured & tested
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Aplikasi bisa diakses via browser
- [ ] Login admin berhasil
- [ ] Password admin sudah diganti

---

## 📞 Support

Jika ada masalah:
1. Cek logs: `pm2 logs iware-backend`
2. Cek Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Cek database connection
4. Pastikan semua service running

---

**🎉 Selamat! Aplikasi Anda sudah live di VPS Hostinger!**

Domain: https://yourdomain.com
