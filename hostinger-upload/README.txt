═══════════════════════════════════════════════════════════════
  FOLDER SIAP UPLOAD KE HOSTINGER
═══════════════════════════════════════════════════════════════

📁 ISI FOLDER INI:

hostinger-upload/
├── .htaccess              (Apache config - PENTING!)
├── index.html             (Main HTML)
├── manifest.json          (PWA manifest)
├── asset-manifest.json    (Build manifest)
├── README.txt             (File ini)
├── img/
│   ├── bg.jpeg           (Background)
│   └── logo.png          (Logo)
└── static/
    ├── css/
    │   └── main.39b5f453.css
    └── js/
        ├── main.fc7d1190.js
        └── main.fc7d1190.js.LICENSE.txt

Total: 10 files
Size: ~252 KB (optimized)

═══════════════════════════════════════════════════════════════

🚀 CARA UPLOAD:

METODE 1: FILE MANAGER (PALING MUDAH)

1. Login ke hPanel Hostinger
   https://hpanel.hostinger.com

2. Klik "File Manager"

3. Masuk ke folder "public_html"

4. Hapus semua file lama (jika ada)

5. Upload SEMUA file dari folder ini:
   - Drag & drop semua file dan folder
   - Atau klik "Upload" lalu pilih semua

6. PENTING: Pastikan .htaccess ter-upload
   - Klik "Settings" → Enable "Show Hidden Files"
   - Cek file .htaccess ada di root

7. Test website: https://iwareid.com

───────────────────────────────────────────────────────────────

METODE 2: FTP (FILEZILLA)

1. Download FileZilla (jika belum punya)

2. Ambil kredensial FTP dari hPanel:
   hPanel → FTP Accounts

3. Connect di FileZilla:
   Host: ftp.iwareid.com
   Username: [dari hPanel]
   Password: [dari hPanel]
   Port: 21

4. Upload semua file dari folder ini ke public_html/

5. Test website: https://iwareid.com

═══════════════════════════════════════════════════════════════

✅ CHECKLIST SETELAH UPLOAD:

□ File .htaccess ada di root public_html/
□ File index.html ada di root public_html/
□ Folder static/ ter-upload (berisi css/ dan js/)
□ Folder img/ ter-upload (berisi logo.png dan bg.jpeg)
□ Website bisa diakses: https://iwareid.com
□ Logo dan background muncul
□ Menu navigasi bekerja
□ Refresh halaman tidak error 404
□ Console browser (F12) tidak ada error merah

═══════════════════════════════════════════════════════════════

⚙️  KONFIGURASI:

API URL: https://iwareid.com
Environment: Production
React: 18.2.0
Build Date: 2026-02-05
Optimized: Yes (minified + gzipped)

═══════════════════════════════════════════════════════════════

🔧 TROUBLESHOOTING:

❌ Halaman blank/putih
   → Buka Console (F12) untuk lihat error
   → Pastikan index.html ada di root public_html/
   → Pastikan folder static/ ter-upload

❌ Error 404 saat refresh halaman
   → Pastikan .htaccess ter-upload
   → Enable "Show Hidden Files" di File Manager
   → Re-upload .htaccess jika perlu

❌ Gambar tidak muncul
   → Pastikan folder img/ ter-upload
   → Cek isi folder: logo.png dan bg.jpeg

❌ API tidak connect
   → Cek backend sudah running
   → Cek URL API: https://iwareid.com
   → Buka Network tab di Console (F12)

❌ CSS tidak load / tampilan berantakan
   → Pastikan folder static/css/ ter-upload
   → Clear browser cache (Ctrl+F5)

❌ JavaScript error
   → Pastikan folder static/js/ ter-upload
   → Cek Console (F12) untuk detail error

═══════════════════════════════════════════════════════════════

🔄 UPDATE/RE-DEPLOY:

Jika ada perubahan code:

1. cd frontend
2. npm run build
3. xcopy /E /I /Y build\* ..\hostinger-upload\
4. Upload ulang ke Hostinger

Atau gunakan script:
   npm run hostinger:deploy

═══════════════════════════════════════════════════════════════

📞 SUPPORT:

Dokumentasi lengkap: ../PANDUAN-HOSTING-HOSTINGER.md

═══════════════════════════════════════════════════════════════
