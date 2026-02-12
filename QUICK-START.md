# 🚀 Quick Start - Deploy ke VPS

Panduan singkat untuk deploy aplikasi IWARE Perizinan ke VPS dalam 5 menit.

## Prerequisites

- VPS Ubuntu 20.04/22.04 dengan minimal 2GB RAM
- Domain sudah pointing ke IP VPS
- Akses SSH ke VPS

## Langkah Deploy

### 1. Login ke VPS

```bash
ssh root@YOUR_VPS_IP
```

### 2. Clone Repository

```bash
# Install git jika belum ada
apt update && apt install -y git

# Clone repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git /var/www/iware
cd /var/www/iware
```

### 3. Jalankan Script Deploy

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment script
bash deploy.sh
```

Script akan otomatis:
- ✅ Install Docker & Docker Compose
- ✅ Install Nginx & Certbot
- ✅ Build aplikasi
- ✅ Start semua services
- ✅ Initialize database
- ✅ Setup Nginx
- ✅ Setup SSL (optional)

### 4. Edit Environment (Saat Diminta)

Saat script berhenti, edit file `.env`:

```bash
nano .env
```

Ubah:
```env
MYSQL_PASSWORD=YOUR_STRONG_PASSWORD
JWT_SECRET=YOUR_GENERATED_SECRET
REACT_APP_API_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com,https://www.yourdomain.com
```

Generate JWT Secret:
```bash
node backend/scripts/generate-jwt-secret.js
```

Save: `Ctrl+O`, Enter, `Ctrl+X`

### 5. Selesai! 🎉

Akses aplikasi di: `https://yourdomain.com`

Login default:
- Username: `admin`
- Password: `admin123`

## Quick Commands

```bash
# Make executable
chmod +x quick-commands.sh

# View status
bash quick-commands.sh status

# View logs
bash quick-commands.sh logs

# Restart services
bash quick-commands.sh restart

# Backup database
bash quick-commands.sh backup

# Update application
bash quick-commands.sh update
```

## Manual Deployment

Jika ingin deploy manual, ikuti panduan lengkap di [DEPLOYMENT.md](DEPLOYMENT.md)

## Troubleshooting

### Container tidak start
```bash
docker-compose logs -f
docker-compose restart
```

### Database error
```bash
docker-compose restart mysql
sleep 30
docker-compose restart backend
```

### SSL error
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Support

Untuk panduan lengkap, lihat [DEPLOYMENT.md](DEPLOYMENT.md)
