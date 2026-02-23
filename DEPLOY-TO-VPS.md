# 🚀 Deploy ke VPS Hostinger - Step by Step

## Informasi VPS
- **SSH**: `root@76.13.193.154`
- **Domain**: iwareid.com
- **Lokasi App**: `/var/www/iware`

---

## 📋 Persiapan (Di Local)

### 1. Pastikan semua perubahan sudah di-commit
```bash
git status
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Pastikan file-file deployment sudah ada
- ✅ deploy.sh
- ✅ docker-compose.yml
- ✅ nginx-vps.conf
- ✅ .env.docker
- ✅ update-vps.sh

---

## 🎯 Deployment Pertama Kali

### 1. Login ke VPS
```bash
ssh root@76.13.193.154
```

### 2. Install Git (jika belum ada)
```bash
apt update
apt install -y git
```

### 3. Clone Repository
```bash
cd /var/www
git clone <URL_REPOSITORY_ANDA> iware
cd iware
```

### 4. Jalankan Deployment Script
```bash
chmod +x deploy.sh
bash deploy.sh
```

Script akan otomatis:
- Install Docker & Docker Compose
- Install Nginx
- Setup SSL Let's Encrypt
- Build & start containers
- Configure firewall
- Setup automatic backup

### 5. Tunggu Proses Selesai (5-10 menit)

### 6. Akses Aplikasi
Buka browser: `https://iwareid.com`

Login default:
- Username: `admin`
- Password: `admin123`

⚠️ **SEGERA GANTI PASSWORD!**

---

## 🔄 Update Aplikasi (Jika Sudah Deploy)

### Opsi 1: Menggunakan Script Update

**1. Login ke VPS:**
```bash
ssh root@76.13.193.154
```

**2. Jalankan update script:**
```bash
cd /var/www/iware
bash update-vps.sh
```

### Opsi 2: Manual Update

**1. Login ke VPS:**
```bash
ssh root@76.13.193.154
```

**2. Pull perubahan terbaru:**
```bash
cd /var/www/iware
git pull origin main
```

**3. Rebuild containers:**
```bash
docker-compose down
docker-compose up -d --build
```

**4. Cek status:**
```bash
docker-compose ps
docker-compose logs -f
```

---

## 🔍 Verifikasi Deployment

### 1. Cek Container Status
```bash
docker-compose ps
```
Output harus menunjukkan semua container "Up"

### 2. Cek Logs
```bash
# Semua logs
docker-compose logs -f

# Backend saja
docker-compose logs -f backend

# Frontend saja
docker-compose logs -f frontend
```

### 3. Test di Browser
1. Buka `https://iwareid.com`
2. Pastikan SSL aktif (gembok hijau)
3. Test login
4. Test semua fitur

---

## 🛠️ Troubleshooting

### Container tidak start
```bash
docker-compose logs
docker-compose restart
```

### Database connection error
```bash
docker-compose restart mysql
sleep 30
docker-compose restart backend
```

### Nginx error
```bash
nginx -t
systemctl status nginx
tail -f /var/log/nginx/error.log
```

### Port sudah digunakan
```bash
netstat -tulpn | grep :80
netstat -tulpn | grep :443
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000
```

### Force rebuild (jika perubahan tidak muncul)
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 💾 Backup Database

### Manual Backup
```bash
docker exec iware-mysql mysqldump -u iware -pIwareDB2026!@# iware_perizinan > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
docker exec -i iware-mysql mysql -u iware -pIwareDB2026!@# iware_perizinan < backup.sql
```

---

## 📊 Monitoring

### Cek Resource Usage
```bash
# CPU & Memory
docker stats

# Disk space
df -h

# Memory
free -h
```

### Cek Logs Real-time
```bash
docker-compose logs -f
```

---

## 🔐 Security Checklist

- [ ] SSL/HTTPS aktif
- [ ] Firewall configured (port 22, 80, 443)
- [ ] Default admin password sudah diganti
- [ ] Database password kuat
- [ ] JWT secret configured
- [ ] Backup otomatis aktif

---

## 📞 Quick Commands

```bash
# Status
docker-compose ps

# Restart semua
docker-compose restart

# Stop semua
docker-compose down

# Start semua
docker-compose up -d

# Rebuild
docker-compose up -d --build

# Logs
docker-compose logs -f

# Backup
/usr/local/bin/backup-iware.sh
```

---

## ⚠️ Catatan Penting

1. **Selalu backup sebelum update**
2. **Test di local dulu sebelum deploy**
3. **Monitor logs setelah deployment**
4. **Ganti password default segera**
5. **Setup monitoring dan alerting**

---

**Last Updated**: 2026-02-23
**Status**: Ready for deployment
