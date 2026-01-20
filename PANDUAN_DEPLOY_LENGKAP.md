# 🚀 PANDUAN DEPLOY LENGKAP - Backend, Database & Frontend

Panduan ini akan memandu Anda deploy aplikasi iWare Perizinan ke Railway dari awal sampai selesai.

**Estimasi Waktu:** 30-45 menit

---

## 📋 PERSIAPAN

### Yang Anda Butuhkan:
- ✅ Akun Railway (gratis): https://railway.app
- ✅ GitHub account (untuk connect repository)
- ✅ Repository sudah di-push ke GitHub
- ✅ Node.js terinstall di komputer (untuk testing lokal)

### Struktur Project:
```
project/
├── backend/          # Node.js + Express API
├── frontend/         # React aplikasi
└── database/         # MySQL (akan dibuat di Railway)
```

---

## 🎯 TAHAP 1: SETUP PROJECT DI RAILWAY (5 menit)

### 1.1 Login ke Railway
1. Buka https://railway.app
2. Klik **"Login"** atau **"Start a New Project"**
3. Login dengan GitHub

### 1.2 Buat Project Baru
1. Klik **"+ New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. **Authorize Railway** untuk akses GitHub Anda
4. **Pilih repository** aplikasi iWare Perizinan Anda
5. Railway akan mulai scan repository

### 1.3 Jangan Deploy Dulu!
- Railway mungkin langsung mulai deploy → **CANCEL dulu**
- Kita perlu setup database dan variables dulu
- Klik **"Cancel Deployment"** jika sudah mulai

---

## 🗄️ TAHAP 2: SETUP DATABASE MYSQL (10 menit)

### 2.1 Tambah MySQL Service
1. Di Railway Dashboard, klik **"+ New"**
2. Pilih **"Database"**
3. Pilih **"Add MySQL"**
4. Tunggu 30 detik sampai MySQL service ready (status hijau)

### 2.2 Cek Credentials MySQL
1. **Klik MySQL service** (icon database)
2. Klik tab **"Variables"**
3. Anda akan lihat credentials otomatis:
   ```
   MYSQL_ROOT_PASSWORD=xxxxx
   MYSQL_DATABASE=railway
   MYSQL_USER=root
   MYSQLHOST=mysql.railway.internal
   MYSQLPORT=3306
   ```
4. **JANGAN ubah apapun** di sini, biarkan default

### 2.3 Generate Domain untuk MySQL (Optional - untuk akses eksternal)
1. Masih di MySQL service
2. Klik tab **"Settings"**
3. Scroll ke **"Networking"**
4. Klik **"Generate Domain"** (jika ingin akses dari luar Railway)
5. **Untuk production, ini TIDAK wajib** (backend akan pakai internal network)

---

## 🔧 TAHAP 3: SETUP BACKEND SERVICE (15 menit)

### 3.1 Buat Backend Service
1. Kembali ke Project Dashboard (klik nama project di atas)
2. Klik **"+ New"**
3. Pilih **"GitHub Repo"**
4. Pilih **repository yang sama**
5. Railway akan tanya: **"Root Directory"**
   - Ketik: `backend`
   - Klik **"Deploy"**

### 3.2 Set Environment Variables Backend

#### Cara 1: Menggunakan Variable Reference (RECOMMENDED)

1. **Klik Backend Service** (bukan MySQL)
2. Klik tab **"Variables"**
3. **Hapus semua variables yang salah** (jika ada):
   - Klik icon **"..."** → **"Remove"** untuk setiap variable yang salah

4. **Tambah Reference ke MySQL:**
   - Klik **"+ New Variable"**
   - Pilih tab **"Add Reference"**
   - Pilih service **"MySQL"**
   - Centang **SEMUA** variables:
     - ✅ MYSQLDATABASE
     - ✅ MYSQLHOST
     - ✅ MYSQLPASSWORD
     - ✅ MYSQLPORT
     - ✅ MYSQLUSER
   - Klik **"Add"**

5. **Tambah Variables Manual:**
   - Klik **"+ New Variable"** → tab **"Add Variable"**
   - Tambah satu per satu:

   **Variable 1:**
   ```
   Name: NODE_ENV
   Value: production
   ```

   **Variable 2:**
   ```
   Name: PORT
   Value: 5000
   ```

   **Variable 3:**
   ```
   Name: JWT_SECRET
   Value: b5f51c7f57f3f0d20b421741b7ed371fc1686d67a0b43d45f2879a892b81088d30ff54563b270beaf5b8d95e09cda72c1b5d22b71b50a21d35b28238d8284abe8
   ```

   **Variable 4:**
   ```
   Name: FRONTEND_URL
   Value: http://localhost:3000
   ```
   *(Kita akan update ini nanti setelah frontend deploy)*

#### Cara 2: Menggunakan RAW Editor (Alternative)

1. Klik tab **"Variables"**
2. Klik **"RAW Editor"** (kanan atas)
3. **Hapus semua**, paste ini:

```
NODE_ENV=production
PORT=5000
MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}
MYSQLHOST=${{MySQL.MYSQLHOST}}
MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}
MYSQLPORT=${{MySQL.MYSQLPORT}}
MYSQLUSER=${{MySQL.MYSQLUSER}}
JWT_SECRET=b5f51c7f57f3f0d20b421741b7ed371fc1686d67a0b43d45f2879a892b81088d30ff54563b270beaf5b8d95e09cda72c1b5d22b71b50a21d35b28238d8284abe8
FRONTEND_URL=http://localhost:3000
```

4. Klik **"Update Variables"**

### 3.3 Tunggu Backend Deploy
1. Railway akan otomatis redeploy setelah variables diubah
2. Klik tab **"Deployments"**
3. Tunggu sampai status **"Success"** (hijau) - sekitar 2-3 menit
4. Jika gagal (merah), klik deployment → lihat logs untuk error

### 3.4 Verifikasi Backend Connection
1. Klik deployment yang success
2. **Lihat logs**, cari text:
   ```
   ✅ MySQL connected successfully!
   📍 Host: mysql.railway.internal
   📍 Database: railway
   🚀 Server berjalan di port 5000
   ```

3. Jika ada error `ECONNREFUSED` atau `ENOTFOUND`:
   - ❌ Variables salah, ulangi step 3.2
   - Pastikan pakai `${{MySQL.MYSQLHOST}}` bukan hardcoded

### 3.5 Generate Public Domain untuk Backend
1. Masih di Backend Service
2. Klik tab **"Settings"**
3. Scroll ke **"Networking"**
4. Klik **"Generate Domain"**
5. Copy domain yang muncul (contoh: `backend-production-xxxx.up.railway.app`)
6. **SIMPAN domain ini**, kita butuh nanti

### 3.6 Test Backend API
1. Buka browser
2. Akses: `https://[backend-domain]/api/health`
3. Seharusnya muncul:
   ```json
   {
     "status": "OK",
     "timestamp": "2026-01-20T...",
     "database": "Connected"
   }
   ```

---

## 📊 TAHAP 4: INITIALIZE DATABASE (5 menit)

Sekarang kita perlu buat tables di database.

### 4.1 Install Railway CLI (Jika Belum)

**Windows:**
```cmd
npm install -g @railway/cli
```

**Mac/Linux:**
```bash
npm install -g @railway/cli
```

### 4.2 Login Railway CLI
```cmd
railway login
```
- Browser akan terbuka
- Klik **"Authorize"**
- Kembali ke terminal

### 4.3 Link ke Project
```cmd
railway link
```
- Pilih project Anda dari list
- Pilih **Backend service** (bukan MySQL)

### 4.4 Run Database Initialization
```cmd
cd backend
railway run node scripts/init-railway-db.js
```

**Output yang benar:**
```
🔄 Connecting to Railway MySQL...
✅ Connected to MySQL successfully!
📊 Creating tables...
✅ Table 'users' created
✅ Table 'pengajuan' created
✅ Table 'dokumen' created
✅ Admin user created
✅ Database initialization complete!
```

**Jika error:**
- `ECONNREFUSED` → Variables backend salah
- `Access denied` → Password MySQL salah
- `Unknown database` → Database name salah (harus 'railway')

---

## 🎨 TAHAP 5: SETUP FRONTEND SERVICE (10 menit)

### 5.1 Buat Frontend Service
1. Kembali ke Project Dashboard
2. Klik **"+ New"**
3. Pilih **"GitHub Repo"**
4. Pilih **repository yang sama**
5. Railway akan tanya: **"Root Directory"**
   - Ketik: `frontend`
   - Klik **"Deploy"**

### 5.2 Set Environment Variables Frontend
1. **Klik Frontend Service**
2. Klik tab **"Variables"**
3. Klik **"+ New Variable"**

**Variable 1:**
```
Name: REACT_APP_API_URL
Value: https://[backend-domain-anda]
```
*(Ganti dengan domain backend dari step 3.5)*

**Contoh:**
```
REACT_APP_API_URL=https://backend-production-abc123.up.railway.app
```

4. Klik **"Add"**

### 5.3 Tunggu Frontend Deploy
1. Klik tab **"Deployments"**
2. Tunggu sampai status **"Success"** (hijau) - sekitar 3-5 menit
3. Frontend build lebih lama karena compile React

### 5.4 Generate Public Domain untuk Frontend
1. Masih di Frontend Service
2. Klik tab **"Settings"**
3. Scroll ke **"Networking"**
4. Klik **"Generate Domain"**
5. Copy domain yang muncul (contoh: `frontend-production-xxxx.up.railway.app`)

### 5.5 Test Frontend
1. Buka browser
2. Akses: `https://[frontend-domain]`
3. Seharusnya muncul halaman login iWare Perizinan

---

## 🔗 TAHAP 6: UPDATE CORS & FRONTEND_URL (5 menit)

Sekarang kita perlu update backend agar terima request dari frontend.

### 6.1 Update FRONTEND_URL di Backend
1. **Klik Backend Service**
2. Klik tab **"Variables"**
3. **Cari variable `FRONTEND_URL`**
4. Klik icon **"..."** → **"Edit"**
5. Ganti value dengan domain frontend:
   ```
   https://[frontend-domain-anda]
   ```
6. Klik **"Update"**

### 6.2 Tunggu Backend Redeploy
1. Railway akan otomatis redeploy backend
2. Tunggu sampai deployment success (1-2 menit)

### 6.3 Test Login
1. Buka frontend: `https://[frontend-domain]`
2. Login dengan:
   ```
   Username: admin
   Password: admin123
   ```
3. Jika berhasil → **SELAMAT! Deploy berhasil!** 🎉

---

## ✅ CHECKLIST FINAL

Pastikan semua ini sudah beres:

### Database (MySQL)
- [ ] MySQL service running (status hijau)
- [ ] Tables sudah dibuat (users, pengajuan, dokumen)
- [ ] Admin user sudah ada

### Backend
- [ ] Backend service running (status hijau)
- [ ] Environment variables sudah diset (9 variables)
- [ ] Public domain sudah digenerate
- [ ] Health endpoint works: `/api/health`
- [ ] Logs tidak ada error connection

### Frontend
- [ ] Frontend service running (status hijau)
- [ ] REACT_APP_API_URL sudah diset
- [ ] Public domain sudah digenerate
- [ ] Halaman login bisa diakses
- [ ] Login berhasil dengan admin/admin123

---

## 🎯 DOMAIN ANDA

Catat domain Anda di sini untuk referensi:

```
Backend:  https://________________________________
Frontend: https://________________________________
MySQL:    mysql.railway.internal (internal only)
```

---

## 🆘 TROUBLESHOOTING

### Backend Error: "ECONNREFUSED ::1:3306"
**Penyebab:** Variables MySQL salah atau tidak diset

**Solusi:**
1. Cek Backend → Variables
2. Pastikan `MYSQLHOST=${{MySQL.MYSQLHOST}}` (bukan localhost)
3. Pastikan semua 5 MySQL variables ada

### Frontend Error: "Network Error" saat login
**Penyebab:** CORS atau REACT_APP_API_URL salah

**Solusi:**
1. Cek Frontend → Variables → `REACT_APP_API_URL`
2. Pastikan URL backend benar (dengan https://)
3. Cek Backend → Variables → `FRONTEND_URL`
4. Pastikan URL frontend benar (dengan https://)

### Database Error: "Unknown database 'railway'"
**Penyebab:** Database belum diinisialisasi

**Solusi:**
```cmd
cd backend
railway run node scripts/init-railway-db.js
```

### Frontend Build Error: "Module not found"
**Penyebab:** Dependencies tidak terinstall

**Solusi:**
1. Frontend → Settings → scroll ke "Build Command"
2. Pastikan: `npm install && npm run build`
3. Redeploy: Deployments → klik "..." → "Redeploy"

### Backend Crash: "Port already in use"
**Penyebab:** PORT variable salah

**Solusi:**
1. Backend → Variables
2. Pastikan `PORT=5000` (bukan $PORT atau 3000)

---

## 📚 NEXT STEPS

Setelah deploy berhasil:

1. **Ganti Password Admin:**
   - Login sebagai admin
   - Pergi ke Settings/Profile
   - Ganti password default

2. **Setup Custom Domain (Optional):**
   - Railway Settings → Custom Domain
   - Tambah domain Anda sendiri

3. **Setup Monitoring:**
   - Railway → Metrics
   - Monitor CPU, Memory, Network usage

4. **Backup Database:**
   - MySQL → Settings → Backups
   - Enable automatic backups

5. **Setup Environment untuk Development:**
   - Buat project Railway terpisah untuk staging/dev
   - Jangan test di production!

---

## 🎉 SELESAI!

Aplikasi iWare Perizinan Anda sudah live di Railway!

**Share link ini ke user:**
```
https://[frontend-domain-anda]
```

**Untuk support dan update:**
- Lihat logs: Railway → Service → Deployments → View Logs
- Monitor metrics: Railway → Service → Metrics
- Update code: Push ke GitHub → Railway auto-deploy

---

**Dibuat dengan ❤️ untuk deployment yang mudah**
