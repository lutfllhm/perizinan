# IWARE Perizinan

Aplikasi Perizinan Cuti/Lembur berbasis React + Express + MySQL

## 🚀 Deploy ke Hostinger

📄 **[START-HERE.txt](./START-HERE.txt)** - Panduan cepat untuk memulai

### Metode 1: ZIP Upload (Paling Mudah) ⭐

```bash
# Build dan buat ZIP dalam 1 command
npm run hostinger:zip
```

Atau double-click: `create-zip.bat` (Windows)

Kemudian:
1. Login ke Hostinger hPanel
2. Pilih "Deploy Aplikasi Web Node.js"
3. Pilih "Upload file"
4. Upload: `hostinger-deploy.zip`

📖 Panduan lengkap: [ZIP-UPLOAD-GUIDE.txt](./ZIP-UPLOAD-GUIDE.txt)

### Metode 2: Folder Upload (Manual)

```bash
# Siapkan folder upload
npm run hostinger:prepare
```

Atau double-click: `prepare-upload.bat` (Windows)

Hasil: Folder `hostinger-upload/` siap untuk:
- Di-compress menjadi ZIP
- Di-upload via FTP
- Di-upload via File Manager

📖 Panduan lengkap: [FOLDER-UPLOAD-GUIDE.md](./FOLDER-UPLOAD-GUIDE.md)

### Metode 3: Git Import

1. Push repository ke GitHub
2. Login ke hPanel Hostinger
3. Pilih menu "Git" → "Create"
4. Pilih repository ini
5. Hostinger akan auto-detect dan deploy

### Quick Reference

📄 [UPLOAD-QUICK-REFERENCE.txt](./UPLOAD-QUICK-REFERENCE.txt) - Panduan cepat semua metode

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

### Development
- `npm run dev` - Run frontend + backend
- `npm run client` - Run frontend only
- `npm run server` - Run backend only

### Hostinger Deployment
- `npm run hostinger:zip` - Build + create ZIP for upload ⭐
- `npm run hostinger:prepare` - Create upload folder 📁
- `npm run hostinger:build` - Build frontend
- `npm run hostinger:start` - Start backend
- `npm run hostinger:install` - Install all dependencies
- `npm run hostinger:validate` - Validate configuration

### Utilities
- `prepare-upload.bat` - Windows: Prepare upload folder (double-click)
- `create-zip.bat` - Windows: Create ZIP (double-click)
- `node prepare-hostinger-upload.js` - Prepare upload folder
- `node create-zip-simple.js` - Create ZIP without build
- `powershell -File create-zip.ps1` - PowerShell script

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
