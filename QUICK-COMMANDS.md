# ⚡ Quick Commands - IWARE Perizinan VPS

Kumpulan command cepat untuk troubleshooting VPS.

## 🔥 Most Common Fixes

### Fix 1: Restart Backend (Paling Sering Berhasil)
```bash
docker-compose restart backend
sleep 30
curl http://localhost:5001/api/karyawan
```

### Fix 2: Full Restart
```bash
docker-compose restart
sleep 60
curl http://localhost:5001/api/karyawan
```

### Fix 3: Rebuild Everything
```bash
docker-compose down
docker-compose up -d --build
sleep 90
curl http://localhost:5001/api/karyawan
```

## 📊 Check Status

```bash
# Container status
docker-compose ps

# Backend logs (last 50 lines)
docker-compose logs backend | tail -50

# MySQL logs
docker-compose logs mysql | tail -50

# Frontend logs
docker-compose logs frontend | tail -50

# All logs (live)
docker-compose logs -f
```

## 🗄️ Database Commands

```bash
# Connect to MySQL
docker exec -it iware-mysql mysql -u iware -p
# Password: YourSecureDBPassword2026!@#

# Quick check (one-liner)
docker exec iware-mysql mysql -u iware -pYourSecureDBPassword2026!@# iware_perizinan -e "SELECT COUNT(*) FROM karyawan;"

# Check all tables
docker exec iware-mysql mysql -u iware -pYourSecureDBPassword2026!@# iware_perizinan -e "SHOW TABLES;"

# Check karyawan by kantor
docker exec iware-mysql mysql -u iware -pYourSecureDBPassword2026!@# iware_perizinan -e "SELECT kantor, COUNT(*) as total FROM karyawan GROUP BY kantor;"
```

## 🔧 Manual Import

```bash
# Import karyawan data
docker exec -it iware-backend node scripts/import-real-karyawan.js

# Create admin user
docker exec -it iware-backend node scripts/create-superadmin.js

# Reset admin password
docker exec -it iware-backend node scripts/reset-admin-password.js
```

## 🌐 Test API Endpoints

```bash
# Health check
curl http://localhost:5001/api/health
curl https://license.iwareid.com/api/health

# Karyawan API
curl http://localhost:5001/api/karyawan
curl https://license.iwareid.com/api/karyawan

# Karyawan by kantor
curl "http://localhost:5001/api/karyawan?kantor=RBM-IWARE%20SURABAYA"

# Login test
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Pengajuan list
curl http://localhost:5001/api/pengajuan
```

## 🔍 Nginx Commands

```bash
# Test config
sudo nginx -t

# Reload config
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

## 🐳 Docker Commands

```bash
# Stop all containers
docker-compose down

# Start all containers
docker-compose up -d

# Restart specific container
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mysql

# View container logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Follow logs (live)
docker-compose logs -f backend

# Execute command in container
docker exec -it iware-backend bash
docker exec -it iware-mysql bash

# Remove all containers and volumes (DANGER!)
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

## 🔥 Emergency Commands

### Backend Not Responding
```bash
docker-compose restart backend
sleep 30
docker-compose logs backend | tail -100
```

### Database Connection Error
```bash
docker-compose restart mysql
sleep 30
docker-compose restart backend
sleep 30
docker-compose logs backend | grep "Database"
```

### Port Already in Use
```bash
# Check what's using the port
sudo netstat -tulpn | grep :5001
sudo netstat -tulpn | grep :3001

# Kill the process
sudo kill -9 [PID]

# Restart containers
docker-compose restart
```

### Out of Memory
```bash
# Check memory
free -h
docker stats

# Restart Docker
sudo systemctl restart docker
sleep 10
docker-compose up -d
```

### Disk Full
```bash
# Check disk space
df -h

# Clean Docker
docker system prune -a
docker volume prune

# Clean logs
sudo truncate -s 0 /var/log/nginx/access.log
sudo truncate -s 0 /var/log/nginx/error.log
```

## 📦 Backup & Restore

### Backup Database
```bash
# Backup to file
docker exec iware-mysql mysqldump -u iware -pYourSecureDBPassword2026!@# iware_perizinan > backup-$(date +%Y%m%d-%H%M%S).sql

# Backup with gzip
docker exec iware-mysql mysqldump -u iware -pYourSecureDBPassword2026!@# iware_perizinan | gzip > backup-$(date +%Y%m%d-%H%M%S).sql.gz
```

### Restore Database
```bash
# Restore from file
docker exec -i iware-mysql mysql -u iware -pYourSecureDBPassword2026!@# iware_perizinan < backup-20260324-120000.sql

# Restore from gzip
gunzip < backup-20260324-120000.sql.gz | docker exec -i iware-mysql mysql -u iware -pYourSecureDBPassword2026!@# iware_perizinan
```

## 🔐 Security Commands

```bash
# Check firewall status
sudo ufw status

# Allow port
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check SSL certificate
sudo certbot certificates

# Renew SSL
sudo certbot renew

# Test SSL renewal
sudo certbot renew --dry-run
```

## 📈 Monitoring

```bash
# System resources
htop
# or
top

# Docker stats
docker stats

# Disk usage
df -h
du -sh /var/www/iware/*

# Memory usage
free -h

# Network connections
sudo netstat -tulpn

# Check running processes
ps aux | grep node
ps aux | grep nginx
ps aux | grep mysql
```

## 🎯 One-Liner Diagnostics

```bash
# Full system check
echo "=== Containers ===" && docker-compose ps && echo "" && echo "=== Backend Health ===" && curl -s http://localhost:5001/api/health && echo "" && echo "=== Karyawan Count ===" && curl -s http://localhost:5001/api/karyawan | jq '.data | length' && echo "" && echo "=== Nginx ===" && sudo nginx -t

# Quick fix
docker-compose restart backend && sleep 30 && curl -s http://localhost:5001/api/karyawan | jq '.data | length'

# Full restart and check
docker-compose restart && sleep 60 && curl -s http://localhost:5001/api/health && curl -s http://localhost:5001/api/karyawan | jq '.data | length'
```

## 📝 Notes

- Ganti `YourSecureDBPassword2026!@#` dengan password database Anda yang sebenarnya
- Ganti `license.iwareid.com` dengan domain Anda jika berbeda
- Semua command diasumsikan dijalankan dari direktori `/var/www/iware`
- Gunakan `sudo` jika diperlukan untuk command tertentu

---

**Pro Tip:** Bookmark file ini untuk akses cepat saat troubleshooting!
