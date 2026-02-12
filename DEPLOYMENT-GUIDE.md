# 🚀 Deployment Guide - iwareid.com

Panduan lengkap deployment aplikasi Perizinan Karyawan ke VPS.

## 📋 Prerequisites

### Server Requirements
- Ubuntu 20.04 LTS atau lebih baru
- Minimal 2GB RAM
- Minimal 20GB disk space
- Root access atau sudo privileges

### Software Requirements
- Docker 20.10+
- Docker Compose 2.0+
- Nginx
- Certbot (untuk SSL)

## 🔧 Installation Steps

### 1. Install Docker

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Add user to docker group
sudo usermod -aG docker $USER

# Start Docker
sudo systemctl enable docker
sudo systemctl start docker

# Verify installation
docker --version
```

### 2. Install Docker Compose

```bash
# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### 3. Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 4. Install Certbot (for SSL)

```bash
sudo apt install certbot python3-certbot-nginx -y
```

## 📦 Deploy Application

### 1. Clone Repository

```bash
cd /var/www
sudo git clone <your-repo-url> iwareid
cd iwareid
sudo chown -R $USER:$USER .
```

### 2. Configure Environment

```bash
# Copy and edit environment file
cp .env.example .env
nano .env

# Update these values:
# - MYSQL_ROOT_PASSWORD
# - MYSQL_PASSWORD
# - JWT_SECRET (generate new one!)
# - REACT_APP_API_URL (your domain)
# - FRONTEND_URL (your domain)
```

### 3. Set Permissions

```bash
chmod +x deploy-vps.sh
chmod +x docker-status.sh
chmod +x docker-rebuild.sh
chmod +x docker-logs.sh
chmod +x docker-restart.sh
chmod +x docker-healthcheck.sh

# Create required directories
mkdir -p backend/uploads backend/logs
chmod -R 777 backend/uploads backend/logs
```

### 4. Run Deployment Script

```bash
sudo ./deploy-vps.sh
```

Script akan otomatis:
- ✅ Verify dependencies
- ✅ Setup environment files
- ✅ Build Docker images
- ✅ Start containers
- ✅ Initialize database
- ✅ Run health checks

### 5. Configure Nginx Reverse Proxy

```bash
# Copy nginx config
sudo cp nginx-vps.conf /etc/nginx/sites-available/iwareid

# Create symlink
sudo ln -s /etc/nginx/sites-available/iwareid /etc/nginx/sites-enabled/

# Remove default config
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 6. Setup SSL Certificate

```bash
# Get SSL certificate
sudo certbot --nginx -d iwareid.com -d www.iwareid.com

# Follow prompts and select:
# - Enter email address
# - Agree to terms
# - Choose redirect HTTP to HTTPS (option 2)

# Verify auto-renewal
sudo certbot renew --dry-run
```

### 7. Configure Firewall

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## 🔍 Verification

### Check Container Status

```bash
./docker-status.sh
```

### Check Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Test Endpoints

```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend
curl http://localhost:3000

# Production
curl https://iwareid.com/api/health
```

## 🛠️ Maintenance Commands

### View Status
```bash
./docker-status.sh
docker-compose ps
```

### View Logs
```bash
./docker-logs.sh
docker-compose logs -f [service]
```

### Restart Services
```bash
./docker-restart.sh
docker-compose restart [service]
```

### Rebuild Service
```bash
./docker-rebuild.sh [service]
```

### Stop All
```bash
docker-compose down
```

### Start All
```bash
docker-compose up -d
```

### Update Application
```bash
# Pull latest code
git pull

# Rebuild and restart
sudo ./deploy-vps.sh
```

## 🔐 Security Checklist

- [ ] Change default MySQL passwords
- [ ] Generate new JWT_SECRET
- [ ] Change default admin password (admin/admin123)
- [ ] Enable firewall (ufw)
- [ ] Setup SSL certificate
- [ ] Configure fail2ban (optional)
- [ ] Setup automated backups
- [ ] Restrict MySQL port (only localhost)
- [ ] Use strong passwords
- [ ] Keep system updated

## 📊 Monitoring

### Resource Usage
```bash
docker stats
```

### Disk Usage
```bash
docker system df
df -h
```

### Container Health
```bash
docker ps
docker inspect iware-backend | grep -A 10 Health
```

## 🔄 Backup & Restore

### Backup Database
```bash
# Create backup
docker exec iware-mysql mysqldump -u root -p'Jasadenam66/' iware_perizinan > backup_$(date +%Y%m%d).sql

# Backup with gzip
docker exec iware-mysql mysqldump -u root -p'Jasadenam66/' iware_perizinan | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Restore Database
```bash
# Restore from backup
docker exec -i iware-mysql mysql -u root -p'Jasadenam66/' iware_perizinan < backup_20240101.sql

# Restore from gzip
gunzip < backup_20240101.sql.gz | docker exec -i iware-mysql mysql -u root -p'Jasadenam66/' iware_perizinan
```

### Backup Uploads
```bash
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz backend/uploads/
```

## 🐛 Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs [service]

# Check if port is in use
sudo netstat -tulpn | grep :5000
sudo netstat -tulpn | grep :3000

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Error
```bash
# Check MySQL is running
docker exec iware-mysql mysqladmin ping -h localhost -uroot -p'Jasadenam66/'

# Check environment variables
docker exec iware-backend env | grep DB_

# Restart backend
docker-compose restart backend
```

### Frontend Not Loading
```bash
# Check nginx logs
docker logs iware-frontend

# Check build output
docker exec iware-frontend ls -la /usr/share/nginx/html

# Rebuild frontend
./docker-rebuild.sh frontend
```

### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test nginx config
sudo nginx -t
```

## 📞 Support

Jika mengalami masalah:

1. Check logs: `docker-compose logs -f`
2. Check status: `./docker-status.sh`
3. Check health: `./docker-healthcheck.sh`
4. Review error messages
5. Check firewall rules
6. Verify DNS settings

## 🔗 Useful Links

- Docker Documentation: https://docs.docker.com
- Nginx Documentation: https://nginx.org/en/docs/
- Certbot Documentation: https://certbot.eff.org/docs/
- MySQL Documentation: https://dev.mysql.com/doc/

## 📝 Notes

- Default admin credentials: `admin` / `admin123` (CHANGE THIS!)
- Default HRD credentials: `hrd` / `hrd123` (CHANGE THIS!)
- Database auto-initializes with 173 employees from 8 offices
- Uploads stored in: `backend/uploads/`
- Logs stored in: `backend/logs/`
- MySQL data persisted in Docker volume: `mysql_data`

---

**Last Updated:** 2024
**Version:** 1.0.0
