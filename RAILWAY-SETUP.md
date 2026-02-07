# Setup Database di Railway

## 🚂 Langkah-Langkah Update Database v2.0

### Metode 1: Via Railway CLI (Recommended)

#### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

#### 2. Login ke Railway
```bash
railway login
```

#### 3. Link ke Project
```bash
cd backend
railway link
```
Pilih project "perizinan" atau nama project Anda.

#### 4. Jalankan Update Database
```bash
railway run npm run update-db
```

Output yang diharapkan:
```
🔄 Memulai update database...
✅ Tabel karyawan berhasil dibuat
✅ Tabel quota_bulanan berhasil dibuat
✅ Tabel pengajuan berhasil diupdate
✅ Update database selesai!
```

#### 5. Import Data Karyawan
```bash
railway run npm run import-karyawan
```

Output yang diharapkan:
```
🔄 Memulai import data karyawan...
📍 Import karyawan RBM-IWARE SURABAYA...
📍 Import karyawan SBA-WMP...
...
✅ Import selesai!
📊 Total berhasil: 200+
```

#### 6. Restart Service (Opsional)
```bash
railway restart
```

---

### Metode 2: Via Railway Dashboard (Manual)

#### 1. Buka Railway Dashboard
- Login ke https://railway.app
- Pilih project backend Anda

#### 2. Buka Shell/Terminal
- Klik service backend
- Tab **Deployments**
- Klik deployment terbaru
- Klik **View Logs** atau **Shell**

#### 3. Jalankan Command
Di shell Railway, jalankan:
```bash
npm run update-db
npm run import-karyawan
```

---

### Metode 3: Otomatis saat Deploy (Advanced)

Tambahkan di Railway **Settings** → **Deploy**:

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm run setup-db && npm start
```

⚠️ **Warning:** Ini akan menjalankan setup setiap kali deploy. Hanya gunakan untuk first-time setup, kemudian ganti kembali ke `npm start`.

---

## ✅ Verifikasi Database Berhasil

### 1. Cek Tabel Baru
Buka Railway → MySQL → **Query**:

```sql
SHOW TABLES;
```

Harus ada:
- ✅ `users`
- ✅ `pengajuan`
- ✅ `karyawan` ⭐ BARU
- ✅ `quota_bulanan` ⭐ BARU

### 2. Cek Data Karyawan
```sql
SELECT COUNT(*) FROM karyawan;
```

Harus ada 200+ karyawan.

### 3. Cek Kolom Baru di Pengajuan
```sql
DESCRIBE pengajuan;
```

Harus ada kolom baru:
- ✅ `karyawan_id`
- ✅ `kantor`
- ✅ `jabatan`
- ✅ `departemen`

---

## 🐛 Troubleshooting

### Error: "Table already exists"
Artinya tabel sudah dibuat sebelumnya. Skip error ini, lanjut ke import karyawan.

### Error: "Duplicate entry"
Artinya data karyawan sudah ada. Script akan skip dan lanjut ke data berikutnya.

### Error: "Cannot connect to database"
Cek environment variables di Railway:
- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLUSER`
- `MYSQLDATABASE`
- `MYSQLPASSWORD`

### Error: "Command not found"
Pastikan Anda di folder `backend` saat menjalankan command.

---

## 📝 Rollback (Jika Diperlukan)

Jika ada masalah dan ingin rollback:

```sql
DROP TABLE IF EXISTS quota_bulanan;
DROP TABLE IF EXISTS karyawan;

ALTER TABLE pengajuan 
  DROP COLUMN IF EXISTS karyawan_id,
  DROP COLUMN IF EXISTS kantor,
  DROP COLUMN IF EXISTS jabatan,
  DROP COLUMN IF EXISTS departemen;
```

---

## 🎯 Next Steps Setelah Setup

1. ✅ Restart Railway service
2. ✅ Test API endpoint: `https://your-app.up.railway.app/api/karyawan`
3. ✅ Update Vercel environment variable dengan Railway URL
4. ✅ Test frontend form pengajuan
5. ✅ Test HRD Dashboard → Daftar Karyawan

---

## 📞 Support

Jika ada masalah, cek logs di Railway:
```bash
railway logs
```

Atau via dashboard: **Deployments** → **View Logs**
