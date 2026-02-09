# 📋 Cara Import Data Karyawan Lengkap ke Railway

## ✅ Yang Sudah Saya Lakukan

Saya telah membuat script import baru dengan **174 karyawan lengkap** dari data asli Anda:

### File Baru:
1. **`backend/scripts/import-real-karyawan.js`** - Script import dengan 174 karyawan
2. **`backend/IMPORT-KARYAWAN-INSTRUCTIONS.md`** - Instruksi lengkap (English)
3. File ini - Panduan dalam Bahasa Indonesia

### Data Karyawan:
- ✅ RBM-IWARE SURABAYA: 76 karyawan
- ✅ SBA-WMP: 18 karyawan  
- ✅ RBM-IWARE JAKARTA: 36 karyawan
- ✅ ILUMINDO: 13 karyawan
- ✅ RBM - LABEL: 20 karyawan
- ✅ ALGOO: 6 karyawan
- ✅ RBM - IWARE BALI: 4 karyawan
- ✅ RBM-IWARE JOGJA: 1 karyawan

**TOTAL: 174 karyawan** (bukan 20 karyawan palsu seperti sebelumnya!)

---

## 🚀 Langkah-Langkah Import

### Langkah 1: Hapus Data Lama di Railway

1. Buka Railway Dashboard
2. Masuk ke MySQL Database
3. Klik tab "Query"
4. Jalankan perintah ini:

```sql
DELETE FROM karyawan;
```

5. Klik "Execute" atau tekan Ctrl+Enter

### Langkah 2: Jalankan Script Import

Di terminal/command prompt Anda:

```bash
cd backend
node scripts/import-real-karyawan.js
```

### Langkah 3: Tunggu Proses Selesai

Script akan menampilkan:
```
🔄 Memulai import data karyawan LENGKAP...

📍 Import karyawan RBM-IWARE SURABAYA...
📍 Import karyawan SBA-WMP...
📍 Import karyawan RBM-IWARE JAKARTA...
📍 Import karyawan ILUMINDO...
📍 Import karyawan RBM - LABEL...
📍 Import karyawan ALGOO...
📍 Import karyawan RBM - IWARE BALI...
📍 Import karyawan RBM-IWARE JOGJA...

✅ Import selesai!
📊 Total berhasil: 174
⏭️  Total dilewati (sudah ada): 0
```

### Langkah 4: Verifikasi

Cek di Railway MySQL atau aplikasi Anda:

```sql
SELECT kantor, COUNT(*) as jumlah 
FROM karyawan 
GROUP BY kantor 
ORDER BY jumlah DESC;
```

Atau buka aplikasi frontend dan pilih kantor di form pengajuan - seharusnya muncul nama-nama karyawan yang benar!

---

## 📝 Catatan Penting

### Nomor Telepon
Karena data asli tidak memiliki nomor telepon, script otomatis generate dengan format:
- 081234561000
- 081234561001
- 081234561002
- dst...

Jika Anda punya nomor telepon asli, bisa update manual nanti.

### Environment Variables
Script menggunakan koneksi database dari file `.env` di folder `backend`.
Pastikan file `.env` sudah ter-configure dengan benar:

```env
MYSQLHOST=your-railway-host
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=your-password
MYSQLDATABASE=railway
```

### Jika Ada Error

**Error: "Cannot find module 'mysql2'"**
```bash
cd backend
npm install
```

**Error: "Access denied"**
- Cek username/password di file `.env`
- Pastikan Railway database sudah running

**Error: "ER_DUP_ENTRY"**
- Ini normal jika data sudah ada
- Script akan skip data duplikat

---

## ✨ Hasil Akhir

Setelah import berhasil:

1. ✅ Form pengajuan akan menampilkan 174 nama karyawan yang BENAR
2. ✅ Setiap kantor punya daftar karyawan sesuai data asli
3. ✅ Nama seperti "Sugiharto Tjokro", "Lisa Israti", "Djie Tince Muhaji" akan muncul
4. ✅ Bukan lagi nama palsu seperti "ACHMAD FAUZI", "AGUS SALIM", dll

---

## 🎯 Selesai!

Setelah langkah-langkah di atas, database Railway Anda akan memiliki **174 karyawan lengkap** dengan nama, jabatan, dan departemen yang benar!

Jika ada pertanyaan atau error, silakan tanyakan! 🚀
