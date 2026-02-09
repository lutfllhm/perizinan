# 🚂 Railway Setup Ulang - Langkah Demi Langkah

## ❌ Masalah Saat Ini
- Login gagal dengan error 404
- Server tidak jalan dengan benar
- Routes tidak ter-load

## ✅ Solusi: Setup Ulang Railway Service

### Langkah 1: Hapus Service Backend Lama (Opsional)

Jika ingin mulai dari awal:
1. Railway Dashboard → Klik service backend
2. Settings → Scroll ke bawah
3. Klik "Delete Service"
4. Confirm

### Langkah 2: Buat Service Backend Baru

1. **Railway Dashboard → New → GitHub Repo**
2. **Pilih repository:** `perizinan`
3. **Klik "Add variables"** (skip dulu, nanti kita set)

### Langkah 3: Configure Service

**PENTING - Set ini dengan BENAR:**

1. **Settings → General:**
   - Service Name: `backend` (atau nama lain)

2. **Settings → Source:**
   - Root Directory: `backend` ← **PENTING!**
   - Watch Paths: (kosongkan)

3. **Settings → Deploy:**
   - Build Command: (kosongkan, biar pakai npm install default)
   - Start Command: `node server-final.js` ← **PENTING!**
   - Restart Policy: On Failure

4. **Settings → Networking:**
   - Generate Domain (akan dapat URL seperti xxx.up.railway.app)

### Langkah 4: Set Environment Variables

**Variables → Add Variable:**

Dari MySQL service (copy semua):
```
MYSQLHOST=containers-us-west-xxx.railway.app
MYSQLPORT=6379
MYSQLUSER=root
MYSQLDATABASE=railway
MYSQLPASSWORD=xxxxxxxxxxxxx
```

Tambah manual:
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=https://your-app.vercel.app
```

**Cara generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Langkah 5: Deploy

1. Klik "Deploy" atau tunggu auto-deploy
2. Monitor logs di "Deployments" → "View Logs"

### Langkah 6: Verify Logs

**Logs HARUS menunjukkan:**
```
🚀 FINAL SERVER STARTING...
📍 Port: 5000
✅ Database connected
🔄 Initializing database tables...
✅ Table users OK
✅ Table pengajuan OK
✅ Table karyawan OK
✅ Table quota_bulanan OK
✅ Default admin user created (admin/admin123)
✅ Database initialization complete!
🚀 Server running on port 5000
✅ Server ready
```

**Jika TIDAK muncul logs di atas:**
- ❌ Root Directory salah
- ❌ Start Command salah
- ❌ File server-final.js tidak ada

### Langkah 7: Test API

```bash
# Test health
curl https://your-backend.up.railway.app/api/health

# Expected:
{
  "status": "OK",
  "message": "Server berjalan dengan baik"
}
```

### Langkah 8: Test Login

```bash
curl -X POST https://your-backend.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Expected:
{
  "message": "Login berhasil",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "nama": "Administrator",
    "role": "admin"
  }
}
```

### Langkah 9: Update Vercel Frontend

**Vercel → Settings → Environment Variables:**
```
REACT_APP_API_URL=https://your-backend.up.railway.app
```

Redeploy Vercel.

### Langkah 10: Test Login dari Frontend

1. Buka https://your-app.vercel.app
2. Login dengan:
   - Username: `admin`
   - Password: `admin123`
3. Harus berhasil masuk ke dashboard

---

## 🐛 Troubleshooting

### Issue: Logs tidak muncul sama sekali

**Penyebab:** Root Directory salah

**Solusi:**
1. Settings → Source → Root Directory
2. Ketik: `backend` (tanpa slash, tanpa quotes)
3. Save
4. Redeploy

### Issue: Error "Cannot find module './server-final.js'"

**Penyebab:** Start Command salah atau file tidak ada

**Solusi:**
1. Pastikan file `backend/server-final.js` ada di GitHub
2. Settings → Deploy → Start Command: `node server-final.js`
3. Redeploy

### Issue: Database connection failed

**Penyebab:** Environment variables tidak ter-set

**Solusi:**
1. Copy semua variables dari MySQL service
2. Paste ke Backend service variables
3. Redeploy

### Issue: 404 Not Found

**Penyebab:** Server tidak jalan atau routes tidak ter-load

**Solusi:**
1. Cek logs - harus ada "✅ Server ready"
2. Jika tidak ada, cek Root Directory dan Start Command
3. Redeploy

---

## 📋 Checklist Setup

- [ ] Service backend dibuat
- [ ] Root Directory = `backend`
- [ ] Start Command = `node server-final.js`
- [ ] MySQL variables ter-copy
- [ ] JWT_SECRET ter-set
- [ ] FRONTEND_URL ter-set
- [ ] Deploy berhasil
- [ ] Logs menunjukkan "✅ Server ready"
- [ ] `/api/health` returns OK
- [ ] Login API works (test dengan curl)
- [ ] Vercel environment variable updated
- [ ] Login dari frontend works

---

## 🎯 Expected Result

Setelah semua langkah di atas:

✅ Railway backend running di `https://xxx.up.railway.app`
✅ Database tables ter-create otomatis
✅ Admin user ter-create otomatis
✅ API `/api/auth/login` works
✅ Frontend Vercel bisa login
✅ Dashboard accessible

---

## 📞 Jika Masih Gagal

**Screenshot yang dibutuhkan:**
1. Railway Settings → Source (tunjukkan Root Directory)
2. Railway Settings → Deploy (tunjukkan Start Command)
3. Railway Deployments → View Logs (full logs)
4. Railway Variables (semua environment variables)

Dengan screenshot ini, saya bisa diagnose exactly apa masalahnya.

---

## 💡 Tips

1. **Jangan edit railway.json** - sudah dihapus, pakai Dashboard settings saja
2. **Root Directory harus `backend`** - ini yang paling sering salah
3. **Start Command harus `node server-final.js`** - bukan `npm start`
4. **Cek logs setiap deploy** - pastikan ada "✅ Server ready"
5. **Test API dengan curl dulu** - sebelum test dari frontend

---

Good luck! 🚀
