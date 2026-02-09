# Instruksi Import Data Karyawan Lengkap

## Masalah
Database Railway saat ini hanya memiliki 20 karyawan dengan nama yang salah (ACHMAD FAUZI, AGUS SALIM, dll).
Data yang benar ada di `backend/scripts/import-karyawan.js` dengan 174 karyawan dari 8 kantor.

## Solusi
Saya telah membuat script baru: `backend/scripts/import-real-karyawan.js` yang berisi:
- **174 karyawan lengkap** dari 8 kantor
- Semua nama, jabatan, dan departemen sesuai dengan data asli
- Nomor telepon otomatis di-generate (format: 081234561000, 081234561001, dst)

## Langkah-Langkah

### 1. Hapus Data Lama di Railway MySQL
Masuk ke Railway MySQL Console dan jalankan:
```sql
DELETE FROM karyawan;
```

### 2. Jalankan Script Import
Di terminal lokal Anda, jalankan:
```bash
cd backend
node scripts/import-real-karyawan.js
```

Script akan:
- Connect ke database Railway (menggunakan env variables dari `.env`)
- Import 174 karyawan
- Generate nomor telepon otomatis
- Skip data yang sudah ada (jika ada duplikat)

### 3. Verifikasi
Cek di Railway MySQL atau melalui aplikasi:
```sql
SELECT kantor, COUNT(*) as jumlah FROM karyawan GROUP BY kantor;
```

Harusnya muncul:
- RBM-IWARE SURABAYA: 76 karyawan
- SBA-WMP: 18 karyawan
- RBM-IWARE JAKARTA: 36 karyawan
- ILUMINDO: 13 karyawan
- RBM - LABEL: 20 karyawan
- ALGOO: 6 karyawan
- RBM - IWARE BALI: 4 karyawan
- RBM-IWARE JOGJA: 1 karyawan

**Total: 174 karyawan**

## Catatan
- Script menggunakan environment variables dari file `.env` di folder backend
- Pastikan `.env` sudah ter-configure dengan benar untuk Railway database
- Jika ada error "ER_DUP_ENTRY", itu normal - artinya data sudah ada dan di-skip
- Nomor telepon di-generate otomatis karena data asli tidak memiliki nomor telepon

## File yang Dibuat
- `backend/scripts/import-real-karyawan.js` - Script import lengkap dengan 174 karyawan
- File ini (`IMPORT-KARYAWAN-INSTRUCTIONS.md`) - Instruksi penggunaan
