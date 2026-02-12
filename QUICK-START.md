# ⚡ Quick Start Guide

Panduan cepat untuk deploy aplikasi ke VPS dalam 5 menit.

## 🚀 One-Command Deployment

```bash
# 1. Clone repository
git clone <your-repo> /var/www/iwareid
cd /var/www/iwareid

# 2. Setup permissions
chmod +x setup-permissions.sh
./setup-permissions.sh

# 3. Deploy!
sudo ./deploy-vps.sh
```

## ✅ Verification

Setelah deployment selesai, cek:

```bash
# Status containers
./docker-status.sh

# Test endpoints
curl http://localhost:5000/api/health  # Should return {"status":"OK"}
curl http://localhost:3000              # Should return HTML
```

## 🌐 Setup Domain (Optional)

Jika sudah punya domain:

```bash
# 1. Setup Nginx
sudo cp nginx-vps.conf /etc/nginx/sites-available/iwareid
sudo ln -s /etc/nginx/sites-available/iwareid /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# 2. Setup SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 3. Update .env
nano .env
# Change REACT_APP_API_URL=https://yourdomain.com/api
# Change FRONTEND_URL=https://yourdomain.com

# 4. Rebuild frontend
./docker-rebuild.sh frontend
```

## 🔐 Default Credentials

- Admin: `admin` / `admin123`
- HRD: `hrd` / `hrd123`

**⚠️ CHANGE THESE IMMEDIATELY AFTER FIRST LOGIN!**

## 📊 Useful Commands

```bash
./docker-status.sh      # Check status
./docker-logs.sh        # View logs
./docker-restart.sh     # Restart all
docker-compose ps       # Container status
```

## 🐛 Troubleshooting

### Container unhealthy?
```bash
docker-compose logs -f backend
docker-compose restart backend
```

### Frontend not loading?
```bash
docker-compose logs -f frontend
./docker-rebuild.sh frontend
```

### Database issues?
```bash
docker-compose logs -f mysql
docker-compose restart mysql
```

## 📚 Full Documentation

Lihat [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) untuk dokumentasi lengkap.

---

**Need help?** Check logs with `docker-compose logs -f`
