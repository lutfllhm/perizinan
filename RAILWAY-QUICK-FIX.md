# 🚨 Railway Quick Fix - Tabel Belum Muncul

## Masalah: Hanya 2 Tabel (users & pengajuan)

Jika setelah deploy Railway hanya ada 2 tabel, ikuti langkah ini:

---

## ✅ Solusi 1: Force Migration (RECOMMENDED)

### Via Railway CLI

```bash
# 1. Install Railway CLI (jika belum)
npm install -g @railway/cli

# 2. Login
railway login

# 3. Link ke project
cd backend
railway link

# 4. Run force migration
railway run npm run force-migration

# 5. Import karyawan
railway run npm run import-karyawan

# 6. Restart service
railway restart
```

**Expected Output:**
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
📊 Current karyawan count: 0
✅ FORCE MIGRATION SELESAI!
```

---

## ✅ Solusi 2: Via Railway Dashboard

### 1. Buka Railway Shell

1. Login ke https://railway.app
2. Pilih project backend
3. Tab **Deployments**
4. Klik deployment terbaru
5. Klik **Shell** (icon terminal)

### 2. Run Commands

```bash
# Force migration
npm run force-migration

# Import karyawan
npm run import-karyawan
```

### 3. Verify

```bash
# Check tables
mysql -h $MYSQLHOST -P $MYSQLPORT -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE -e "SHOW TABLES;"

# Check karyawan count
mysql -h $MYSQLHOST -P $MYSQLPORT -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE -e "SELECT COUNT(*) FROM karyawan;"
```

### 4. Restart Service

Klik **Settings** → **Restart**

---

## ✅ Solusi 3: Manual SQL (Last Resort)

### Via Railway MySQL Query Tab

1. Klik MySQL service
2. Tab **Query**
3. Copy-paste SQL ini:

```sql
-- 1. Create karyawan table
CREATE TABLE IF NOT EXISTS karyawan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  kantor VARCHAR(100) NOT NULL,
  nama VARCHAR(100) NOT NULL,
  jabatan VARCHAR(100) NOT NULL,
  departemen VARCHAR(100) NOT NULL,
  no_telp VARCHAR(20),
  jatah_cuti INT DEFAULT 12,
  sisa_cuti INT DEFAULT 12,
  tahun_cuti INT DEFAULT YEAR(CURDATE()),
  status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_karyawan (kantor, nama)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. Create quota_bulanan table
CREATE TABLE IF NOT EXISTS quota_bulanan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  karyawan_id INT NOT NULL,
  bulan INT NOT NULL,
  tahun INT NOT NULL,
  pulang_cepat INT DEFAULT 0,
  datang_terlambat INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_quota (karyawan_id, bulan, tahun),
  FOREIGN KEY (karyawan_id) REFERENCES karyawan(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3. Add columns to pengajuan
ALTER TABLE pengajuan ADD COLUMN IF NOT EXISTS karyawan_id INT;
ALTER TABLE pengajuan ADD COLUMN IF NOT EXISTS kantor VARCHAR(100);
ALTER TABLE pengajuan ADD COLUMN IF NOT EXISTS jabatan VARCHAR(100);
ALTER TABLE pengajuan ADD COLUMN IF NOT EXISTS departemen VARCHAR(100);

-- 4. Add foreign key (skip if error)
ALTER TABLE pengajuan 
ADD CONSTRAINT fk_pengajuan_karyawan 
FOREIGN KEY (karyawan_id) REFERENCES karyawan(id) ON DELETE SET NULL;

-- 5. Verify
SHOW TABLES;
DESCRIBE pengajuan;
```

4. Klik **Run**
5. Kemudian import karyawan via Railway CLI:

```bash
railway run npm run import-karyawan
```

---

## 🔍 Debugging: Cek Logs Railway

### Via Railway CLI
```bash
railway logs --service backend
```

### Via Dashboard
1. Klik Backend service
2. Tab **Deployments**
3. Klik deployment terbaru
4. Klik **View Logs**

### Cari Log Ini:

**✅ Success:**
```
🔄 Initializing database tables...
📝 Creating karyawan table...
✅ Tabel karyawan berhasil dibuat
📝 Creating quota_bulanan table...
✅ Tabel quota_bulanan berhasil dibuat
```

**❌ Error:**
```
❌ Error during table initialization: ...
❌ Database connection failed
```

---

## 🐛 Common Issues

### Issue 1: "Table already exists"
**Artinya:** Tabel sudah dibuat, tapi mungkin kosong

**Solution:**
```bash
railway run npm run import-karyawan
```

### Issue 2: "Cannot add foreign key constraint"
**Artinya:** Tabel karyawan belum ada

**Solution:**
```bash
railway run npm run force-migration
```

### Issue 3: "Access denied"
**Artinya:** Environment variables salah

**Solution:**
1. Cek Railway → MySQL service → Variables
2. Copy semua variables
3. Paste ke Backend service → Variables
4. Redeploy

### Issue 4: Server start tapi tabel tidak dibuat
**Artinya:** Auto-migration tidak jalan atau error

**Solution:**
```bash
# Check logs
railway logs

# Force migration
railway run npm run force-migration

# Restart
railway restart
```

---

## ✅ Verification Checklist

Setelah fix, verify:

```bash
# 1. Check tables
railway run node -e "
const mysql = require('mysql2/promise');
(async () => {
  const db = await mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE
  });
  const [tables] = await db.query('SHOW TABLES');
  console.log('Tables:', tables);
  await db.end();
})();
"

# 2. Check karyawan count
railway run node -e "
const mysql = require('mysql2/promise');
(async () => {
  const db = await mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE
  });
  const [rows] = await db.query('SELECT COUNT(*) as count FROM karyawan');
  console.log('Karyawan count:', rows[0].count);
  await db.end();
})();
"

# 3. Test API
curl https://your-app.up.railway.app/api/karyawan
```

**Expected:**
- ✅ 4 tables: users, pengajuan, karyawan, quota_bulanan
- ✅ 200+ karyawan
- ✅ API returns karyawan data

---

## 🔄 Redeploy dengan Auto-Migration

Setelah fix, untuk deploy selanjutnya:

```bash
# 1. Push code baru
git add .
git commit -m "Update code"
git push

# 2. Railway auto-deploy
# 3. Auto-migration akan jalan otomatis
# 4. Tabel akan tetap ada (tidak hilang)
```

**Auto-migration bersifat idempotent:**
- Tidak akan duplicate tabel
- Tidak akan duplicate data
- Aman dijalankan berkali-kali

---

## 📞 Still Not Working?

### Option 1: Fresh Start

```bash
# 1. Drop all tables (via Railway MySQL Query)
DROP TABLE IF EXISTS quota_bulanan;
DROP TABLE IF EXISTS karyawan;
DROP TABLE IF EXISTS pengajuan;
DROP TABLE IF EXISTS users;

# 2. Redeploy Railway
railway restart

# 3. Auto-migration akan create semua dari awal
```

### Option 2: Contact Support

Jika masih error, kirim info ini:

1. **Railway Logs:**
   ```bash
   railway logs > logs.txt
   ```

2. **Environment Variables:**
   ```bash
   railway variables > env.txt
   ```

3. **Database Tables:**
   ```sql
   SHOW TABLES;
   ```

4. **Error Message:**
   Copy full error dari logs

---

## 🎯 Success Criteria

Setelah fix berhasil:

- [x] Railway MySQL menunjukkan 4 tabel
- [x] Tabel karyawan berisi 200+ data
- [x] API `/api/karyawan` returns data
- [x] Frontend dropdown karyawan terisi
- [x] Form pengajuan bisa submit
- [x] HRD dashboard shows karyawan table

---

## 💡 Prevention

Untuk mencegah masalah ini di future:

1. **Always check logs** setelah deploy
2. **Verify tables** via Railway MySQL Query
3. **Test API endpoints** setelah deploy
4. **Keep auto-migration code** di server.js
5. **Don't delete migration scripts**

---

Happy fixing! 🔧✨
