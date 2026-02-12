# 🏢 IWARE Perizinan - Sistem Manajemen Perizinan Karyawan

Aplikasi web untuk mengelola pengajuan perizinan karyawan dengan approval workflow.

## 📋 Fitur

- ✅ Manajemen Karyawan
- ✅ Pengajuan Perizinan (Sakit, Izin, Cuti)
- ✅ Upload Dokumen Pendukung
- ✅ Approval Workflow (HRD & Admin)
- ✅ Dashboard Analytics
- ✅ Responsive Design (Mobile & Desktop)
- ✅ Authentication & Authorization

## 🚀 Quick Deploy ke VPS

### Metode 1: Automatic (Recommended)

```bash
# Clone repository
git clone <your-repo-url> /var/www/iware
cd /var/www/iware

# Run deployment script
chmod +x deploy.sh
bash deploy.sh
```

### Metode 2: Manual

Ikuti panduan lengkap di [DEPLOYMENT.md](DEPLOYMENT.md)

## 📚 Dokumentasi

- [📖 Panduan Deployment Lengkap](DEPLOYMENT.md) - Step-by-step deployment ke VPS
- [⚡ Quick Start Guide](QUICK-START.md) - Deploy dalam 5 menit
- [✅ Deployment Checklist](DEPLOYMENT-CHECKLIST.md) - Checklist untuk memastikan deployment sukses

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MySQL 8.0
- JWT Authentication
- Multer (File Upload)

### Frontend
- React 18
- React Router
- Axios
- Tailwind CSS
- Framer Motion

### DevOps
- Docker & Docker Compose
- Nginx
- Let's Encrypt SSL
- Ubuntu VPS

## 📦 Struktur Project

```
iware/
├── backend/              # Backend API
│   ├── config/          # Database config
│   ├── middleware/      # Auth middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── scripts/         # Utility scripts
│   ├── uploads/         # Upload directory
│   ├── Dockerfile       # Backend Docker image
│   └── server.js        # Entry point
├── frontend/            # Frontend React
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── utils/       # Utilities
│   ├── Dockerfile       # Frontend Docker image
│   └── nginx.conf       # Nginx config
├── docker-compose.yml   # Docker orchestration
├── nginx-vps.conf       # VPS Nginx config
└── deploy.sh           # Deployment script
```

## 🔧 Development

### Prerequisites

- Node.js 18+
- MySQL 8.0
- npm atau yarn

### Setup Local

```bash
# Clone repository
git clone <your-repo-url>
cd iware

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env dengan database credentials
npm run init-db
npm run dev

# Frontend setup (terminal baru)
cd frontend
npm install
cp .env.example .env
# Edit .env dengan API URL
npm start
```

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=iware
DB_PASSWORD=your_password
DB_NAME=iware_perizinan
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

## 🐳 Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📝 Scripts

### Deployment Scripts

```bash
# Deploy aplikasi
bash deploy.sh

# Quick commands
bash quick-commands.sh status    # Check status
bash quick-commands.sh logs      # View logs
bash quick-commands.sh restart   # Restart services
bash quick-commands.sh backup    # Backup database
bash quick-commands.sh update    # Update aplikasi

# Monitoring
bash monitor.sh                  # System monitoring

# Firewall setup
sudo bash setup-firewall.sh      # Configure firewall
```

### Backend Scripts

```bash
cd backend

# Initialize database
npm run init-db

# Update database schema
npm run update-db

# Import karyawan data
npm run import-karyawan

# Generate JWT secret
node scripts/generate-jwt-secret.js

# Reset admin password
node scripts/reset-admin-password.js
```

## 🔐 Default Login

Setelah deployment, gunakan credentials berikut:

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **PENTING**: Segera ganti password setelah login pertama kali!

## 🔒 Security

- ✅ HTTPS dengan Let's Encrypt
- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ CORS Protection
- ✅ Rate Limiting
- ✅ Security Headers
- ✅ Firewall Configuration

## 📊 Monitoring

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# System monitoring
bash monitor.sh

# Resource usage
docker stats
```

## 💾 Backup & Restore

### Backup Database

```bash
# Manual backup
bash quick-commands.sh backup

# Automated backup (cron)
# Edit crontab: crontab -e
# Add: 0 2 * * * cd /var/www/iware && bash quick-commands.sh backup
```

### Restore Database

```bash
bash quick-commands.sh restore backups/backup-YYYYMMDD-HHMMSS.sql
```

## 🔄 Update Aplikasi

```bash
cd /var/www/iware
bash quick-commands.sh update
```

## 🐛 Troubleshooting

### Container tidak start
```bash
docker-compose logs -f
docker-compose restart
```

### Database connection error
```bash
docker-compose restart mysql
sleep 30
docker-compose restart backend
```

### SSL certificate error
```bash
sudo certbot renew
sudo systemctl restart nginx
```

Untuk troubleshooting lengkap, lihat [DEPLOYMENT.md](DEPLOYMENT.md#12-troubleshooting)

## 📞 Support

Untuk bantuan lebih lanjut:
1. Check [DEPLOYMENT.md](DEPLOYMENT.md) untuk panduan lengkap
2. Check [Troubleshooting section](DEPLOYMENT.md#12-troubleshooting)
3. View logs: `docker-compose logs -f`

## 📄 License

[Your License Here]

## 👥 Contributors

[Your Team Here]

---

Made with ❤️ for IWARE
