# 🚀 Panduan Deployment IWARE ke VPS Hostinger

Panduan lengkap untuk deploy aplikasi IWARE Perizinan ke VPS dengan domain **iwareid.com**

## 📋 Prerequisites

- VPS Hostinger (minimal 2GB RAM, 2 CPU cores)
- Domain iwareid.com sudah pointing ke IP VPS
- SSH access ke VPS
- Email untuk SSL certificate

## 🎯 Quick Deployment (Recommended)

### 1. Persiapan VPS

```bash
# Login ke VPS via SSH
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y
```

### 2. Clone Repository

```bash
# Install git jika belum ada
apt install -y git

# Clone repository ke /var/www/iware
cd /var/www
git clone <your-repo-url> iware
cd iware
```

### 3. Konfigurasi Domain

Pastikan domain iwareid.com sudah pointing ke IP VPS:

```bash
# Cek DNS
nslookup iwareid.com
dig iwareid.com
```

### 4. Edit Email untuk SSL

Edit file `deploy.sh` dan ubah email:

```bash
nano deploy.sh
# Ubah baris: EMAIL="admin@iwareid.com"
# Ganti dengan email Anda
```

### 5. Jalankan Deployment Script
sdadadadasd
```bash
# Berikan permission
chmod +x deploy.sh

# Jalankan deployment
sudo bash deploy.sh
```

Script akan otomatis:
- ✅ Install Docker & Docker Compose
- ✅ Install Nginx
- ✅ Setup SSL dengan Let's Encrypt
- ✅ Build dan start containers
- ✅ Configure firewall
- ✅ Setup automatic backup

### 6. Tunggu Proses Selesai

Deployment memakan waktu 5-10 menit. Setelah selesai, aplikasi akan tersedia di:

🌐 **https://iwareid.com**

## 🔐 Login Pertama Kali

```
Username: admin
Password: admin123
```

⚠️ **PENTING**: Segera ganti password setelah login!

## 📊 Management Commands

Gunakan quick commands untuk manage aplikasi:

```bash
# Lihat status
bash quick-commands.sh status

# Lihat logs
bash quick-commands.sh logs

# Restart services
bash quick-commands.sh restart

# Backup database
bash quick-commands.sh backup

# Update aplikasi
bash quick-commands.sh update
```

## 🔧 Manual Deployment (Alternative)

Jika ingin deploy manual tanpa script:

### 1. Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl enable docker
sudo systemctl start docker
```

### 2. Install Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. Setup Environment

```bash
cd /var/www/iware
cp .env.docker .env

# Edit jika perlu
nano .env
```

### 4. Start Containers

```bash
docker-compose up -d --build
```

### 5. Install Nginx

```bash
sudo apt install -y nginx
sudo cp nginx-vps.conf /etc/nginx/sites-available/iwareid.com
sudo ln -s /etc/nginx/sites-available/iwareid.com /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Setup SSL

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d iwareid.com -d www.iwareid.com
```

## 🔍 Troubleshooting

### Container tidak start

```bash
# Cek logs
docker-compose logs -f

# Restart containers
docker-compose restart
```

### Database connection error

```bash
# Restart MySQL container
docker-compose restart mysql

# Tunggu 30 detik
sleep 30

# Restart backend
docker-compose restart backend
```

### Nginx error

```bash
# Test konfigurasi
sudo nginx -t

# Cek logs
sudo tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx
```

### SSL certificate error

```bash
# Renew certificate
sudo certbot renew

# Restart nginx
sudo systemctl restart nginx
```

### Port sudah digunakan

```bash
# Cek port yang digunakan
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :5000

# Stop service yang menggunakan port
sudo systemctl stop apache2  # jika ada
```

## 💾 Backup & Restore

### Manual Backup

```bash
# Backup database
docker exec iware-mysql mysqldump -u iware -pIwareDB2026!@# iware_perizinan > backup.sql

# Backup uploads
tar -czf uploads-backup.tar.gz backend/uploads/
```

### Restore Database

```bash
# Restore dari backup
docker exec -i iware-mysql mysql -u iware -pIwareDB2026!@# iware_perizinan < backup.sql
```

### Automatic Backup

Backup otomatis sudah dijadwalkan setiap hari jam 2 pagi:

```bash
# Cek cron job
crontab -l

# Jalankan backup manual
/usr/local/bin/backup-iware.sh

# Lihat backup
ls -lh /var/backups/iware/
```

## 🔄 Update Aplikasi

### Via Git

```bash
cd /var/www/iware
git pull
docker-compose down
docker-compose up -d --build
```

### Via Quick Command

```bash
bash quick-commands.sh update
```

## 📈 Monitoring

### Check Service Status

```bash
# Docker containers
docker-compose ps

# Nginx
sudo systemctl status nginx

# Disk usage
df -h

# Memory usage
free -h

# CPU usage
top
```

### View Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend

# MySQL only
docker-compose logs -f mysql

# Nginx logs
sudo tail -f /var/log/nginx/iwareid.com.access.log
sudo tail -f /var/log/nginx/iwareid.com.error.log
```

## 🔒 Security Checklist

- ✅ SSL/HTTPS enabled
- ✅ Firewall configured (UFW)
- ✅ Strong database password
- ✅ JWT secret configured
- ✅ Default admin password changed
- ✅ Regular backups enabled
- ✅ Auto SSL renewal configured

## 🆘 Support

Jika mengalami masalah:

1. Cek logs: `docker-compose logs -f`
2. Cek status: `bash quick-commands.sh status`
3. Restart services: `bash quick-commands.sh restart`
4. Cek dokumentasi troubleshooting di atas

## 📞 Contact

Untuk bantuan lebih lanjut, hubungi tim development.

---

**Happy Deploying! 🚀**
