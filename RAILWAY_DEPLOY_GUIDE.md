# 🚀 Panduan Deploy ke Railway

## 📋 Persiapan

### 1. Install Railway CLI (Opsional)
```bash
npm install -g @railway/cli
railway login
```

## 🗄️ Deploy Database MySQL

### 1. Buat MySQL Service
1. Buka [Railway Dashboard](https://railway.app)
2. Klik **New Project**
3. Pilih **Deploy MySQL**
4. Tunggu hingga deployment selesai

### 2. Catat Kredensial MySQL
Railway akan otomatis generate environment variables:
- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`

### 3. Inisialisasi Database
Setelah MySQL service running, jalankan init script:

**Via Railway CLI:**
```bash
railway run npm run init-railway-db
```

**Via Railway Dashboard:**
1. Buka MySQL service
2. Klik tab **Settings**
3. Scroll ke **Service Variables**
4. Tambahkan temporary variable: `RUN_INIT=true`
5. Deploy ulang service

## 🔧 Deploy Backend

### 1. Buat Backend Service
1. Di project yang sama, klik **New Service**
2. Pilih **GitHub Repo** (atau Empty Service jika manual)
3. Connect repository Anda
4. Set **Root Directory**: `backend`

### 2. Configure Environment Variables
Di Backend Service > Variables, tambahkan:

```env
NODE_ENV=production
PORT=5000

# JWT Secret (Generate baru untuk production!)
JWT_SECRET=your-generated-secret-here

# Frontend URL (akan diisi setelah deploy frontend)
FRONTEND_URL=https://your-frontend-url.up.railway.app
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Link ke MySQL Service
1. Di Backend Service, klik **Variables**
2. Klik **Reference** > Pilih MySQL service
3. Railway akan otomatis inject MySQL variables

### 4. Deploy Backend
```bash
cd backend
git add .
git commit -m "Deploy backend to Railway"
git push
```

Railway akan otomatis detect dan deploy.

### 5. Dapatkan Backend URL
1. Buka Backend Service
2. Klik **Settings** > **Networking**
3. Klik **Generate Domain**
4. Catat URL: `https://your-backend-name.up.railway.app`

## 🎨 Deploy Frontend

### 1. Update Environment Variables
Edit `frontend/.env.production`:
```env
REACT_APP_API_URL=https://your-backend-name.up.railway.app
```

### 2. Buat Frontend Service
1. Klik **New Service**
2. Pilih **GitHub Repo**
3. Set **Root Directory**: `frontend`

### 3. Configure Build Settings
Railway akan otomatis detect React app. Pastikan:
- **Build Command**: `npm ci --legacy-peer-deps && npm run build`
- **Start Command**: `npm run serve`

### 4. Deploy Frontend
```bash
cd frontend
git add .
git commit -m "Deploy frontend to Railway"
git push
```

### 5. Dapatkan Frontend URL
1. Buka Frontend Service
2. Klik **Settings** > **Networking**
3. Klik **Generate Domain**
4. Catat URL: `https://your-frontend-name.up.railway.app`

### 6. Update Backend CORS
Kembali ke Backend Service > Variables, update:
```env
FRONTEND_URL=https://your-frontend-name.up.railway.app
```

## ✅ Verifikasi Deployment

### 1. Test Backend
```bash
curl https://your-backend-name.up.railway.app/api/health
```

Response:
```json
{
  "status": "OK",
  "message": "Server berjalan dengan baik",
  "database": "MySQL"
}
```

### 2. Test Frontend
Buka browser: `https://your-frontend-name.up.railway.app`

### 3. Test Login
- Username: `admin`
- Password: `admin123`

## 🔄 Update Deployment

### Auto Deploy (Recommended)
Railway akan otomatis deploy saat push ke GitHub:
```bash
git add .
git commit -m "Update feature"
git push
```

### Manual Deploy via CLI
```bash
# Backend
cd backend
railway up

# Frontend
cd frontend
railway up
```

## 🐛 Troubleshooting

### Backend tidak connect ke MySQL
1. Pastikan MySQL service sudah running
2. Cek Variables di Backend service sudah ter-link ke MySQL
3. Lihat logs: Backend Service > **Deployments** > Latest > **View Logs**

### Frontend tidak bisa akses Backend
1. Pastikan `REACT_APP_API_URL` sudah benar (tanpa `/api`)
2. Pastikan Backend `FRONTEND_URL` sudah diset
3. Clear browser cache dan reload

### Database belum ter-inisialisasi
Jalankan init script:
```bash
railway run npm run init-railway-db
```

### CORS Error
Pastikan di Backend `.env.production`:
```env
FRONTEND_URL=https://your-frontend-name.up.railway.app
```

## 📊 Monitoring

### View Logs
```bash
# Backend logs
railway logs --service backend

# Frontend logs
railway logs --service frontend

# MySQL logs
railway logs --service mysql
```

### View Metrics
Railway Dashboard > Service > **Metrics**

## 🔐 Security Checklist

- ✅ Generate JWT_SECRET baru untuk production
- ✅ Jangan commit `.env` files
- ✅ Set FRONTEND_URL untuk CORS
- ✅ Ganti password default admin setelah deploy
- ✅ Enable Railway's built-in SSL (otomatis)

## 💰 Estimasi Biaya

Railway Free Tier:
- $5 credit per bulan
- Cukup untuk development/testing
- 3 services (MySQL + Backend + Frontend)

Untuk production, pertimbangkan upgrade ke:
- **Hobby Plan**: $5/month per service
- **Pro Plan**: $20/month per service

## 📚 Resources

- [Railway Docs](https://docs.railway.app)
- [Railway MySQL Guide](https://docs.railway.app/databases/mysql)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)

---

**🎉 Selamat! Aplikasi Anda sudah siap di Railway!**

Default Login:
- Username: `admin`
- Password: `admin123`

**⚠️ PENTING: Ganti password default setelah login pertama kali!**
