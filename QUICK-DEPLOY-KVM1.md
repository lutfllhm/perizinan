# ⚡ Quick Deploy KVM 1 (2GB RAM)

Panduan singkat deployment untuk VPS dengan resource terbatas.

---

## 🚨 Penting untuk KVM 1

**WAJIB setup SWAP dulu!** Tanpa swap, container akan crash.

---

## 🚀 Quick Start (6 Langkah)

### 1. Setup VPS + Swap (15 menit)

```bash
# Login
ssh root@[IP-VPS]

# Install dependencies
curl -fsSL https://get.docker.com | sh
apt install -y docker-compose nginx certbot python3-certbot-nginx

# PENTING: Buat swap 2GB
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
sysctl vm.swappiness=10
echo 'vm.swappiness=10' >> /etc/sysctl.conf

# Verify swap
free -h
# Harus ada 2GB swap
```

### 2. Setup DNS (5 menit)

Di Hostinger DNS:
- `@` → `[IP-VPS]`
- `www` → `[IP-VPS]`

### 3. Upload File (10 menit)

Pakai FileZilla ke `/var/www/backend`:
- backend/
- frontend/
- **docker-compose-kvm1.yml** ← Penting!
- nginx-vps.conf
- deploy-kvm1.sh

### 4. Rename & Deploy (15 menit)

```bash
cd /var/www/backend

# Rename file
mv docker-compose-kvm1.yml docker-compose.yml

# Deploy
chmod +x deploy-kvm1.sh
./deploy-kvm1.sh
```

**Build akan lambat (10-15 menit), ini normal untuk KVM 1.**

### 5. Setup Nginx (5 menit)

```bash
cp nginx-vps.conf /etc/nginx/sites-available/iwareid
ln -s /etc/nginx/sites-available/iwareid /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

### 6. Install SSL (5 menit)

```bash
certbot --nginx -d iwareid.com -d www.iwareid.com
```

**Done! Akses: https://iwareid.com**

---

## 💾 Monitoring Memory (PENTING!)

```bash
# Cek memory
free -h

# Cek Docker
docker stats --no-stream

# Jika memory > 85%, restart:
docker-compose restart
```

---

## 🔧 Common Commands

### Docker (Build Satu-Satu)

```bash
# Start MySQL dulu
docker-compose up -d mysql
sleep 60

# Lalu Backend
docker-compose up -d backend
sleep 30

# Terakhir Frontend
docker-compose up -d frontend
```

### Restart (Jika Lambat)

```bash
# Restart semua
docker-compose restart

# Atau satu-satu
docker-compose restart mysql
docker-compose restart backend
docker-compose restart frontend
```

### Clean Up (Free Memory)

```bash
# Clean Docker
docker system prune -a -f

# Clean logs
journalctl --vacuum-time=3d
```

---

## 🐛 Troubleshooting KVM 1

### Container Crash

```bash
# Cek memory
free -h

# Jika swap penuh, restart
docker-compose restart

# Atau rebuild satu-satu
docker-compose down
docker-compose up -d mysql
sleep 60
docker-compose up -d backend
sleep 30
docker-compose up -d frontend
```

### Build Gagal (Out of Memory)

```bash
# Clean dulu
docker system prune -a -f

# Build satu-satu dengan delay
docker-compose build mysql
sleep 60
docker-compose build backend
sleep 60
docker-compose build frontend

# Lalu start
docker-compose up -d
```

### Aplikasi Lambat

Ini **NORMAL** untuk KVM 1:
- Response time: 2-5 detik
- Max users: 5-10 concurrent
- Perlu restart berkala

**Solusi**: Upgrade ke KVM 2 (4GB RAM)

---

## ⚡ Tips Optimasi

### 1. Auto Restart Malam Hari

```bash
crontab -e

# Add: Restart at 3 AM
0 3 * * * cd /var/www/backend && docker-compose restart
```

### 2. Monitor Memory

```bash
# Setup alert
cat > /root/check-mem.sh << 'EOF'
#!/bin/bash
USED=$(free | grep Mem | awk '{print ($3/$2) * 100.0}')
if (( $(echo "$USED > 85" | bc -l) )); then
    cd /var/www/backend && docker-compose restart
fi
EOF

chmod +x /root/check-mem.sh

# Run every 30 minutes
crontab -e
# Add: */30 * * * * /root/check-mem.sh
```

### 3. Limit Nginx

Edit `/etc/nginx/nginx.conf`:

```nginx
worker_processes 1;
worker_connections 512;
```

---

## 📊 Expected Performance

| Metric | KVM 1 | KVM 2 |
|--------|-------|-------|
| Response Time | 2-5s | <1s |
| Max Users | 5-10 | 50+ |
| Stability | Medium | High |
| Price | Rp 39k | Rp 69k |

**Rekomendasi**: KVM 1 untuk testing, KVM 2 untuk production.

---

## ✅ Checklist

- [ ] Swap 2GB created
- [ ] DNS pointing to VPS
- [ ] Files uploaded
- [ ] docker-compose-kvm1.yml renamed
- [ ] Containers running
- [ ] Memory < 85%
- [ ] Nginx configured
- [ ] SSL installed
- [ ] Login works

---

## 🎯 Upgrade ke KVM 2?

Jika aplikasi sering lambat atau crash:

1. Login ke hpanel.hostinger.com
2. VPS → Upgrade
3. Pilih KVM 2 (4GB RAM)
4. Bayar selisih
5. Tidak perlu deploy ulang!

---

## 🔐 Default Login

- Admin: `admin` / `admin123`
- HRD: `hrd` / `hrd123`

**⚠️ Ganti password!**
