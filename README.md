# IWARE Perizinan

Aplikasi Perizinan Cuti/Lembur berbasis React + Express + MySQL

## 🚀 Deploy ke Hostinger

### Metode 1: Git Import (Recommended)

1. Push repository ke GitHub
2. Login ke hPanel Hostinger
3. Pilih menu "Git" → "Create"
4. Pilih repository ini
5. Hostinger akan auto-detect dan deploy

### Metode 2: Manual Upload

```bash
# Build frontend
npm run hostinger:build

# Upload via FTP/File Manager ke public_html
# Pastikan upload: .htaccess, index.php, composer.json
```

## ⚙️ Setup di Hostinger

### 1. Setup Node.js App

- hPanel → Advanced → Setup Node.js App
- Node version: 18.x
- Application root: `backend`
- Startup file: `server.js`
- Application mode: Production

### 2. Setup MySQL Database

- hPanel → Databases → MySQL Databases
- Create database dan user
- Update `backend/.env` dengan credentials

### 3. Initialize Database

```bash
node backend/scripts/init-database.js
```

### 4. Test

- Frontend: https://yourdomain.com
- API: https://yourdomain.com/api/health

## 📁 Struktur

```
├── frontend/          # React app
├── backend/           # Express API
├── .htaccess          # Apache config
├── index.php          # Entry point
└── composer.json      # Framework detection
```

## 🔧 Environment Variables

Copy `backend/.env.hostinger` ke `backend/.env` dan sesuaikan:

- DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
- JWT_SECRET (generate dengan script)
- FRONTEND_URL
- FONNTE_TOKEN (optional)

## 📚 Scripts

- `npm run hostinger:build` - Build frontend
- `npm run hostinger:start` - Start backend
- `npm run hostinger:install` - Install all dependencies

## 🆘 Troubleshooting

**Error: Framework tidak kompatibel**
- Pastikan `composer.json` ada di root
- Pastikan `.htaccess` ter-upload

**Error: Node.js not available**
- Setup Node.js App di cPanel
- Restart aplikasi setelah setup

**Error: Database connection**
- Cek credentials di `.env`
- Pastikan database sudah dibuat
- Test connection dari cPanel

---

© 2026 IWARE. All rights reserved.

## 👥 Support

Untuk bantuan:
- Buka issue di repository
- Email: support@iware.com
