# ⚡ Quick Reference - Hostinger VPS

Referensi cepat untuk hosting di VPS Hostinger.

---

## 📖 Panduan Lengkap

**BACA INI:** [HOSTING-HOSTINGER-IWAREID.md](HOSTING-HOSTINGER-IWAREID.md)

Panduan lengkap dari NOL sampai SELESAI (16 langkah).

---

## ⚡ Quick Commands

### Setup Awal (Copy-Paste)

```bash
# 1. Update system
apt update && apt upgrade -y

# 2. Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install nodejs -y

# 3. Install MySQL
apt install mysql-server -y
systemctl start mysql
systemctl enable mysql

# 4. Install Nginx
apt install nginx -y
systemctl start nginx
systemctl enable nginx

# 5. Install PM2 & Git
npm install -g pm2
apt install git -y

# 6. Create app directory
mkdir -p /var/www/iwareid
cd /var/www/iwareid
```

### Setup Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE iware_perizinan;
CREATE USER 'iware_user'@'localhost' IDENTIFIED BY 'YourPassword123!';
GRANT ALL PRIVILEGES ON iware_perizinan.* TO 'iware_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Install & Build

```bash
cd /var/www/iwareid

# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Generate JWT secret
cd /var/www/iwareid/backend
node scripts/generate-jwt-secret.js

# Setup .env files
cp backend/.env.production backend/.env
nano backend/.env  # Edit database credentials

cp frontend/.env.production frontend/.env

# Initialize database
cd backend
npm run init-db

# Build frontend
cd ../frontend
npm run build
```

### Start with PM2

```bash
# Start backend
cd /var/www/iwareid/backend
pm2 start server.js --name iware-backend

# Install serve & start frontend
npm install -g serve
cd /var/www/iwareid/frontend
pm2 start "serve -s build -l 3000" --name iware-frontend

# Save PM2
pm2 save
pm2 startup
```

### Setup Nginx

```bash
# Create config
nano /etc/nginx/sites-available/iwareid.com
# Paste config dari panduan lengkap

# Enable site
ln -s /etc/nginx/sites-available/iwareid.com /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test & restart
nginx -t
systemctl restart nginx
```

### Setup SSL

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get certificate
certbot --nginx -d iwareid.com -d www.iwareid.com
```

### Setup Firewall

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## 🔧 Maintenance Commands

### PM2

```bash
pm2 list                    # List processes
pm2 logs                    # View logs
pm2 logs iware-backend      # Backend logs only
pm2 restart all             # Restart all
pm2 stop all                # Stop all
pm2 delete all              # Delete all
pm2 monit                   # Monitor resources
```

### Nginx

```bash
systemctl status nginx      # Check status
systemctl restart nginx     # Restart
systemctl reload nginx      # Reload config
nginx -t                    # Test config
tail -f /var/log/nginx/iwareid-error.log  # View logs
```

### MySQL

```bash
systemctl status mysql      # Check status
systemctl restart mysql     # Restart
mysql -u iware_user -p iware_perizinan  # Login to database
```

### Database Backup

```bash
# Backup
mysqldump -u iware_user -p iware_perizinan > backup-$(date +%Y%m%d).sql

# Restore
mysql -u iware_user -p iware_perizinan < backup-20260206.sql
```

### SSL Certificate

```bash
certbot certificates        # List certificates
certbot renew              # Renew certificates
certbot renew --dry-run    # Test renewal
```

---

## 🆘 Troubleshooting

### Website tidak bisa diakses

```bash
# Cek DNS
ping iwareid.com

# Cek services
systemctl status nginx
pm2 list

# Cek firewall
ufw status

# Test backend
curl http://localhost:5000/health
```

### 502 Bad Gateway

```bash
# Restart PM2
pm2 restart all

# Cek logs
pm2 logs

# Test backend
curl http://localhost:5000/health
```

### Database error

```bash
# Cek MySQL
systemctl status mysql

# Test connection
mysql -u iware_user -p

# Cek .env
nano /var/www/iwareid/backend/.env
```

### Permission error

```bash
cd /var/www/iwareid
chown -R www-data:www-data .
chmod -R 755 .
chmod -R 777 backend/uploads
```

---

## 📊 Default Credentials

### Admin Login
- URL: https://iwareid.com
- Username: `admin`
- Password: `admin123` (UBAH SETELAH LOGIN!)

### Database
- Host: `localhost`
- Database: `iware_perizinan`
- User: `iware_user`
- Password: (yang Anda set)

### SSH
- Host: (IP VPS Anda)
- Port: `22`
- User: `root`
- Password: (dari hPanel Hostinger)

---

## 📁 Important Paths

```
Application:     /var/www/iwareid
Backend .env:    /var/www/iwareid/backend/.env
Frontend .env:   /var/www/iwareid/frontend/.env
Nginx config:    /etc/nginx/sites-available/iwareid.com
SSL cert:        /etc/letsencrypt/live/iwareid.com/
Nginx logs:      /var/log/nginx/iwareid-*.log
Uploads:         /var/www/iwareid/backend/uploads
```

---

## 🔄 Update Application

```bash
# Backup database
mysqldump -u iware_user -p iware_perizinan > backup-before-update.sql

# Pull latest code
cd /var/www/iwareid
git pull origin main

# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Rebuild frontend
cd /var/www/iwareid/frontend
npm run build

# Restart
pm2 restart all
```

---

## 📞 Hostinger Support

- **Live Chat:** hPanel → Support
- **Email:** support@hostinger.com
- **Knowledge Base:** https://support.hostinger.com

---

## ✅ Checklist

- [ ] VPS setup & SSH access
- [ ] Node.js, MySQL, Nginx installed
- [ ] Source code uploaded
- [ ] Database created & initialized
- [ ] Environment configured
- [ ] Frontend built
- [ ] PM2 started
- [ ] DNS pointed to VPS
- [ ] Nginx configured
- [ ] SSL certificate obtained
- [ ] Firewall configured
- [ ] Website accessible
- [ ] Login tested
- [ ] Password changed

---

**Full Guide:** [HOSTING-HOSTINGER-IWAREID.md](HOSTING-HOSTINGER-IWAREID.md)

© 2026 IWARE. All rights reserved.
