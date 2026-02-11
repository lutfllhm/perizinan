# 🚀 Panduan Deployment untuk KVM 1 (2GB RAM)

Panduan khusus deployment di VPS dengan resource terbatas (1 CPU, 2GB RAM).

---

## ⚠️ Perhatian Penting

KVM 1 memiliki resource sangat terbatas:
- **CPU**: 1 core
- **RAM**: 2GB
- **Disk**: 20GB

Aplikasi akan berjalan, tapi dengan optimasi ketat. Berikut tips agar berhasil:

---

## 📊 Alokasi Resource

```
Total RAM: 2GB (2048MB)
├── System & OS: ~400MB
├── MySQL: 512MB (max)
├── Backend: 384MB (max)
├── Frontend: 192MB (max)
├── Nginx: ~50MB
└── Buffer: ~510MB
```

---

## 🎯 Step-by-Step Deployment

### STEP 1: Setup VPS dengan Optimasi

#### 1.1 Login ke VPS

```bash
ssh root@[IP-VPS]
```

#### 1.2 Update Sistem (Minimal)

```bash
# Update package list
apt update

# Upgrade hanya security updates
apt upgrade -y --with-new-pkgs

# Install minimal tools
apt install -y curl wget nano ufw
```

#### 1.3 Setup Swap (PENTING untuk KVM 1!)

Swap akan membantu ketika RAM penuh:

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

# Verify
free -h

# Should show 2GB swap
```

#### 1.4 Optimasi Swappiness

```bash
# Set swappiness to 10 (lebih agresif gunakan RAM)
sysctl vm.swappiness=10

# Make permanent
echo 'vm.swappiness=10' >> /etc/sysctl.conf
```

#### 1.5 Install Docker (Lightweight)

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Verify
docker --version
```

#### 1.6 Install Docker Compose

```bash
# Install Docker Compose
apt install docker-compose -y

# Verify
docker-compose --version
```

#### 1.7 Install Nginx (Lightweight)

```bash
# Install Nginx
apt install nginx -y

# Start & enable
systemctl start nginx
systemctl enable nginx
```

#### 1.8 Install Certbot

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y
```

---

### STEP 2: Optimasi Sistem

#### 2.1 Disable Unnecessary Services

```bash
# Disable snapd (jika ada)
systemctl disable snapd
systemctl stop snapd

# Disable unattended-upgrades
systemctl disable unattended-upgrades
systemctl stop unattended-upgrades
```

#### 2.2 Setup Log Rotation

```bash
# Limit log size
cat > /etc/logrotate.d/docker-containers << EOF
/var/lib/docker/containers/*/*.log {
    rotate 3
    daily
    compress
    size=10M
    missingok
    delaycompress
    copytruncate
}
EOF
```

---

### STEP 3: Setup DNS

Sama seperti panduan normal:

1. Login ke hpanel.hostinger.com
2. Domains → iwareid.com → DNS
3. Tambah A records:
   - `@` → `[IP-VPS]`
   - `www` → `[IP-VPS]`

---

### STEP 4: Upload File

#### 4.1 Buat Folder

```bash
mkdir -p /var/www/backend
cd /var/www/backend
```

#### 4.2 Upload dengan FileZilla

Upload file ke `/var/www/backend`:
- backend/
- frontend/
- **docker-compose-kvm1.yml** (bukan docker-compose.yml biasa!)
- nginx-vps.conf
- deploy-vps.sh

---

### STEP 5: Deploy dengan Optimasi

#### 5.1 Rename Docker Compose File

```bash
cd /var/www/backend

# Rename file untuk KVM 1
mv docker-compose-kvm1.yml docker-compose.yml
```

#### 5.2 Edit Deploy Script (Opsional)

Jika mau pakai deploy script, edit dulu:

```bash
nano deploy-vps.sh

# Ubah COMPOSE_FILE menjadi:
COMPOSE_FILE="docker-compose.yml"
```

#### 5.3 Deploy Manual (Recommended untuk KVM 1)

```bash
# Set permissions
chmod -R 755 .
mkdir -p backend/uploads
chmod -R 777 backend/uploads

# Copy environment files
cp backend/.env.production backend/.env
cp frontend/.env.production frontend/.env

# Build containers ONE BY ONE (hemat RAM)
echo "Building MySQL..."
docker-compose up -d mysql

# Tunggu MySQL ready (60 detik)
sleep 60

echo "Building Backend..."
docker-compose up -d backend

# Tunggu backend ready (30 detik)
sleep 30

echo "Building Frontend..."
docker-compose up -d frontend

# Tunggu frontend ready (30 detik)
sleep 30
```

#### 5.4 Cek Status

```bash
# Check containers
docker-compose ps

# Check memory usage
docker stats --no-stream

# Check system memory
free -h
```

#### 5.5 Initialize Database

```bash
# Wait for MySQL to be fully ready
sleep 30

# Init database
docker exec iware-backend sh -c "DB_USER=root node scripts/init-database.js"
```

---

### STEP 6: Setup Nginx

```bash
# Copy config
cp nginx-vps.conf /etc/nginx/sites-available/iwareid

# Remove default
rm /etc/nginx/sites-enabled/default

# Enable site
ln -s /etc/nginx/sites-available/iwareid /etc/nginx/sites-enabled/

# Test
nginx -t

# Restart
systemctl restart nginx
```

---

### STEP 7: Test HTTP

Buka browser: `http://iwareid.com`

Harus muncul aplikasi.

---

### STEP 8: Install SSL

```bash
# Install certificate
certbot --nginx -d iwareid.com -d www.iwareid.com

# Ikuti instruksi
```

---

### STEP 9: Setup Firewall

```bash
# Allow ports
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Enable
ufw enable

# Check
ufw status
```

---

## 🔧 Monitoring & Maintenance untuk KVM 1

### Cek Resource Usage

```bash
# Memory usage
free -h

# Docker stats
docker stats --no-stream

# Disk usage
df -h

# Top processes
top
```

### Jika RAM Penuh

```bash
# Restart containers satu per satu
docker-compose restart mysql
sleep 10
docker-compose restart backend
sleep 10
docker-compose restart frontend

# Atau restart semua
docker-compose restart
```

### Clean Up Docker

```bash
# Remove unused images
docker image prune -a -f

# Remove unused volumes
docker volume prune -f

# Remove unused containers
docker container prune -f

# Clean all
docker system prune -a -f
```

---

## ⚡ Tips Optimasi untuk KVM 1

### 1. Jangan Build Ulang Terlalu Sering

Build memakan banyak RAM. Jika perlu update:

```bash
# Update code tanpa rebuild
docker cp /path/to/file iware-backend:/app/path/to/file
docker-compose restart backend
```

### 2. Monitor Memory Secara Berkala

```bash
# Setup monitoring script
cat > /root/check-memory.sh << 'EOF'
#!/bin/bash
USED=$(free | grep Mem | awk '{print ($3/$2) * 100.0}')
if (( $(echo "$USED > 85" | bc -l) )); then
    echo "Memory usage high: $USED%"
    docker-compose restart
fi
EOF

chmod +x /root/check-memory.sh

# Add to cron (check every 30 minutes)
crontab -e
# Add: */30 * * * * /root/check-memory.sh
```

### 3. Limit Nginx Connections

Edit `/etc/nginx/nginx.conf`:

```nginx
worker_processes 1;
worker_connections 512;
```

### 4. Disable Docker Logging (Jika Perlu)

Edit `docker-compose.yml`, tambah di setiap service:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### 5. Restart Berkala

Setup auto-restart setiap malam:

```bash
crontab -e

# Add: Restart at 3 AM daily
0 3 * * * cd /var/www/backend && docker-compose restart
```

---

## 🐛 Troubleshooting KVM 1

### Container Crash karena OOM (Out of Memory)

```bash
# Check OOM kills
dmesg | grep -i "out of memory"

# Restart containers
docker-compose restart

# Jika masih crash, kurangi memory limit di docker-compose.yml
```

### Build Gagal karena RAM Habis

```bash
# Build di komputer lokal, lalu push image ke Docker Hub
# Atau build satu per satu dengan delay

docker-compose build mysql
sleep 60
docker-compose build backend
sleep 60
docker-compose build frontend
```

### Aplikasi Lambat

Ini normal untuk KVM 1. Tips:
- Gunakan swap
- Restart berkala
- Clean up Docker images
- Disable fitur yang tidak perlu

---

## 📊 Expected Performance

Dengan KVM 1, expect:
- ✅ Aplikasi berjalan normal
- ⚠️ Response time 2-5 detik (lebih lambat)
- ⚠️ Build time 10-15 menit
- ⚠️ Concurrent users: 5-10 max
- ⚠️ Perlu restart berkala

---

## 🎯 Rekomendasi

Untuk production dengan traffic tinggi, **upgrade ke KVM 2** (4GB RAM):
- Response time lebih cepat
- Bisa handle lebih banyak users
- Lebih stabil
- Harga hanya +Rp 30.000/bulan

Tapi untuk testing atau traffic rendah, **KVM 1 cukup**.

---

## ✅ Checklist KVM 1

- [ ] Swap 2GB sudah dibuat
- [ ] Swappiness set to 10
- [ ] Unnecessary services disabled
- [ ] Log rotation configured
- [ ] Docker containers running
- [ ] Memory usage < 85%
- [ ] Aplikasi bisa diakses
- [ ] SSL installed
- [ ] Auto-restart setup

---

## 🎉 Selesai!

Aplikasi kamu sekarang running di KVM 1!

**Akses**: https://iwareid.com

**Monitor memory**: `free -h` dan `docker stats`

**Jika lambat**: Normal untuk KVM 1, consider upgrade ke KVM 2.
