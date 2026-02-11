# 🚀 Panduan Deploy Full Stack di VPS Hostinger

Deploy Frontend + Backend + MySQL di satu VPS untuk iwareid.com

---

## 📋 Checklist Persiapan

- [ ] VPS Hostinger sudah aktif
- [ ] Domain iwareid.com sudah ada
- [ ] SSH access ke VPS
- [ ] Docker & Docker Compose terinstall di VPS
- [ ] Nginx terinstall di VPS

---

## Step 1: Setting DNS Domain

1. Login ke **hpanel.hostinger.com**
2. Pilih **Domains** → **iwareid.com**
3. Klik **DNS / Name Servers**
4. Hapus semua A record yang pointing ke Vercel
5. Tambah A record baru:

```
Type: A
Name: @
Points to: [IP-VPS-kamu]
TTL: 14400
```

6. Tambah A record untuk www:

```
Type: A
Name: www
Points to: [IP-VPS-kamu]
TTL: 14400
```

7. Save dan tunggu propagasi (5-30 menit)

---

## Step 2: Upload File ke VPS

### Opsi A: Pakai FileZilla (Recommended)

1. Buka FileZilla
2. Connect ke VPS:
   - Host: [IP-VPS]
   - Username: root
   - Password: [password-vps]
   - Port: 22
3. Upload semua file project ke `/var/www/backend`
4. Pastikan file ini ada:
   - `docker-compose-fullstack.yml`
   - `nginx-iwareid-fullstack.conf`
   - `deploy-fullstack-vps.sh`
   - `backend/` folder
   - `frontend/` folder

### Opsi B: Pakai Git

```bash
# SSH ke VPS
ssh root@[IP-VPS]

# Masuk ke folder
cd /var/www/backend

# Pull latest code
git pull

# Atau clone jika belum ada
# git clone https://github.com/username/repo.git .
```

---

## Step 3: Setup Environment di VPS

```bash
# SSH ke VPS
ssh root@[IP-VPS]

# Masuk ke folder project
cd /var/www/backend

# Set permissions
chmod +x deploy-fullstack-vps.sh

# Copy environment files
cp backend/.env.production backend/.env
cp frontend/.env.production frontend/.env

# Verifikasi isi .env
cat backend/.env
cat frontend/.env
```

---

## Step 4: Deploy dengan Docker

```bash
# Masih di folder /var/www/backend

# Stop container lama jika ada
docker-compose -f docker-compose-backend.yml down

# Hapus volume MySQL lama (jika ada masalah password)
docker volume rm backend_mysql_data

# Build dan start semua container
docker-compose -f docker-compose-fullstack.yml up -d --build

# Tunggu 30-60 detik untuk MySQL ready
sleep 30

# Cek status container
docker-compose -f docker-compose-fullstack.yml ps

# Semua harus status "Up"
```

---

## Step 5: Inisialisasi Database

```bash
# Init database dengan root user
docker exec iware-backend sh -c "DB_USER=root node scripts/init-database.js"

# Output yang diharapkan:
# ✅ Connected to MySQL
# ✅ Database 'iware_perizinan' ready
# ✅ Table users created
# ✅ Table pengajuan created
# ✅ Admin user created
# ✅ HRD user created
```

---

## Step 6: Setup Nginx

```bash
# Copy config Nginx
cp nginx-iwareid-fullstack.conf /etc/nginx/sites-available/iwareid

# Hapus default config
rm /etc/nginx/sites-enabled/default

# Enable site
ln -s /etc/nginx/sites-available/iwareid /etc/nginx/sites-enabled/

# Test config
nginx -t

# Harus output: syntax is ok

# Restart Nginx
systemctl restart nginx

# Cek status
systemctl status nginx
```

---

## Step 7: Test Akses HTTP (Sebelum SSL)

Buka browser, akses: `http://iwareid.com`

Kamu harus bisa lihat aplikasi frontend!

Test juga:
- `http://www.iwareid.com` - harus redirect ke non-www
- `http://iwareid.com/api/health` - harus return status OK

---

## Step 8: Install SSL Certificate

```bash
# Install SSL dengan Certbot
certbot --nginx -d iwareid.com -d www.iwareid.com

# Ikuti instruksi:
# 1. Masukkan email
# 2. Agree to terms: Y
# 3. Share email: N
# 4. Redirect HTTP to HTTPS: pilih 2 (Redirect)

# Tunggu proses selesai
```

---

## Step 9: Verifikasi SSL

Buka browser: `https://iwareid.com`

Harus ada gembok hijau (secure connection).

Test semua fitur:
- [ ] Login admin
- [ ] Dashboard HRD
- [ ] Upload file
- [ ] Create pengajuan
- [ ] Approve/reject

---

## Step 10: Setup Auto-Renewal SSL

```bash
# Test auto-renewal
certbot renew --dry-run

# Setup cron job
crontab -e

# Pilih editor: 1 (nano)

# Tambahkan baris ini di paling bawah:
0 3 * * * certbot renew --quiet --post-hook "systemctl reload nginx"

# Save: Ctrl+X, Y, Enter
```

---

## 🔧 Troubleshooting

### Container tidak start

```bash
# Cek logs
docker-compose -f docker-compose-fullstack.yml logs

# Restart container
docker-compose -f docker-compose-fullstack.yml restart

# Rebuild jika perlu
docker-compose -f docker-compose-fullstack.yml down
docker-compose -f docker-compose-fullstack.yml up -d --build
```

### Database connection error

```bash
# Cek MySQL logs
docker logs iware-mysql

# Cek backend logs
docker logs iware-backend

# Reset MySQL volume
docker-compose -f docker-compose-fullstack.yml down
docker volume rm backend_mysql_data
docker-compose -f docker-compose-fullstack.yml up -d
```

### Frontend tidak bisa hit backend

```bash
# Cek frontend .env
docker exec iware-frontend cat /usr/share/nginx/html/.env

# Rebuild frontend
docker-compose -f docker-compose-fullstack.yml up -d --build frontend
```

### Nginx error

```bash
# Test config
nginx -t

# Cek error log
tail -f /var/log/nginx/error.log

# Restart Nginx
systemctl restart nginx
```

---

## 📊 Monitoring

```bash
# Cek resource usage
docker stats

# Cek disk space
df -h

# Cek logs real-time
docker-compose -f docker-compose-fullstack.yml logs -f

# Cek specific container
docker logs -f iware-backend
docker logs -f iware-frontend
docker logs -f iware-mysql
```

---

## 🔄 Update Aplikasi

```bash
# Pull latest code
cd /var/www/backend
git pull

# Rebuild dan restart
docker-compose -f docker-compose-fullstack.yml down
docker-compose -f docker-compose-fullstack.yml up -d --build

# Cek logs
docker-compose -f docker-compose-fullstack.yml logs -f
```

---

## 💾 Backup Database

```bash
# Manual backup
docker exec iware-mysql mysqldump -u root -pJasadenam66/ iware_perizinan > backup-$(date +%Y%m%d).sql

# Auto backup (cron job)
crontab -e

# Tambahkan:
0 2 * * * docker exec iware-mysql mysqldump -u root -pJasadenam66/ iware_perizinan > /var/www/backend/backup-$(date +\%Y\%m\%d).sql
```

---

## ✅ Checklist Final

- [ ] DNS pointing ke VPS
- [ ] Docker containers running (mysql, backend, frontend)
- [ ] Database initialized
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] HTTPS working
- [ ] Login berhasil
- [ ] Upload file berhasil
- [ ] Auto-renewal SSL setup
- [ ] Backup database setup

---

## 🎉 Selesai!

Aplikasi kamu sekarang live di: **https://iwareid.com**

Default credentials:
- Admin: `admin` / `admin123`
- HRD: `hrd` / `hrd123`

**⚠️ PENTING: Ganti password default setelah login pertama!**
