# 🚀 PANDUAN DEPLOYMENT LENGKAP - DARI AWAL SAMPAI BERHASIL

Panduan ini akan memandu kamu step-by-step untuk deploy aplikasi ke VPS Hostinger dari NOL sampai aplikasi bisa diakses via HTTPS.

---

## 📋 PERSIAPAN AWAL

### Yang Kamu Butuhkan:
1. ✅ VPS Hostinger sudah aktif (minimal KVM 2: 2 CPU, 4GB RAM)
2. ✅ Domain sudah terdaftar (contoh: iwareid.com)
3. ✅ Akses SSH ke VPS (IP, username, password)
4. ✅ Project sudah ada di komputer lokal
5. ✅ FileZilla atau Git untuk upload file

---

## 🎯 BAGIAN 1: SETUP VPS HOSTINGER

### LANGKAH 1: Login ke Hostinger Panel

1. Buka browser, ketik: **https://hpanel.hostinger.com**
2. Login dengan email dan password Hostinger kamu
3. Klik menu **VPS** di sidebar kiri
4. Pilih VPS yang akan digunakan

### LANGKAH 2: Catat Informasi VPS

Catat informasi ini (akan dipakai terus):

```
IP Address VPS: _____________ (contoh: 103.123.45.67)
SSH Username: root
SSH Password: _____________ (dari email Hostinger)
SSH Port: 22
```

### LANGKAH 3: Test Koneksi SSH

**Windows (PowerShell atau CMD):**
```cmd
ssh root@103.123.45.67
```

**Atau pakai PuTTY:**
- Download PuTTY dari: https://www.putty.org/
- Host Name: 103.123.45.67
- Port: 22
- Connection Type: SSH
- Klik Open
- Login: root
- Password: [password-kamu]

**Jika berhasil, akan muncul:**
```
root@srv1334u465:~#
```

✅ **Selamat! Kamu sudah masuk ke VPS.**

---

## 🎯 BAGIAN 2: SETUP DOMAIN DNS

### LANGKAH 4: Pointing Domain ke VPS

1. Di Hostinger Panel, klik menu **Domains**
2. Klik domain kamu (contoh: iwareid.com)
3. Klik tab **DNS / Name Servers**
4. Klik **Manage** atau **DNS Records**

### LANGKAH 5: Hapus A Record Lama

Hapus semua A record yang ada (biasanya pointing ke shared hosting).

### LANGKAH 6: Tambah A Record Baru

**Record 1 (Root domain):**
```
Type: A
Name: @ (atau kosongkan)
Points to: 103.123.45.67 (IP VPS kamu)
TTL: 14400 (atau biarkan default)
```
Klik **Add Record**

**Record 2 (WWW subdomain):**
```
Type: A
Name: www
Points to: 103.123.45.67 (IP VPS kamu)
TTL: 14400
```
Klik **Add Record**

### LANGKAH 7: Save dan Tunggu Propagasi

- Klik **Save Changes**
- Tunggu 5-30 menit untuk DNS propagasi

**Test DNS:**
```cmd
ping iwareid.com
```

Harus reply dari IP VPS kamu.

✅ **DNS sudah pointing ke VPS!**

---

## 🎯 BAGIAN 3: INSTALL SOFTWARE DI VPS

### LANGKAH 8: Login SSH ke VPS

```bash
ssh root@103.123.45.67
# Masukkan password
```

### LANGKAH 9: Update Sistem

```bash
# Update package list
apt update

# Upgrade semua package (tunggu 2-5 menit)
apt upgrade -y

# Install tools dasar
apt install -y curl wget git nano ufw software-properties-common
```

**Jika ada error repository monarx:**
```bash
rm /etc/apt/sources.list.d/monarx*
apt update
```

### LANGKAH 10: Install Docker

```bash
# Download script instalasi
curl -fsSL https://get.docker.com -o get-docker.sh

# Jalankan instalasi (tunggu 2-3 menit)
sh get-docker.sh

# Hapus script
rm get-docker.sh

# Cek versi
docker --version
```

**Output yang diharapkan:**
```
Docker version 25.x.x, build xxxxx
```

### LANGKAH 11: Install Docker Compose

```bash
# Download Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Beri permission
chmod +x /usr/local/bin/docker-compose

# Cek versi
docker-compose --version
```

**Output yang diharapkan:**
```
Docker Compose version v2.24.0
```

**Jika ada error konflik:**
```bash
apt remove docker-compose docker-compose-v2 docker-compose-plugin -y
# Lalu ulangi perintah curl di atas
```

### LANGKAH 12: Install Nginx

```bash
# Install Nginx
apt install nginx -y

# Start Nginx
systemctl start nginx
systemctl enable nginx

# Cek status
systemctl status nginx
```

Tekan **q** untuk keluar.

**Output yang diharapkan:**
```
● nginx.service - A high performance web server
   Active: active (running)
```

### LANGKAH 13: Install Certbot (untuk SSL)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Cek versi
certbot --version
```

### LANGKAH 14: Setup Firewall

```bash
# Allow SSH (PENTING!)
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS
ufw allow 443/tcp

# Enable firewall
ufw enable
```

Ketik **y** lalu Enter.

```bash
# Cek status
ufw status
```

**Output yang diharapkan:**
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

✅ **Software sudah terinstall semua!**

---

## 🎯 BAGIAN 4: UPLOAD PROJECT KE VPS

### LANGKAH 15: Buat Folder di VPS

```bash
# Buat folder untuk aplikasi
mkdir -p /var/www/iwareid

# Masuk ke folder
cd /var/www/iwareid

# Cek lokasi
pwd
```

**Output:** `/var/www/iwareid`

### LANGKAH 16: Upload File

**PILIH SALAH SATU METODE:**

---

#### METODE A: Upload via FileZilla (Mudah untuk Pemula)

**1. Install FileZilla**
- Download dari: https://filezilla-project.org/
- Install di komputer lokal

**2. Koneksi ke VPS**
- Buka FileZilla
- Klik **File** → **Site Manager**
- Klik **New Site**, beri nama "VPS iwareid"
- Isi:
  - Protocol: **SFTP - SSH File Transfer Protocol**
  - Host: **103.123.45.67** (IP VPS kamu)
  - Port: **22**
  - Logon Type: **Normal**
  - User: **root**
  - Password: **[password VPS kamu]**
- Klik **Connect**
- Jika muncul warning, klik **OK**

**3. Upload File**
- Panel kiri = komputer lokal
- Panel kanan = VPS
- Di panel kanan, navigasi ke: `/var/www/iwareid`
- Di panel kiri, buka folder project kamu
- Select semua file dan folder:
  - backend/
  - frontend/
  - docker-compose.yml
  - nginx-vps.conf
  - deploy-vps.sh
  - .env.example
  - .dockerignore
  - docker-healthcheck.sh
  - docker-logs.sh
  - docker-restart.sh
  - setup-permissions.sh
  - Semua file .md
- Drag & drop ke panel kanan
- Tunggu upload selesai (5-20 menit)

**4. Verifikasi Upload**

Kembali ke SSH terminal:
```bash
cd /var/www/iwareid
ls -la
```

Harus muncul semua file yang di-upload.

---

#### METODE B: Clone dari Git (Jika Project di GitHub)

```bash
# Masuk ke folder
cd /var/www

# Clone repository (ganti dengan URL repo kamu)
git clone https://github.com/username/repo-name.git iwareid

# Masuk ke folder project
cd iwareid

# Cek file
ls -la
```

---

✅ **File sudah di-upload ke VPS!**

---

## 🎯 BAGIAN 5: KONFIGURASI ENVIRONMENT

### LANGKAH 17: Setup Permissions

```bash
cd /var/www/iwareid

# Beri permission execute
chmod +x setup-permissions.sh

# Jalankan script
./setup-permissions.sh
```

**Output:**
```
🔧 Setting up permissions...
✅ Permissions set successfully!
```

### LANGKAH 18: Setup Environment Variables

```bash
# Copy file example
cp .env.example .env

# Edit file .env
nano .env
```

**Edit isi file:**
```env
# MySQL Configuration
MYSQL_ROOT_PASSWORD=GantiDenganPasswordKuat123!
MYSQL_DATABASE=iware_perizinan
MYSQL_USER=iware
MYSQL_PASSWORD=GantiDenganPasswordKuat123!

# Backend Configuration
BACKEND_PORT=5000
NODE_ENV=production
JWT_SECRET=ganti-dengan-random-string-panjang-minimal-32-karakter

# Frontend Configuration
REACT_APP_API_URL=https://iwareid.com/api
FRONTEND_URL=https://iwareid.com,https://www.iwareid.com

# Optional
WHATSAPP_ENABLED=false
```

**Cara generate JWT_SECRET:**
```bash
# Di terminal VPS, jalankan:
openssl rand -hex 32
```

Copy hasilnya ke JWT_SECRET.

**Simpan file:**
- Tekan `Ctrl + X`
- Tekan `Y`
- Tekan `Enter`

### LANGKAH 19: Setup Backend Environment

```bash
cd /var/www/iwareid/backend

# Copy file production
cp .env.production .env

# Edit jika perlu
nano .env
```

Pastikan isinya sesuai dengan .env di root folder.

**Simpan:** `Ctrl + X`, `Y`, `Enter`

### LANGKAH 20: Setup Frontend Environment

```bash
cd /var/www/iwareid/frontend

# Copy file production
cp .env.production .env

# Edit
nano .env
```

Pastikan:
```env
REACT_APP_API_URL=https://iwareid.com/api
```

**Simpan:** `Ctrl + X`, `Y`, `Enter`

✅ **Environment sudah dikonfigurasi!**

---

## 🎯 BAGIAN 6: DEPLOY APLIKASI

### LANGKAH 21: Jalankan Deploy Script

```bash
# Kembali ke root folder
cd /var/www/iwareid

# Jalankan deploy script
sudo ./deploy-vps.sh
```

**Script akan otomatis:**
1. ✅ Check Docker installation
2. ✅ Setup permissions
3. ✅ Stop container lama
4. ✅ Build container baru
5. ✅ Start semua services
6. ✅ Wait for MySQL ready
7. ✅ Initialize database
8. ✅ Run health checks

**Tunggu 5-10 menit sampai selesai.**

**Output yang diharapkan:**
```
🎉 Deployment Summary

✅ Deployment completed successfully!

📊 Container Status:
NAME              STATUS          PORTS
iware-mysql       Up 2 minutes    0.0.0.0:3306->3306/tcp
iware-backend     Up 2 minutes    0.0.0.0:5000->5000/tcp
iware-frontend    Up 2 minutes    0.0.0.0:3000->80/tcp

🏥 Health Checks:
MySQL: ✅ Healthy
Backend: ✅ Healthy (HTTP 200)
Frontend: ✅ Healthy (HTTP 200)
```

### LANGKAH 22: Verifikasi Container

```bash
# Cek status
docker-compose ps

# Cek logs
docker-compose logs --tail=50

# Test backend
curl http://localhost:5000/api/health

# Test frontend
curl http://localhost:3000
```

**Jika ada container yang error:**
```bash
# Lihat logs
docker logs iware-backend
docker logs iware-frontend
docker logs iware-mysql

# Restart
docker-compose restart
```

✅ **Aplikasi sudah running di VPS!**

---

## 🎯 BAGIAN 7: SETUP NGINX REVERSE PROXY

### LANGKAH 23: Copy Nginx Config

```bash
# Copy config file
cp /var/www/iwareid/nginx-vps.conf /etc/nginx/sites-available/iwareid

# Hapus config default
rm -f /etc/nginx/sites-enabled/default

# Buat symbolic link
ln -s /etc/nginx/sites-available/iwareid /etc/nginx/sites-enabled/

# Test konfigurasi
nginx -t
```

**Output yang diharapkan:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**Jika ada error:**
```bash
# Lihat error detail
nginx -t

# Edit config
nano /etc/nginx/sites-available/iwareid

# Cek lagi
nginx -t
```

### LANGKAH 24: Restart Nginx

```bash
# Restart Nginx
systemctl restart nginx

# Cek status
systemctl status nginx
```

Tekan **q** untuk keluar.

**Output yang diharapkan:**
```
● nginx.service - A high performance web server
   Active: active (running)
```

### LANGKAH 25: Test HTTP Access

**Dari VPS:**
```bash
# Test frontend
curl http://localhost:3000

# Test backend
curl http://localhost:5000/api/health

# Test via domain
curl http://iwareid.com
curl http://iwareid.com/api/health
```

**Dari Browser (komputer lokal):**

1. Buka: `http://iwareid.com`
   - Harus muncul halaman aplikasi

2. Buka: `http://iwareid.com/api/health`
   - Harus muncul: `{"status":"ok"}`

✅ **Nginx sudah berfungsi!**

---

## 🎯 BAGIAN 8: INSTALL SSL CERTIFICATE (HTTPS)

### LANGKAH 26: Stop Nginx Sementara

```bash
systemctl stop nginx
```

### LANGKAH 27: Install Certificate

```bash
# Jalankan Certbot
certbot certonly --standalone -d iwareid.com -d www.iwareid.com
```

### LANGKAH 28: Ikuti Instruksi Certbot

**Pertanyaan 1: Email address**
```
Enter email address: your@email.com
```
Ketik email kamu, tekan Enter.

**Pertanyaan 2: Terms of Service**
```
(A)gree/(C)ancel: A
```
Ketik `A`, tekan Enter.

**Pertanyaan 3: Share email**
```
(Y)es/(N)o: N
```
Ketik `N`, tekan Enter.

**Tunggu proses...**

**Output yang diharapkan:**
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/iwareid.com/fullchain.pem
Key is saved at: /etc/letsencrypt/live/iwareid.com/privkey.pem
```

### LANGKAH 29: Update Nginx Config untuk HTTPS

```bash
# Edit config
nano /etc/nginx/sites-available/iwareid
```

**Pastikan ada bagian ini (sudah ada di file):**
```nginx
# HTTPS Server
server {
    listen 443 ssl http2;
    server_name iwareid.com;

    ssl_certificate /etc/letsencrypt/live/iwareid.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/iwareid.com/privkey.pem;
    
    # ... rest of config
}
```

File sudah benar, tinggal save: `Ctrl + X`, `Y`, `Enter`

### LANGKAH 30: Test dan Start Nginx

```bash
# Test config
nginx -t

# Start Nginx
systemctl start nginx

# Cek status
systemctl status nginx
```

### LANGKAH 31: Test HTTPS

**Dari Browser:**

1. Buka: `https://iwareid.com`
   - Harus ada **gembok hijau** 🔒
   - Aplikasi harus muncul

2. Test redirect:
   - `http://iwareid.com` → auto redirect ke `https://iwareid.com`
   - `http://www.iwareid.com` → auto redirect ke `https://iwareid.com`
   - `https://www.iwareid.com` → auto redirect ke `https://iwareid.com`

✅ **SSL berhasil terinstall! Aplikasi sudah HTTPS!**

---

## 🎯 BAGIAN 9: SETUP AUTO-RENEWAL SSL

### LANGKAH 32: Test Auto-Renewal

```bash
# Test renewal (dry run)
certbot renew --dry-run
```

**Output yang diharapkan:**
```
Congratulations, all simulated renewals succeeded
```

### LANGKAH 33: Setup Cron Job

```bash
# Edit crontab
crontab -e
```

**Jika pertama kali, pilih editor:**
```
Select an editor: 1
```
Ketik `1`, tekan Enter (untuk nano).

**Tambahkan baris ini di paling bawah:**
```
0 3 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

**Simpan:** `Ctrl + X`, `Y`, `Enter`

**Verifikasi:**
```bash
crontab -l
```

Harus muncul baris yang tadi ditambahkan.

✅ **SSL akan auto-renew setiap hari jam 3 pagi!**

---

## 🎯 BAGIAN 10: TEST APLIKASI

### LANGKAH 34: Test Login

1. Buka browser: `https://iwareid.com`
2. Klik **Login** atau **Login Staff**
3. Login dengan kredensial default:

**Admin:**
```
Username: admin
Password: admin123
```

**HRD:**
```
Username: hrd
Password: hrd123
```

### LANGKAH 35: Test Fitur Aplikasi

Checklist testing:

- [ ] Login berhasil
- [ ] Dashboard muncul
- [ ] Menu navigasi berfungsi
- [ ] Buat pengajuan baru
- [ ] Upload file/foto
- [ ] Edit data
- [ ] Delete data
- [ ] Approve/reject pengajuan
- [ ] Logout

### LANGKAH 36: Ganti Password Default

⚠️ **PENTING: Ganti password default sekarang!**

1. Login sebagai admin
2. Masuk ke menu Profile/Settings
3. Ganti password admin dan hrd

✅ **Aplikasi sudah berfungsi dengan baik!**

---

## 🎉 SELESAI! APLIKASI SUDAH LIVE!

### 🌐 Aplikasi Kamu Sekarang Bisa Diakses di:

**https://iwareid.com**

### 🔐 Default Credentials:
- Admin: `admin` / `admin123`
- HRD: `hrd` / `hrd123`

### ⚠️ PENTING:
- ✅ Ganti password default
- ✅ Backup database secara berkala
- ✅ Monitor resource usage
- ✅ Update sistem secara berkala

---

## 📊 MAINTENANCE & MONITORING

### Cek Status Aplikasi

```bash
# Cek container
docker-compose ps

# Cek resource
docker stats

# Cek health
./docker-healthcheck.sh
```

### View Logs

```bash
# Interactive log viewer
./docker-logs.sh

# Atau manual
docker-compose logs -f
docker logs iware-backend -f
docker logs iware-frontend -f
docker logs iware-mysql -f
```

### Restart Aplikasi

```bash
# Interactive restart
./docker-restart.sh

# Atau manual
docker-compose restart
docker-compose restart backend
docker-compose restart frontend
```

### Update Aplikasi

```bash
cd /var/www/iwareid

# Backup dulu
cp backend/.env backend/.env.backup

# Pull update (jika pakai Git)
git pull origin main

# Restore env
cp backend/.env.backup backend/.env

# Rebuild
docker-compose down
docker-compose up -d --build
```

### Backup Database

```bash
# Backup
docker exec iware-mysql mysqldump -u root -p[PASSWORD] iware_perizinan > backup-$(date +%Y%m%d).sql

# Restore
docker exec -i iware-mysql mysql -u root -p[PASSWORD] iware_perizinan < backup-20260212.sql
```

---

## 🔧 TROUBLESHOOTING

### Container Tidak Start

```bash
# Cek logs
docker-compose logs

# Restart
docker-compose restart

# Rebuild
docker-compose down
docker-compose up -d --build
```

### Database Error

```bash
# Cek MySQL
docker logs iware-mysql

# Test connection
docker exec iware-mysql mysql -u root -p[PASSWORD] -e "SHOW DATABASES;"
```

### Nginx Error

```bash
# Test config
nginx -t

# Cek logs
tail -f /var/log/nginx/error.log

# Restart
systemctl restart nginx
```

### SSL Error

```bash
# Renew certificate
certbot renew --force-renewal

# Restart Nginx
systemctl restart nginx
```

---

## 📞 BUTUH BANTUAN?

### Useful Commands:

```bash
./docker-healthcheck.sh    # Check health
./docker-logs.sh           # View logs
./docker-restart.sh        # Restart services
docker-compose ps          # Status
docker stats               # Resources
```

### Dokumentasi:

- `DEPLOYMENT-GUIDE-VPS-HOSTINGER.md` - Panduan detail
- `DEPLOYMENT-README.md` - Quick reference
- `QUICK-REFERENCE.md` - Command cheatsheet

---

## ✅ CHECKLIST DEPLOYMENT

### Pre-deployment:
- [x] VPS aktif
- [x] Domain pointing ke VPS
- [x] Docker installed
- [x] Docker Compose installed
- [x] Nginx installed
- [x] Certbot installed
- [x] Firewall configured

### Deployment:
- [x] Files uploaded
- [x] Permissions set
- [x] .env configured
- [x] Deploy script executed
- [x] Containers running
- [x] Database initialized

### Post-deployment:
- [x] Nginx configured
- [x] SSL installed
- [x] HTTPS working
- [x] Application accessible
- [x] Login working
- [x] Features tested
- [x] Passwords changed

---

## 🎊 CONGRATULATIONS!

**Aplikasi kamu sudah live dan bisa diakses via HTTPS!**

**https://iwareid.com** 🚀

---

**Happy Deploying! 🎉**

Dibuat dengan ❤️ untuk deployment yang mudah dan sukses!
