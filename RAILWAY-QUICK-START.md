# Railway Quick Start Guide 🚀

## Deploy Backend ke Railway (Auto-Migration Enabled)

### 1️⃣ Setup Railway Project

1. **Login ke Railway**
   - Buka https://railway.app
   - Login dengan GitHub

2. **Create New Project**
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository ini

3. **Add MySQL Database**
   - Klik "New" → "Database" → "Add MySQL"
   - Railway akan auto-generate credentials

### 2️⃣ Configure Backend Service

1. **Set Root Directory**
   - Klik service backend
   - Settings → Root Directory: `backend`

2. **Environment Variables** (Auto-generated dari MySQL)
   Railway akan otomatis set:
   - ✅ `MYSQLHOST`
   - ✅ `MYSQLPORT`
   - ✅ `MYSQLUSER`
   - ✅ `MYSQLDATABASE`
   - ✅ `MYSQLPASSWORD`

3. **Tambah Environment Variables Manual**
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

   Generate JWT Secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

### 3️⃣ Deploy!

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Enable auto-migration for Railway"
   git push
   ```

2. **Railway Auto-Deploy**
   - Railway akan otomatis detect push
   - Build & deploy backend
   - **Database otomatis ter-setup!** ✨

3. **Cek Logs**
   - Klik "View Logs"
   - Pastikan muncul:
   ```
   ✅ Tabel karyawan berhasil dibuat
   ✅ Tabel quota_bulanan berhasil dibuat
   ✅ Auto-import karyawan berhasil
   🚀 Server berjalan di port 5000
   ```

### 4️⃣ Get Backend URL

- Klik "Settings" → "Networking"
- Copy "Public URL": `https://xxx.up.railway.app`
- Gunakan URL ini untuk frontend

### 5️⃣ Test Backend

```bash
# Health check
curl https://xxx.up.railway.app/api/health

# Get karyawan
curl https://xxx.up.railway.app/api/karyawan
```

---

## Deploy Frontend ke Vercel

### 1️⃣ Setup Vercel Project

1. **Login ke Vercel**
   - Buka https://vercel.com
   - Login dengan GitHub

2. **Import Project**
   - Klik "Add New" → "Project"
   - Import repository ini

### 2️⃣ Configure Frontend

1. **Set Root Directory**
   - Root Directory: `frontend`
   - Framework Preset: `Create React App`

2. **Environment Variables**
   ```
   REACT_APP_API_URL=https://xxx.up.railway.app
   ```
   (Ganti dengan Railway backend URL)

3. **Deploy**
   - Klik "Deploy"
   - Tunggu build selesai

### 3️⃣ Update Backend CORS

Setelah dapat Vercel URL, update Railway environment:

```
FRONTEND_URL=https://your-app.vercel.app
```

Redeploy backend di Railway.

---

## ✅ Verification Checklist

### Backend (Railway)
- [ ] MySQL database running
- [ ] Backend service deployed
- [ ] Logs menunjukkan database initialized
- [ ] `/api/health` returns OK
- [ ] `/api/karyawan` returns data

### Frontend (Vercel)
- [ ] Build successful
- [ ] Environment variables set
- [ ] Login page accessible
- [ ] Can login with admin/admin123
- [ ] Dashboard loads properly

### Integration
- [ ] Frontend can call backend API
- [ ] CORS working properly
- [ ] Form pengajuan works
- [ ] HRD dashboard shows data

---

## 🐛 Common Issues

### Backend tidak bisa connect ke database
**Solusi:** Pastikan MySQL service sudah running di Railway

### CORS Error
**Solusi:** 
1. Cek `FRONTEND_URL` di Railway environment
2. Pastikan URL Vercel sudah benar
3. Redeploy backend

### Database kosong setelah deploy
**Solusi:**
1. Cek logs Railway untuk error
2. Jika auto-import gagal, jalankan manual:
   ```bash
   railway run npm run import-karyawan
   ```

### 404 Not Found di frontend
**Solusi:**
1. Pastikan `_redirects` file ada di `frontend/public/`
2. Redeploy Vercel

---

## 🔄 Update & Redeploy

### Update Code
```bash
git add .
git commit -m "Your update message"
git push
```

Railway & Vercel akan auto-deploy!

### Manual Redeploy
- **Railway:** Klik "Deploy" → "Redeploy"
- **Vercel:** Klik "Deployments" → "Redeploy"

---

## 📊 Monitoring

### Railway Logs
```bash
railway logs --service backend
```

### Vercel Logs
- Dashboard → Project → Deployments → View Function Logs

---

## 💡 Tips

1. **Use Railway CLI untuk development**
   ```bash
   npm install -g @railway/cli
   railway login
   railway link
   railway run npm run dev
   ```

2. **Environment Variables Sync**
   - Gunakan Railway CLI untuk sync env vars
   - Atau copy dari Railway dashboard

3. **Database Backup**
   - Railway MySQL → Settings → Backup
   - Schedule regular backups

4. **Cost Optimization**
   - Railway: $5/month untuk hobby plan
   - Vercel: Free untuk personal projects
   - Monitor usage di dashboard

---

## 🎉 Done!

Aplikasi sudah live di:
- **Backend:** https://xxx.up.railway.app
- **Frontend:** https://xxx.vercel.app

Login dengan:
- Username: `admin`
- Password: `admin123`

**Jangan lupa ganti password default!**

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Cek `RAILWAY-SETUP.md` untuk troubleshooting detail
