# 🛠️ VPS Troubleshooting Tools

Tools untuk mendiagnosis dan memperbaiki masalah "Gagal memuat data karyawan" di VPS.

## 📦 File yang Tersedia

1. **VPS-FIX-GUIDE.md** - Panduan lengkap troubleshooting manual
2. **vps-diagnostic.sh** - Script untuk diagnosa masalah
3. **vps-quick-fix.sh** - Script untuk perbaikan otomatis

## 🚀 Cara Menggunakan

### Upload Files ke VPS

```bash
# Dari komputer lokal, upload ke VPS
scp VPS-FIX-GUIDE.md root@your-vps-ip:/var/www/iware/
scp vps-diagnostic.sh root@your-vps-ip:/var/www/iware/
scp vps-quick-fix.sh root@your-vps-ip:/var/www/iware/
```

Atau gunakan SFTP client seperti FileZilla.

### SSH ke VPS

```bash
ssh root@your-vps-ip
cd /var/www/iware
```

### Jalankan Diagnostic

```bash
# Beri permission execute
chmod +x vps-diagnostic.sh

# Jalankan diagnostic
bash vps-diagnostic.sh
```

**Output akan menunjukkan:**
- ✅ Status semua Docker containers
- ✅ Health check backend API
- ✅ Jumlah data karyawan di database
- ✅ Status Nginx
- ✅ Port yang digunakan
- ✅ Recent logs

### Jalankan Quick Fix

```bash
# Beri permission execute
chmod +x vps-quick-fix.sh

# Jalankan quick fix
bash vps-quick-fix.sh
```

**Script akan otomatis:**
1. ✅ Cek status saat ini
2. ✅ Restart backend jika perlu
3. ✅ Tunggu auto-import data
4. ✅ Jalankan manual import jika auto-import gagal
5. ✅ Rebuild containers jika masih gagal
6. ✅ Verifikasi hasil akhir

## 📋 Manual Troubleshooting

Jika script otomatis tidak berhasil, ikuti panduan di **VPS-FIX-GUIDE.md**.

## 🔍 Common Issues & Solutions

### Issue 1: "Backend tidak merespons"

**Solusi:**
```bash
docker-compose restart backend
# Tunggu 30 detik
docker-compose logs backend
```

### Issue 2: "Database karyawan kosong"

**Solusi:**
```bash
# Restart backend untuk trigger auto-import
docker-compose restart backend

# Atau manual import
docker exec -it iware-backend node scripts/import-real-karyawan.js
```

### Issue 3: "Cannot connect to database"

**Solusi:**
```bash
# Restart MySQL
docker-compose restart mysql
sleep 30

# Restart backend
docker-compose restart backend
```

### Issue 4: "CORS error"

**Solusi:**
```bash
# Edit nginx config
sudo nano /etc/nginx/sites-available/license.iwareid.com

# Tambahkan CORS headers di location /api
# Lihat VPS-FIX-GUIDE.md untuk detail

# Restart nginx
sudo systemctl restart nginx
```

## 🧪 Test Endpoints

Setelah fix, test endpoints berikut:

```bash
# 1. Health check
curl https://license.iwareid.com/api/health

# 2. Karyawan API
curl https://license.iwareid.com/api/karyawan

# 3. Test dari browser
# Buka: https://license.iwareid.com/pengajuan
# Pilih kantor dan cek dropdown nama karyawan
```

## 📞 Support

Jika masih mengalami masalah setelah menggunakan semua tools di atas:

1. Jalankan diagnostic dan simpan output:
   ```bash
   bash vps-diagnostic.sh > diagnostic-output.txt
   ```

2. Kirimkan file `diagnostic-output.txt` untuk analisis lebih lanjut

3. Sertakan juga:
   - Screenshot error di browser
   - Output dari `docker-compose logs backend | tail -100`
   - Output dari `docker-compose ps`

## ⚡ Quick Commands Reference

```bash
# Status containers
docker-compose ps

# Restart semua
docker-compose restart

# Restart backend saja
docker-compose restart backend

# Lihat logs
docker-compose logs -f backend

# Rebuild semua
docker-compose down
docker-compose up -d --build

# Test API
curl http://localhost:5001/api/karyawan

# Cek database
docker exec -it iware-mysql mysql -u iware -p iware_perizinan
```

---

**Dibuat untuk:** IWARE Perizinan VPS
**Tanggal:** 24 Maret 2026
