# Changelog

## [2.2.0] - 2026-02-12

### 🐛 Bug Fixes
- **Fixed: Edit, Create, dan Reset Cuti karyawan tidak berfungsi**
- Tambah endpoint `POST /api/karyawan` untuk create karyawan baru
- Tambah endpoint `PUT /api/karyawan/:id` untuk edit data karyawan
- Tambah endpoint `POST /api/karyawan/:id/reset-cuti` untuk reset cuti tahunan
- Perbaiki error handling di frontend HRDDashboard
- Tambah console.log untuk debugging

### 💼 UI/UX Improvements
- **Formalisasi teks notifikasi WhatsApp**
- Ubah "Kirim WA" menjadi "Kirim Notifikasi" (lebih formal)
- Hapus semua emoji dari template pesan WhatsApp
- Format pesan WhatsApp lebih profesional dan formal
- Pesan tetap terstruktur dengan box drawing characters

### 🔧 Backend Changes
- Tambah 3 endpoint baru di `server.js` untuk CRUD karyawan
- Validasi data karyawan sebelum insert/update
- Better error messages untuk debugging

### 💻 Frontend Changes
- Perbaiki `fetchKaryawan()` dengan error handling yang lebih baik
- Tambah `await` pada pemanggilan `fetchKaryawan()` setelah operasi CRUD
- Tambah console.log untuk tracking response data
- Perbaiki handling array response dari API
- Update button text menjadi lebih formal

## [2.1.0] - 2026-02-09

### 🚀 Auto-Migration Feature
- **Auto database migration saat deploy di Railway**
- Tabel `karyawan` dan `quota_bulanan` otomatis dibuat
- Kolom baru di tabel `pengajuan` otomatis ditambahkan
- Data karyawan otomatis di-import jika tabel kosong
- Tidak perlu manual setup database lagi!

### ✨ Added
- Auto-migration logic di `server.js`
- Auto-import karyawan saat first deploy
- Railway configuration file (`railway.json`)
- `.railwayignore` untuk optimasi deployment
- Improved database initialization dengan retry logic
- Foreign key constraint untuk `karyawan_id`

### 🔧 Improved
- Database initialization lebih robust
- Better error handling untuk migration
- Informative logs untuk debugging
- Idempotent migration (aman dijalankan berkali-kali)

### 📝 Documentation
- Updated `RAILWAY-SETUP.md` dengan auto-migration guide
- Added troubleshooting section
- Added verification steps

### 🐛 Fixed
- Database tidak otomatis update saat deploy di Railway
- Missing tables setelah fresh deployment
- Manual setup yang ribet dan error-prone

---

## [2.0.0] - 2026-02-06

### 🎉 Major Changes
- Simplified deployment untuk VPS
- Removed Hostinger/Railway specific configurations
- Added Docker support
- Improved documentation

### ✨ Added
- Docker Compose configuration
- VPS deployment scripts (Linux & Windows)
- Simplified environment configuration
- PM2 deployment guide

### 🗑️ Removed
- Hostinger specific files (.htaccess, composer.json, server.php)
- Railway specific configurations
- Vercel configurations
- Unused deployment scripts
- Multiple environment files (consolidated to .env.vps)

### 🔧 Fixed
- Cleaned up package.json scripts
- Removed unused dependencies
- Simplified project structure

### 📝 Changed
- Updated README with VPS deployment guide
- Simplified environment setup
- Improved error handling in server.js

### 🔐 Security
- Maintained JWT authentication
- Kept bcrypt password hashing
- Preserved CORS configuration

---

## [1.0.0] - 2024-12-XX

### Initial Release
- React frontend with responsive design
- Express backend with MySQL
- Admin & HRD role management
- Pengajuan cuti/lembur system
- WhatsApp notification integration
- Dashboard with statistics
