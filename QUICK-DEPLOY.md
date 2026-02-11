# ⚡ Quick Deploy Reference - iwareid.com

Panduan singkat untuk deployment cepat.

---

## 🚀 Quick Start (5 Langkah)

### 1. Setup VPS (10 menit)

```bash
# Login ke VPS
ssh root@[IP-VPS]

# Install semua dependencies
curl -fsSL https://get.docker.com | sh
apt install -y docker-compose nginx certbot python3-certbot-nginx
```

### 2. Setup DNS (5 menit)

Di Hostinger DNS, tambah A records:
- `@` → `[IP-VPS]`
- `www` → `[IP-VPS]`

### 3. Upload File (10 menit)

Pakai FileZilla, upload ke `/var/www/backend`:
- backend/
- frontend/
- docker-compose.yml
- nginx-vps.conf
- deploy-vps.sh

### 4. Deploy (10 menit)

```bash
cd /var/www/backend
chmod +x deploy-vps.sh
./deploy-vps.sh
```

### 5. Setup Nginx & SSL (5 menit)

```bash
# Nginx
cp nginx-vps.conf /etc/nginx/sites-available/iwareid
ln -s /etc/nginx/sites-available/iwareid /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# SSL
certbot --nginx -d iwareid.com -d www.iwareid.com
```

**Done! Akses: https://iwareid.com**

---

## 🔧 Common Commands

### Docker

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build

# Logs
docker-compose logs -f

# Status
docker-compose ps
```

### Nginx

```bash
# Test
nginx -t

# Restart
systemctl restart nginx

# Logs
tail -f /var/log/nginx/error.log
```

### Database

```bash
# Backup
docker exec iware-mysql mysqldump -u root -pJasadenam66/ iware_perizinan > backup.sql

# Restore
docker exec -i iware-mysql mysql -u root -pJasadenam66/ iware_perizinan < backup.sql

# Access MySQL
docker exec -it iware-mysql mysql -u root -pJasadenam66/
```

---

## 🐛 Quick Troubleshooting

### Container tidak start
```bash
docker-compose logs
docker-compose restart
```

### Database error
```bash
docker logs iware-mysql
docker-compose restart mysql
```

### Frontend tidak bisa hit backend
```bash
docker-compose up -d --build frontend
# Clear browser cache: Ctrl+Shift+R
```

### Nginx error
```bash
nginx -t
systemctl restart nginx
```

---

## 📋 Checklist

- [ ] Docker installed
- [ ] DNS pointing to VPS
- [ ] Files uploaded
- [ ] Containers running
- [ ] Nginx configured
- [ ] SSL installed
- [ ] Login works
- [ ] Password changed

---

## 🔐 Default Login

- Admin: `admin` / `admin123`
- HRD: `hrd` / `hrd123`

**⚠️ Ganti password setelah login!**
