# 🚀 Panduan Deployment: Frontend Vercel + Backend KVM 1

**Arsitektur:**
- Frontend: Vercel (GRATIS)
- Backend + MySQL: Hostinger KVM 1 (Rp 39.000/bulan)
- Domain: iwareid.com

**Keuntungan:**
- Hemat 43% biaya (Rp 39k vs Rp 69k/bulan)
- Frontend loading lebih cepat (CDN global)
- Backend lebih stabil (resource fokus untuk API + DB)

---

## 📋 Ringkasan Setup

### Frontend (Vercel)
- URL: https://iwareid.com atau https://www.iwareid.com
- Deploy: Auto dari Git push
- Build: Di server Vercel (tidak bebankan VPS)

### Backend (KVM 1)
- URL API: https://api.iwareid.com
- Stack: Node.js + MySQL + Docker + Nginx
- Resource: 1 CPU, 2GB RAM (cukup!)

---

## BAGIAN 1: Setup Backend di KVM 1

### 1.1 Beli & Setup VPS

1. Login ke **hpanel.hostinger.com**
2. Pilih **VPS** → **Order VPS**
3. Pilih paket **KVM 1** (Rp 39.000/bulan)
   - 1 CPU Core
   - 2 GB RAM
   - 20 GB Storage
4. Lokasi: **Singapore**
5. OS: **Ubuntu 22.04 LTS**
6. Catat IP Address VPS

### 1.2 Setup Domain DNS

Login ke hPanel → Domains → iwareid.com → DNS Zone

**Tambahkan 2 A Records:**

```
Type: A
Name: api
Points to: [IP VPS KVM 1]
TTL: 14400
```

```
Type: A
Name: @
Points to: 76.76.21.21  (Vercel IP, akan diupdate nanti)
TTL: 14400
```

```
Type: CNAME
Name: www
Points to: cname.vercel-dns.com.
TTL: 14400
```

### 1.3 Koneksi SSH & Update Sistem

```bash
ssh root@[IP-VPS-KVM1]

# Update sistem
apt update && apt upgrade -y

# Install tools
apt install -y curl wget git nano ufw
```

### 1.4 Setup Firewall

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

### 1.5 Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Verifikasi
docker --version
docker-compose --version
```

### 1.6 Install Nginx

```bash
apt install nginx -y
systemctl start nginx
systemctl enable nginx
```

### 1.7 Install Certbot (SSL)

```bash
apt install certbot python3-certbot-nginx -y
```

---

## BAGIAN 2: Upload & Konfigurasi Backend

### 2.1 Buat Folder Aplikasi

```bash
mkdir -p /var/www/backend
cd /var/www/backend
```

### 2.2 Upload File Backend

**Pakai FileZilla atau Git:**

Upload folder:
- `backend/` (semua isi)
- `docker-compose-backend.yml` (akan dibuat)

### 2.3 Buat docker-compose-backend.yml

```bash
nano /var/www/backend/docker-compose-backend.yml
```

**Isi file:**

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: iware-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: IwareSecure2026!@#
      MYSQL_DATABASE: iware_perizinan
      MYSQL_USER: iware
      MYSQL_PASSWORD: IwareDB2026!@#
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - backend-network
    command: --default-authentication-plugin=mysql_native_password

  backend:
    build: ./backend
    container_name: iware-backend
    restart: always
    environment:
      PORT: 5000
      NODE_ENV: production
      DB_HOST: mysql
      DB_USER: iware
      DB_PASSWORD: IwareDB2026!@#
      DB_NAME: iware_perizinan
      JWT_SECRET: d73d71a47452c7af78f6bd888005afee23adba5f936da33d67ce5baed764db62
      FRONTEND_URL: https://iwareid.com
      WHATSAPP_ENABLED: false
    ports:
      - "5000:5000"
    depends_on:
      - mysql
    volumes:
      - uploads_data:/app/uploads
    networks:
      - backend-network

volumes:
  mysql_data:
  uploads_data:

networks:
  backend-network:
    driver: bridge
```

Save (Ctrl+X, Y, Enter).

### 2.4 Konfigurasi Backend .env

```bash
nano /var/www/backend/backend/.env
```

**Isi:**

```env
NODE_ENV=production
PORT=5000

# Database
DB_HOST=mysql
DB_USER=iware
DB_PASSWORD=IwareDB2026!@#
DB_NAME=iware_perizinan
DB_PORT=3306

# JWT
JWT_SECRET=d73d71a47452c7af78f6bd888005afee23adba5f936da33d67ce5baed764db62

# CORS - Allow Vercel domain
CORS_ORIGIN=https://iwareid.com,https://www.iwareid.com

# Upload
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=10485760
```

### 2.5 Build & Run Backend

```bash
cd /var/www/backend

# Build dan jalankan
docker-compose -f docker-compose-backend.yml up -d --build

# Cek status
docker-compose -f docker-compose-backend.yml ps

# Cek logs
docker-compose -f docker-compose-backend.yml logs -f
```

Tunggu sampai MySQL ready (~1-2 menit).

### 2.6 Inisialisasi Database

```bash
# Masuk ke container backend
docker exec -it iware-backend sh

# Jalankan init database
node scripts/init-database.js

# Keluar
exit
```

---

## BAGIAN 3: Setup Nginx untuk Backend API

### 3.1 Buat Konfigurasi Nginx

```bash
nano /etc/nginx/sites-available/api-iwareid
```

**Isi:**

```nginx
server {
    listen 80;
    server_name api.iwareid.com;

    # Redirect HTTP to HTTPS (akan aktif setelah SSL)
    # return 301 https://$server_name$request_uri;

    # Sementara untuk testing & SSL setup
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        
        # Handle preflight
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }

    # Upload size limit
    client_max_body_size 10M;
}
```

Save (Ctrl+X, Y, Enter).

### 3.2 Aktifkan Konfigurasi

```bash
# Hapus default
rm -f /etc/nginx/sites-enabled/default

# Link konfigurasi
ln -sf /etc/nginx/sites-available/api-iwareid /etc/nginx/sites-enabled/

# Test config
nginx -t

# Restart Nginx
systemctl restart nginx
```

### 3.3 Test Backend API

```bash
# Test dari VPS
curl http://localhost:5000/api/health

# Test dari domain (tunggu DNS propagasi 5-30 menit)
curl http://api.iwareid.com/api/health
```

Harus return: `{"status":"ok"}`

---

## BAGIAN 4: Setup SSL untuk Backend

### 4.1 Verifikasi DNS

```bash
# Cek DNS sudah resolve
nslookup api.iwareid.com
ping -c 3 api.iwareid.com
```

Pastikan IP = IP VPS KVM 1.

### 4.2 Install SSL Certificate

```bash
certbot --nginx -d api.iwareid.com
```

**Ikuti instruksi:**
1. Email: masukkan email Anda
2. Terms: Y
3. Share email: N
4. Redirect: 2 (Yes, redirect HTTP to HTTPS)

### 4.3 Test HTTPS

```bash
curl https://api.iwareid.com/api/health
```

Atau buka browser: `https://api.iwareid.com/api/health`

### 4.4 Setup Auto-Renewal

```bash
# Test renewal
certbot renew --dry-run

# Setup cron
crontab -e
```

Tambahkan:

```
0 3 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

---

## BAGIAN 5: Deploy Frontend ke Vercel

### 5.1 Persiapan Repository

**Push code ke GitHub:**

```bash
# Di komputer lokal, folder project
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/iware-perizinan.git
git push -u origin main
```

### 5.2 Update Frontend .env

Edit `frontend/.env`:

```env
REACT_APP_API_URL=https://api.iwareid.com/api
```

Commit & push:

```bash
git add frontend/.env
git commit -m "Update API URL for production"
git push
```

### 5.3 Deploy ke Vercel

1. Buka **vercel.com**
2. Login dengan GitHub
3. Klik **Add New** → **Project**
4. Import repository: `iware-perizinan`
5. **Framework Preset:** Create React App
6. **Root Directory:** `frontend`
7. **Build Command:** `npm run build`
8. **Output Directory:** `build`
9. **Environment Variables:**
   - Key: `REACT_APP_API_URL`
   - Value: `https://api.iwareid.com/api`
10. Klik **Deploy**

Tunggu build selesai (~2-5 menit).

### 5.4 Setup Custom Domain di Vercel

1. Di Vercel dashboard, pilih project
2. Klik **Settings** → **Domains**
3. Tambahkan domain:
   - `iwareid.com`
   - `www.iwareid.com`
4. Vercel akan kasih instruksi DNS

### 5.5 Update DNS (Jika Belum)

Kembali ke hPanel → DNS Zone:

**Pastikan ada:**

```
Type: A
Name: @
Points to: 76.76.21.21
TTL: 14400
```

```
Type: CNAME  
Name: www
Points to: cname.vercel-dns.com.
TTL: 14400
```

Tunggu propagasi DNS (5-30 menit).

### 5.6 Verifikasi Domain di Vercel

Kembali ke Vercel → Domains → Klik **Verify**

Jika DNS sudah benar, domain akan terverifikasi dan SSL auto aktif.

---

## BAGIAN 6: Testing End-to-End

### 6.1 Test Backend API

```bash
# Health check
curl https://api.iwareid.com/api/health

# Login test
curl -X POST https://api.iwareid.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 6.2 Test Frontend

1. Buka browser: `https://iwareid.com`
2. Harus muncul halaman login
3. Login dengan:
   - Username: `admin`
   - Password: `admin123`
4. Test navigasi & fitur

### 6.3 Test CORS

Buka browser console (F12) di `https://iwareid.com`:

```javascript
fetch('https://api.iwareid.com/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

Harus return: `{status: "ok"}`

---

## BAGIAN 7: Monitoring & Maintenance

### 7.1 Monitor Backend (KVM 1)

```bash
# Cek container status
docker-compose -f docker-compose-backend.yml ps

# Cek resource usage
docker stats

# Cek logs
docker-compose -f docker-compose-backend.yml logs -f

# Cek disk space
df -h

# Cek memory
free -h
```

### 7.2 Backup Database

```bash
# Manual backup
docker exec iware-mysql mysqldump -u iware -pIwareDB2026!@# iware_perizinan > /var/www/backend/backup-$(date +%Y%m%d).sql

# Auto backup (cron)
crontab -e
```

Tambahkan:

```bash
0 2 * * * docker exec iware-mysql mysqldump -u iware -pIwareDB2026!@# iware_perizinan > /var/www/backend/backup-$(date +\%Y\%m\%d).sql
0 3 * * * find /var/www/backend/backup-*.sql -mtime +7 -delete
```

### 7.3 Update Aplikasi

**Update Backend:**

```bash
cd /var/www/backend
git pull  # atau upload file baru
docker-compose -f docker-compose-backend.yml down
docker-compose -f docker-compose-backend.yml up -d --build
```

**Update Frontend:**

```bash
# Di komputer lokal
git add .
git commit -m "Update frontend"
git push
```

Vercel akan auto-deploy dalam 1-2 menit.

---

## BAGIAN 8: Troubleshooting

### Problem: CORS Error

**Solusi 1 - Update Backend CORS:**

```bash
nano /var/www/backend/backend/.env
```

Pastikan:

```env
CORS_ORIGIN=https://iwareid.com,https://www.iwareid.com
```

Restart backend:

```bash
docker-compose -f docker-compose-backend.yml restart backend
```

**Solusi 2 - Update Nginx:**

Edit `/etc/nginx/sites-available/api-iwareid`, pastikan ada:

```nginx
add_header 'Access-Control-Allow-Origin' 'https://iwareid.com' always;
```

Restart Nginx:

```bash
systemctl restart nginx
```

### Problem: Backend Out of Memory

```bash
# Cek memory usage
free -h
docker stats

# Restart container
docker-compose -f docker-compose-backend.yml restart

# Jika masih crash, optimize MySQL
docker exec -it iware-mysql mysql -u root -pIwareSecure2026!@#
```

Di MySQL console:

```sql
SET GLOBAL innodb_buffer_pool_size = 256M;
SET GLOBAL max_connections = 50;
```

### Problem: Vercel Build Failed

Cek Vercel dashboard → Deployments → Klik deployment yang failed → Lihat logs.

**Common issues:**

1. **Environment variable tidak di-set**
   - Settings → Environment Variables → Tambahkan `REACT_APP_API_URL`

2. **Build command salah**
   - Settings → General → Build Command: `npm run build`

3. **Root directory salah**
   - Settings → General → Root Directory: `frontend`

---

## BAGIAN 9: Perbandingan Biaya

### Opsi 1: Full Stack di KVM 2 (Sebelumnya)

- VPS KVM 2: Rp 69.000/bulan
- Domain: Rp 150.000/tahun (~Rp 12.500/bulan)
- **Total: Rp 81.500/bulan**

### Opsi 2: Split Stack (KVM 1 + Vercel)

- VPS KVM 1: Rp 39.000/bulan
- Vercel: Rp 0 (free tier)
- Domain: Rp 150.000/tahun (~Rp 12.500/bulan)
- **Total: Rp 51.500/bulan**

**Hemat: Rp 30.000/bulan = Rp 360.000/tahun** 💰

---

## BAGIAN 10: Checklist Deployment

### Backend (KVM 1)
- [ ] VPS KVM 1 sudah aktif
- [ ] DNS `api.iwareid.com` pointing ke IP VPS
- [ ] Docker & Docker Compose terinstall
- [ ] Nginx terinstall
- [ ] Backend code sudah di-upload
- [ ] `docker-compose-backend.yml` sudah dibuat
- [ ] Backend `.env` sudah dikonfigurasi
- [ ] Container MySQL & Backend running
- [ ] Database sudah diinisialisasi
- [ ] Nginx config untuk API sudah dibuat
- [ ] SSL certificate sudah terinstall
- [ ] `https://api.iwareid.com/api/health` return OK

### Frontend (Vercel)
- [ ] Code sudah di-push ke GitHub
- [ ] Frontend `.env` sudah update API URL
- [ ] Project sudah di-import ke Vercel
- [ ] Environment variable di Vercel sudah di-set
- [ ] Build berhasil
- [ ] Custom domain sudah ditambahkan
- [ ] DNS sudah dikonfigurasi
- [ ] Domain sudah terverifikasi
- [ ] SSL sudah aktif (auto dari Vercel)
- [ ] `https://iwareid.com` bisa diakses

### Testing
- [ ] Backend API bisa diakses via HTTPS
- [ ] Frontend bisa diakses via HTTPS
- [ ] Login berhasil
- [ ] CORS tidak ada error
- [ ] Upload file berhasil
- [ ] Semua fitur berfungsi

---

## Command Reference

### Docker Commands (Backend)

```bash
# Status
docker-compose -f docker-compose-backend.yml ps

# Logs
docker-compose -f docker-compose-backend.yml logs -f

# Restart
docker-compose -f docker-compose-backend.yml restart

# Stop
docker-compose -f docker-compose-backend.yml stop

# Start
docker-compose -f docker-compose-backend.yml start

# Rebuild
docker-compose -f docker-compose-backend.yml down
docker-compose -f docker-compose-backend.yml up -d --build

# Masuk ke container
docker exec -it iware-backend sh
docker exec -it iware-mysql bash
```

### Vercel Commands (Frontend)

```bash
# Install Vercel CLI (opsional)
npm i -g vercel

# Deploy manual dari CLI
cd frontend
vercel --prod

# Pull environment variables
vercel env pull
```

---

## Kesimpulan

Arsitektur ini memberikan:

✅ **Performa Lebih Baik**
- Frontend di CDN global (loading cepat)
- Backend fokus untuk API (tidak overload)

✅ **Biaya Lebih Murah**
- Hemat Rp 360.000/tahun

✅ **Maintenance Lebih Mudah**
- Frontend auto-deploy dari Git
- Backend hanya fokus API + DB

✅ **Scalability**
- Frontend auto-scale di Vercel
- Backend bisa upgrade ke KVM 2 jika perlu

---

**Selamat Deploy! 🚀**

Jika ada pertanyaan atau masalah, silakan hubungi tim support.
