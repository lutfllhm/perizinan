# 🚨 FIX RAILWAY SEKARANG - 3 Langkah Mudah

## Masalah: Tabel karyawan & quota_bulanan belum muncul di Railway

---

## ⚡ QUICK FIX (5 Menit)

### Langkah 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Langkah 2: Login & Link

```bash
# Login
railway login

# Link ke project (pilih project backend Anda)
cd backend
railway link
```

### Langkah 3: Run Migration

```bash
# Force migration
railway run npm run force-migration

# Import karyawan
railway run npm run import-karyawan

# Restart service
railway restart
```

---

## ✅ Verify

### Cek via Railway Dashboard

1. Buka https://railway.app
2. Klik MySQL service
3. Tab **Database** → **Data**
4. Harus ada 4 tabel:
   - ✅ users
   - ✅ pengajuan
   - ✅ karyawan ⭐
   - ✅ quota_bulanan ⭐

### Test API

```bash
# Ganti dengan Railway URL Anda
curl https://your-app.up.railway.app/api/karyawan
```

Harus return array of karyawan (200+ data).

---

## 🎯 Expected Output

### Force Migration:
```
🚀 Starting FORCE MIGRATION...
✅ Database connected
📊 Existing tables: [ 'pengajuan', 'users' ]
📝 Creating karyawan table...
✅ Tabel karyawan berhasil dibuat
📝 Creating quota_bulanan table...
✅ Tabel quota_bulanan berhasil dibuat
📝 Updating pengajuan table...
✅ Kolom karyawan_id ditambahkan
✅ Kolom kantor ditambahkan
✅ Kolom jabatan ditambahkan
✅ Kolom departemen ditambahkan
✅ Foreign key karyawan_id ditambahkan
✅ FORCE MIGRATION SELESAI!
```

### Import Karyawan:
```
🔄 Memulai import data karyawan...
📍 Import karyawan RBM-IWARE SURABAYA...
📍 Import karyawan SBA-WMP...
📍 Import karyawan RBM-IWARE JAKARTA...
...
✅ Import selesai!
📊 Total berhasil: 200+
```

---

## 🐛 Troubleshooting

### Error: "railway: command not found"
**Solution:** Install Railway CLI dulu
```bash
npm install -g @railway/cli
```

### Error: "Not logged in"
**Solution:** Login dulu
```bash
railway login
```

### Error: "No project linked"
**Solution:** Link ke project
```bash
cd backend
railway link
```
Pilih project backend Anda dari list.

### Error: "Cannot connect to database"
**Solution:** Cek environment variables
```bash
railway variables
```
Pastikan ada: MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLDATABASE, MYSQLPASSWORD

### Error: "Table already exists"
**Artinya:** Tabel sudah dibuat! Skip error ini, lanjut ke import karyawan.

---

## 📝 Alternative: Via Railway Dashboard

Jika tidak bisa install Railway CLI:

### 1. Buka Railway Shell
1. Login ke https://railway.app
2. Klik Backend service
3. Tab **Deployments**
4. Klik deployment terbaru
5. Klik **Shell** (icon terminal di kanan atas)

### 2. Run Commands di Shell
```bash
npm run force-migration
npm run import-karyawan
```

### 3. Restart
Klik **Settings** → **Restart**

---

## 🎉 Done!

Setelah fix:
- ✅ 4 tabel di Railway MySQL
- ✅ 200+ karyawan data
- ✅ API `/api/karyawan` works
- ✅ Frontend dropdown terisi
- ✅ Form pengajuan bisa submit

---

## 🔄 Future Deploys

Setelah fix ini, deploy selanjutnya akan otomatis!

```bash
# Push code baru
git add .
git commit -m "Your changes"
git push

# Railway auto-deploy
# Auto-migration akan jalan otomatis
# Tabel tidak akan hilang
```

---

## 📞 Need More Help?

Baca dokumentasi lengkap:
- **[RAILWAY-QUICK-FIX.md](RAILWAY-QUICK-FIX.md)** - Detailed troubleshooting
- **[RAILWAY-SETUP.md](RAILWAY-SETUP.md)** - Complete setup guide
- **[RAILWAY-ENV-CHECKLIST.md](RAILWAY-ENV-CHECKLIST.md)** - Environment variables

---

**Selamat mencoba! 🚀**
