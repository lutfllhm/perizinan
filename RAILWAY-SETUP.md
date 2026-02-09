# Setup Database di Railway

## 🚀 Auto-Migration (Otomatis saat Deploy)

**GOOD NEWS!** Database sekarang akan otomatis ter-update saat deploy di Railway. Tidak perlu menjalankan script manual lagi!

### Apa yang Terjadi Otomatis:
✅ Tabel `karyawan` dibuat otomatis  
✅ Tabel `quota_bulanan` dibuat otomatis  
✅ Kolom baru di tabel `pengajuan` ditambahkan otomatis  
✅ Data karyawan di-import otomatis (jika tabel kosong)  
✅ User admin default dibuat otomatis  

### Cara Kerja:
Saat Railway deploy backend:
1. `npm install` → Install dependencies
2. `npm start` → Server.js dijalankan
3. Server otomatis cek dan update database sebelum start
4. Jika tabel karyawan kosong, otomatis import data
5. Server siap digunakan! 🎉

---

## 📊 Verifikasi Database Berhasil

### Cek Logs Railway
Setelah deploy, cek logs di Railway Dashboard:

```
🔄 Initializing database tables...
✅ Tabel karyawan berhasil dibuat
✅ Tabel quota_bulanan berhasil dibuat
✅ Kolom karyawan_id ditambahkan
✅ Kolom kantor ditambahkan
✅ Kolom jabatan ditambahkan
✅ Kolom departemen ditambahkan
📥 Tabel karyawan kosong, memulai auto-import...
✅ Auto-import karyawan berhasil
✅ Database tables initialized successfully!
🚀 Server berjalan di port 5000
```

### Cek via Railway MySQL Query
Buka Railway → MySQL → **Query**:

```sql
-- Cek semua tabel
SHOW TABLES;

-- Harus ada: users, pengajuan, karyawan, quota_bulanan

-- Cek jumlah karyawan
SELECT COUNT(*) FROM karyawan;

-- Harus ada 200+ karyawan

-- Cek struktur pengajuan
DESCRIBE pengajuan;

-- Harus ada kolom: karyawan_id, kantor, jabatan, departemen
```

---

## 🔧 Manual Setup (Jika Diperlukan)

Jika auto-migration gagal atau ingin manual setup:

### Metode 1: Via Railway CLI

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

#### 4. Jalankan Update Database
```bash
railway run npm run update-db
railway run npm run import-karyawan
```

---

### Metode 2: Via Railway Dashboard

#### 1. Buka Railway Dashboard
- Login ke https://railway.app
- Pilih project backend Anda

#### 2. Buka Shell/Terminal
- Klik service backend
- Tab **Deployments**
- Klik deployment terbaru
- Klik **Shell**

#### 3. Jalankan Command
```bash
npm run update-db
npm run import-karyawan
```

---

## 🐛 Troubleshooting

### Auto-import Gagal
Jika di logs muncul:
```
⚠️  Auto-import karyawan gagal: ...
💡 Jalankan manual: npm run import-karyawan
```

Solusi:
```bash
railway run npm run import-karyawan
```

### Error: "Duplicate entry"
Artinya data sudah ada. Ini normal, skip saja.

### Error: "Cannot connect to database"
Cek environment variables di Railway:
- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLUSER`
- `MYSQLDATABASE`
- `MYSQLPASSWORD`

### Database Tidak Update
1. Cek logs Railway untuk error
2. Restart service: `railway restart`
3. Atau redeploy: push commit baru ke GitHub

---

## 🎯 Testing Setelah Deploy

### 1. Test API Karyawan
```bash
curl https://your-app.up.railway.app/api/karyawan
```

Harus return list karyawan.

### 2. Test Health Check
```bash
curl https://your-app.up.railway.app/api/health
```

Harus return:
```json
{
  "status": "OK",
  "message": "Server berjalan dengan baik",
  "database": "MySQL"
}
```

### 3. Test Frontend
- Buka form pengajuan
- Pilih nama karyawan dari dropdown
- Submit form
- Cek di HRD Dashboard

---

## 📝 Rollback (Jika Diperlukan)

Jika ada masalah dan ingin rollback:

```sql
DROP TABLE IF EXISTS quota_bulanan;
DROP TABLE IF EXISTS karyawan;

ALTER TABLE pengajuan 
  DROP FOREIGN KEY IF EXISTS fk_pengajuan_karyawan;

ALTER TABLE pengajuan 
  DROP COLUMN IF EXISTS karyawan_id,
  DROP COLUMN IF EXISTS kantor,
  DROP COLUMN IF EXISTS jabatan,
  DROP COLUMN IF EXISTS departemen;
```

---

## 🔄 Re-import Data Karyawan

Jika ingin re-import data karyawan (misalnya ada update):

```bash
# Via Railway CLI
railway run npm run import-karyawan

# Atau via Railway Shell
npm run import-karyawan
```

Script akan skip data yang sudah ada (berdasarkan unique key: kantor + nama).

---

## 📞 Support

Jika ada masalah:

1. **Cek Logs Railway:**
   ```bash
   railway logs
   ```
   Atau via dashboard: **Deployments** → **View Logs**

2. **Restart Service:**
   ```bash
   railway restart
   ```

3. **Redeploy:**
   Push commit baru atau trigger manual deploy di Railway Dashboard.

---

## ✨ Keuntungan Auto-Migration

✅ **Zero Manual Work** - Deploy langsung jalan  
✅ **Idempotent** - Aman dijalankan berkali-kali  
✅ **Fast** - Tidak perlu login Railway CLI  
✅ **Reliable** - Konsisten di semua environment  
✅ **Developer Friendly** - Logs jelas dan informatif  

Happy deploying! 🚀
