# 📋 IWARE Perizinan

Aplikasi Perizinan Cuti/Lembur berbasis React + Express + MySQL

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-orange.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

---

## 🚀 HOSTING DI HOSTINGER VPS

**Punya VPS Hostinger & Domain iwareid.com?**

👉 **[HOSTING-HOSTINGER-IWAREID.md](HOSTING-HOSTINGER-IWAREID.md)** - Panduan lengkap dari NOL sampai SELESAI!

📖 **Quick Reference:** [HOSTINGER-QUICK-REFERENCE.md](HOSTINGER-QUICK-REFERENCE.md)

---

## 🎯 MULAI DI SINI

**Baru pertama kali?** Baca: **[00-MULAI-DISINI.md](00-MULAI-DISINI.md)**

**Bingung pilih panduan?** Baca: **[PILIH-PANDUAN.md](PILIH-PANDUAN.md)**

**Ingin deploy cepat?** Baca: **[QUICK-START.md](QUICK-START.md)**

---

## 🚀 Deploy ke VPS

### Prasyarat
- Node.js >= 18.0.0
- npm >= 9.0.0
- MySQL >= 5.7
- PM2 (untuk production)

### 1. Clone Repository

```bash
git clone <repository-url>
cd iware-perizinan
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Setup Database

Buat database MySQL:
```sql
CREATE DATABASE iware_perizinan;
```

### 4. Konfigurasi Environment

Copy file `.env.vps` ke `.env` dan sesuaikan:
```bash
cd backend
cp .env.vps .env
nano .env
```

Sesuaikan konfigurasi:
- `DB_HOST` - Host MySQL (biasanya localhost)
- `DB_USER` - Username MySQL
- `DB_PASSWORD` - Password MySQL
- `DB_NAME` - Nama database (iware_perizinan)
- `FRONTEND_URL` - URL frontend (http://your-vps-ip:3000)
- `JWT_SECRET` - Generate dengan: `node scripts/generate-jwt-secret.js`

### 5. Initialize Database

```bash
cd backend
npm run init-db
```

Default admin user:
- Username: `admin`
- Password: `admin123`

### 6. Build Frontend

```bash
npm run build
```

### 7. Start Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode dengan PM2

Install PM2:
```bash
npm install -g pm2
```

Start backend:
```bash
cd backend
pm2 start server.js --name iware-backend
```

Serve frontend (gunakan nginx atau serve):
```bash
cd frontend
npm install -g serve
pm2 start "serve -s build -l 3000" --name iware-frontend
```

### 8. Setup Nginx (Opsional)

Buat konfigurasi nginx untuk reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart nginx:
```bash
sudo systemctl restart nginx
```

## 📁 Struktur Aplikasi

```
├── frontend/          # React app
│   ├── src/
│   ├── public/
│   └── build/        # Production build
├── backend/           # Express API
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   ├── config/       # Database config
│   ├── scripts/      # Utility scripts
│   └── uploads/      # File uploads
└── package.json      # Root package
```

## 🔧 Scripts

### Development
- `npm run dev` - Run frontend + backend
- `npm run client` - Run frontend only
- `npm run server` - Run backend only

### Production
- `npm run vps:install` - Install all dependencies
- `npm run vps:build` - Build frontend
- `npm run vps:start` - Start backend

### Database
- `cd backend && npm run init-db` - Initialize database

## 🔐 Default Credentials

**Admin:**
- Username: `admin`
- Password: `admin123`

⚠️ **Penting:** Ubah password default setelah login pertama!

## 🌐 Akses Aplikasi

- Frontend: http://your-vps-ip:3000
- Backend API: http://your-vps-ip:5000/api
- Health Check: http://your-vps-ip:5000/health

## 🆘 Troubleshooting

### Error: Database connection failed
- Pastikan MySQL berjalan: `sudo systemctl status mysql`
- Cek credentials di `backend/.env`
- Test connection: `mysql -u root -p`

### Error: Port already in use
- Cek port yang digunakan: `lsof -i :5000` atau `lsof -i :3000`
- Kill process: `kill -9 <PID>`

### Error: Permission denied
- Pastikan user memiliki akses ke folder: `chmod -R 755 .`
- Untuk uploads: `chmod -R 777 backend/uploads`

### PM2 Commands
- List processes: `pm2 list`
- View logs: `pm2 logs`
- Restart: `pm2 restart all`
- Stop: `pm2 stop all`
- Delete: `pm2 delete all`

## 📝 Fitur

- ✅ Login Admin & HRD
- ✅ Kelola User HRD
- ✅ Form Pengajuan Cuti/Lembur
- ✅ Approval System
- ✅ Dashboard Statistics
- ✅ WhatsApp Notification (Optional)
- ✅ Responsive Design (Mobile & Desktop)

## 🔄 Update Aplikasi

```bash
git pull origin main
npm run install:all
npm run build
pm2 restart all
```

---

© 2026 IWARE. All rights reserved.
