# 🚀 Panduan Deployment Full Stack - iwareid.com

Panduan lengkap deploy aplikasi Full Stack (Frontend React + Backend Node.js + MySQL) ke VPS Hostinger.

---

## 📋 Persiapan

### Yang Dibutuhkan:
- ✅ VPS Hostinger (minimal KVM 2: 2 CPU, 4GB RAM)
- ✅ Domain iwareid.com
- ✅ SSH access ke VPS
- ✅ FileZilla atau WinSCP untuk upload file

### Software yang Harus Terinstall di VPS:
- Docker
- Docker Compose
- Nginx
- Certbot (untuk SSL)

---

## 🎯 Step-by-Step Deployment

### STEP 1: Setup VPS & Install Dependencies

#### 1.1 Login ke VPS

```bash
# Dari komputer lokal
ssh root@[IP-VPS-KAMU]
```

#### 1.2 Update Sistem

```bash
# Update package list
apt update

# Upgrade packages
apt upgrade -y

# Install basic tools
apt install -y curl wget git nano ufw
```

#### 1.3 Install Docker

```bash
# Download Docker installation script
curl -fsSL https://get.docker.com -o get-docker.sh

# Run installation
sh get-docker.sh

# Verify installation
docker --version

# Should output: Docker version 25.x.x
```

#### 1.4 Install Docker Compose

```bash
# Install Docker Compose
apt install docker-compose -y

# Verify installation
docker-compose --version

# Should output: docker-compose version 1.29.x
```

#### 1.5 Install Nginx

```bash
# Install Nginx
apt install nginx -y

# Start Nginx
systemctl start nginx
systemctl enable nginx

# Check status
systemctl status nginx
```

#### 1.6 Install Certbot (untuk SSL)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Verify
certbot --version
```

---

### STEP 2: Setup Domain DNS

#### 2.1 Login ke Hostinger Panel

1. Buka **hpanel.hostinger.com**
2. Login dengan akun kamu
3. Pilih **Domains** → **iwareid.com**
4. Klik **DNS / Name Servers**

#### 2.2 Tambah A Records

Hapus semua A record yang ada, lalu tambah:

**Record 1 (Root domain):**
```
Type: A
Name: @
Points to: [IP-VPS-KAMU]
TTL: 14400
```

**Record 2 (WWW subdomain):**
```
Type: A
Name: www
Points to: [IP-VPS-KAMU]
TTL: 14400
```

#### 2.3 Tunggu Propagasi DNS

Tunggu 5-30 menit untuk DNS propagasi. Cek dengan:

```bash
# Dari komputer lokal
ping iwareid.com

# Harus resolve ke IP VPS kamu
```

---

### STEP 3: Upload File Aplikasi ke VPS

#### 3.1 Buat Folder di VPS

```bash
# SSH ke VPS
ssh root@[IP-VPS]

# Buat folder deployment
mkdir -p /var/www/backend
cd /var/www/backend
```

#### 3.2 Upload File dengan FileZilla

1. Buka **FileZilla**
2. Klik **File** → **Site Manager**
3. Klik **New Site**, beri nama "VPS iwareid"
4. Isi konfigurasi:
   - Protocol: **SFTP**
   - Host: **[IP-VPS-KAMU]**
   - Port: **22**
   - Logon Type: **Normal**
   - User: **root**
   - Password: **[PASSWORD-VPS]**
5. Klik **Connect**
6. Di panel kanan, navigasi ke: `/var/www/backend`
7. Di panel kiri, pilih folder project kamu
8. Drag & drop semua file ke panel kanan:
   - ✅ backend/ folder
   - ✅ frontend/ folder
   - ✅ docker-compose.yml
   - ✅ nginx-vps.conf
   - ✅ deploy-vps.sh
   - ✅ Semua file lainnya

9. Tunggu upload selesai (5-15 menit tergantung ukuran & kecepatan internet)

#### 3.3 Verifikasi Upload

```bash
# SSH ke VPS
cd /var/www/backend

# Cek file
ls -la

# Harus ada:
# - backend/
# - frontend/
# - docker-compose.yml
# - nginx-vps.conf
# - deploy-vps.sh
```

---

### STEP 4: Deploy dengan Docker

#### 4.1 Set Permissions

```bash
cd /var/www/backend

# Make deploy script executable
chmod +x deploy-vps.sh

# Set folder permissions
chmod -R 755 .
```

#### 4.2 Jalankan Deploy Script

```bash
# Run deployment script
./deploy-vps.sh
```

Script akan otomatis:
- ✅ Set permissions
- ✅ Copy environment files
- ✅ Stop container lama
- ✅ Build & start container baru
- ✅ Wait for MySQL ready
- ✅ Initialize database
- ✅ Run health checks

**Proses ini memakan waktu 5-10 menit.**

#### 4.3 Cek Status Container

```bash
# Check all containers
docker-compose ps

# Should show:
# iware-mysql      Up      0.0.0.0:3306->3306/tcp
# iware-backend    Up      0.0.0.0:5000->5000/tcp
# iware-frontend   Up      0.0.0.0:3000->80/tcp
```

Semua container harus status **Up**.

#### 4.4 Cek Logs (Jika Ada Error)

```bash
# View all logs
docker-compose logs

# View specific container logs
docker logs iware-mysql
docker logs iware-backend
docker logs iware-frontend

# Follow logs real-time
docker-compose logs -f
```

---

### STEP 5: Setup Nginx Reverse Proxy

#### 5.1 Copy Nginx Config

```bash
# Copy config file
cp /var/www/backend/nginx-vps.conf /etc/nginx/sites-available/iwareid

# Remove default config
rm /etc/nginx/sites-enabled/default

# Create symbolic link
ln -s /etc/nginx/sites-available/iwareid /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Should output: syntax is ok
```

#### 5.2 Restart Nginx

```bash
# Restart Nginx
systemctl restart nginx

# Check status
systemctl status nginx

# Should be: active (running)
```

---

### STEP 6: Test HTTP Access (Sebelum SSL)

#### 6.1 Test dari Browser

Buka browser dan akses:

1. **Frontend**: `http://iwareid.com`
   - Harus muncul halaman login
   
2. **Backend API**: `http://iwareid.com/api/health`
   - Harus return: `{"status":"ok"}`

3. **WWW redirect**: `http://www.iwareid.com`
   - Harus redirect ke non-www

#### 6.2 Test dari VPS

```bash
# Test frontend
curl http://localhost:3000

# Test backend
curl http://localhost:5000/api/health

# Test via Nginx
curl http://iwareid.com/api/health
```

---

### STEP 7: Install SSL Certificate (HTTPS)

#### 7.1 Install Certificate

```bash
# Run Certbot
certbot --nginx -d iwareid.com -d www.iwareid.com
```

#### 7.2 Ikuti Instruksi Certbot

1. **Enter email address**: Masukkan email kamu
2. **Agree to terms**: Ketik `Y`
3. **Share email with EFF**: Ketik `N` (optional)
4. **Redirect HTTP to HTTPS**: Pilih `2` (Redirect)

#### 7.3 Tunggu Proses Selesai

Output yang diharapkan:
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/iwareid.com/fullchain.pem
Key is saved at: /etc/letsencrypt/live/iwareid.com/privkey.pem
Congratulations! You have successfully enabled HTTPS on https://iwareid.com
```

---

### STEP 8: Verifikasi HTTPS

#### 8.1 Test HTTPS

Buka browser: `https://iwareid.com`

Harus ada:
- ✅ Gembok hijau (secure connection)
- ✅ Certificate valid
- ✅ Aplikasi berjalan normal

#### 8.2 Test Redirect

Test URL ini harus auto-redirect ke HTTPS:
- `http://iwareid.com` → `https://iwareid.com`
- `http://www.iwareid.com` → `https://iwareid.com`

---

### STEP 9: Setup Auto-Renewal SSL

#### 9.1 Test Auto-Renewal

```bash
# Test renewal (dry run)
certbot renew --dry-run

# Should output: Congratulations, all simulated renewals succeeded
```

#### 9.2 Setup Cron Job

```bash
# Edit crontab
crontab -e

# Pilih editor: 1 (nano)

# Tambahkan baris ini di paling bawah:
0 3 * * * certbot renew --quiet --post-hook "systemctl reload nginx"

# Save: Ctrl+X, Y, Enter
```

Ini akan auto-renew SSL setiap hari jam 3 pagi.

---

### STEP 10: Setup Firewall

#### 10.1 Configure UFW

```bash
# Allow SSH (PENTING! Jangan lupa ini!)
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status

# Should show:
# 22/tcp    ALLOW
# 80/tcp    ALLOW
# 443/tcp   ALLOW
```

---

### STEP 11: Test Semua Fitur

#### 11.1 Test Login

1. Buka `https://iwareid.com`
2. Klik **Login** atau **Login Staff**
3. Login dengan:
   - Username: `admin`
   - Password: `admin123`

Atau:
   - Username: `hrd`
   - Password: `hrd123`

#### 11.2 Test Fitur Aplikasi

Checklist testing:
- [ ] Login berhasil
- [ ] Dashboard muncul
- [ ] Navigasi antar halaman
- [ ] Upload file/foto
- [ ] Create pengajuan baru
- [ ] Edit data
- [ ] Delete data
- [ ] Approve/reject pengajuan
- [ ] Logout

---

### STEP 12: Ganti Password Default

⚠️ **PENTING: Ganti password default setelah login pertama!**

1. Login sebagai admin
2. Masuk ke menu Profile/Settings
3. Ganti password admin dan hrd

---

## 🔧 Troubleshooting

### Container Tidak Start

```bash
# Cek logs
docker-compose logs

# Restart container
docker-compose restart

# Rebuild jika perlu
docker-compose down
docker-compose up -d --build
```

### Database Connection Error

```bash
# Cek MySQL logs
docker logs iware-mysql

# Cek backend logs
docker logs iware-backend

# Reset MySQL volume
docker-compose down
docker volume rm backend_mysql_data
docker-compose up -d
```

### Frontend Tidak Bisa Hit Backend

```bash
# Cek frontend environment
docker exec iware-frontend env | grep REACT_APP

# Rebuild frontend
docker-compose up -d --build frontend

# Clear browser cache
# Tekan Ctrl+Shift+R di browser
```

### Nginx Error

```bash
# Test config
nginx -t

# Cek error log
tail -f /var/log/nginx/error.log

# Restart Nginx
systemctl restart nginx
```

### SSL Certificate Error

```bash
# Renew certificate
certbot renew --force-renewal

# Restart Nginx
systemctl restart nginx

# Check certificate
certbot certificates
```

---

## 📊 Monitoring & Maintenance

### Cek Status Container

```bash
# Status semua container
docker-compose ps

# Resource usage
docker stats

# Logs real-time
docker-compose logs -f
```

### Backup Database

```bash
# Manual backup
docker exec iware-mysql mysqldump -u root -pJasadenam66/ iware_perizinan > backup-$(date +%Y%m%d).sql

# Restore backup
docker exec -i iware-mysql mysql -u root -pJasadenam66/ iware_perizinan < backup-20260211.sql
```

### Update Aplikasi

```bash
cd /var/www/backend

# Pull latest code (jika pakai Git)
git pull

# Atau upload file baru via FileZilla

# Rebuild dan restart
docker-compose down
docker-compose up -d --build

# Cek logs
docker-compose logs -f
```

### Restart Aplikasi

```bash
# Restart semua
docker-compose restart

# Restart spesifik
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mysql
```

---

## 📝 Command Reference

### Docker Commands

```bash
# Start all containers
docker-compose up -d

# Stop all containers
docker-compose down

# Rebuild containers
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Restart containers
docker-compose restart

# Remove all (including volumes)
docker-compose down -v
```

### Nginx Commands

```bash
# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx

# Reload configuration
systemctl reload nginx

# Check status
systemctl status nginx

# View error log
tail -f /var/log/nginx/error.log
```

### SSL Commands

```bash
# Install certificate
certbot --nginx -d iwareid.com -d www.iwareid.com

# Renew certificate
certbot renew

# Test renewal
certbot renew --dry-run

# List certificates
certbot certificates

# Revoke certificate
certbot revoke --cert-path /etc/letsencrypt/live/iwareid.com/cert.pem
```

---

## ✅ Checklist Deployment

### Pre-Deployment
- [ ] VPS sudah aktif
- [ ] Domain sudah pointing ke VPS
- [ ] SSH bisa akses VPS
- [ ] Docker terinstall
- [ ] Docker Compose terinstall
- [ ] Nginx terinstall
- [ ] Certbot terinstall

### Deployment
- [ ] File aplikasi sudah di-upload
- [ ] Environment files sudah dikonfigurasi
- [ ] Docker containers running (mysql, backend, frontend)
- [ ] Database sudah diinisialisasi
- [ ] Nginx reverse proxy sudah dikonfigurasi
- [ ] SSL certificate sudah terinstall
- [ ] Firewall sudah dikonfigurasi

### Post-Deployment
- [ ] HTTPS working dengan gembok hijau
- [ ] Login berhasil
- [ ] Semua fitur berfungsi
- [ ] Password default sudah diganti
- [ ] Auto-renewal SSL sudah di-setup
- [ ] Backup database sudah di-setup

---

## 🎉 Selesai!

Aplikasi kamu sekarang live di: **https://iwareid.com**

**Default Credentials:**
- Admin: `admin` / `admin123`
- HRD: `hrd` / `hrd123`

**⚠️ PENTING: Segera ganti password default!**

---

## 📞 Support

Jika ada masalah, cek:
1. Container logs: `docker-compose logs`
2. Nginx logs: `tail -f /var/log/nginx/error.log`
3. System logs: `journalctl -xe`

Atau hubungi tim support.

---

**Happy Deploying! 🚀**
