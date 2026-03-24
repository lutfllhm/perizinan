# 🔧 Panduan Perbaikan VPS - Error "Gagal memuat data karyawan"

## 📋 Diagnosis Masalah

Error "Gagal memuat data karyawan" terjadi karena:
1. Backend API sudah benar (server.js line 601-620)
2. Frontend sudah benar (PengajuanForm.jsx)
3. Kemungkinan masalah ada di:
   - Database belum terisi data karyawan
   - Backend belum running dengan benar
   - Environment variables tidak sesuai
   - CORS atau network issue

## 🚀 Langkah Perbaikan

### 1. SSH ke VPS Anda

```bash
ssh root@your-vps-ip
# atau
ssh username@license.iwareid.com
```

### 2. Masuk ke Direktori Aplikasi

```bash
cd /var/www/iware
# atau sesuai lokasi instalasi Anda
```

### 3. Cek Status Docker Containers

```bash
docker-compose ps
```

**Output yang diharapkan:**
```
NAME                COMMAND                  SERVICE             STATUS              PORTS
iware-backend       "docker-entrypoint.s…"   backend             Up 2 hours          0.0.0.0:5001->5000/tcp
iware-frontend      "/docker-entrypoint.…"   frontend            Up 2 hours          0.0.0.0:3001->80/tcp
iware-mysql         "docker-entrypoint.s…"   mysql               Up 2 hours          0.0.0.0:3307->3306/tcp
```

### 4. Cek Logs Backend

```bash
docker-compose logs backend | tail -100
```

**Cari pesan ini:**
```
✅ Database connected
✅ Table users OK
✅ Table pengajuan OK
✅ Table karyawan OK
✅ Table quota_bulanan OK
✅ Auto-imported 173 karyawan from 8 offices
✅ Database initialization complete!
🚀 Server running on port 5000
```

**Jika TIDAK melihat pesan di atas, lanjut ke langkah 5.**

### 5. Restart Backend Container

```bash
docker-compose restart backend
```

Tunggu 30 detik, lalu cek logs lagi:

```bash
docker-compose logs -f backend
```

Tekan `Ctrl+C` untuk keluar dari logs.

### 6. Test API Endpoint Langsung

```bash
# Test dari dalam VPS
curl http://localhost:5001/api/health

# Test endpoint karyawan
curl http://localhost:5001/api/karyawan
```

**Output yang diharapkan:**
```json
{
  "data": [
    {
      "id": 1,
      "kantor": "RBM-IWARE SURABAYA",
      "nama": "Djie Tince Muhaji (Tince)",
      "jabatan": "General Manager",
      "departemen": "Management",
      ...
    },
    ...
  ]
}
```

**Jika output kosong `{"data":[]}`, lanjut ke langkah 7.**

### 7. Cek Database Langsung

```bash
# Masuk ke MySQL container
docker exec -it iware-mysql mysql -u iware -p

# Masukkan password dari .env.docker.production
# Default: YourSecureDBPassword2026!@#
```

Di dalam MySQL:

```sql
USE iware_perizinan;

-- Cek jumlah karyawan
SELECT COUNT(*) FROM karyawan;

-- Cek sample data
SELECT * FROM karyawan LIMIT 5;

-- Cek kantor yang ada
SELECT DISTINCT kantor FROM karyawan;

-- Keluar
EXIT;
```

**Jika COUNT(*) = 0, database kosong. Lanjut ke langkah 8.**

### 8. Force Re-import Data Karyawan

```bash
# Hapus semua data karyawan (HATI-HATI!)
docker exec -it iware-mysql mysql -u iware -p iware_perizinan -e "TRUNCATE TABLE karyawan;"

# Restart backend untuk trigger auto-import
docker-compose restart backend

# Tunggu 30 detik
sleep 30

# Cek logs
docker-compose logs backend | grep "Auto-imported"
```

**Output yang diharapkan:**
```
✅ Auto-imported 173 karyawan from 8 offices
```

### 9. Test dari Browser

Buka browser dan test:

1. **Test API Health:**
   ```
   https://license.iwareid.com/api/health
   ```
   
2. **Test API Karyawan:**
   ```
   https://license.iwareid.com/api/karyawan
   ```

3. **Test Form Pengajuan:**
   ```
   https://license.iwareid.com/pengajuan
   ```
   - Pilih kantor: "RBM-IWARE SURABAYA"
   - Dropdown nama karyawan harus terisi

### 10. Cek Environment Variables

```bash
# Cek .env.docker.production
cat .env.docker.production

# Cek backend/.env.production
cat backend/.env.production

# Cek frontend/.env.production
cat frontend/.env.production
```

**Pastikan:**
- `REACT_APP_API_URL=https://license.iwareid.com/api` (frontend)
- `DB_HOST=mysql` (backend)
- `DB_NAME=iware_perizinan` (backend)
- `FRONTEND_URL=https://license.iwareid.com` (backend)

### 11. Rebuild Containers (Jika Masih Error)

```bash
# Stop semua containers
docker-compose down

# Rebuild dan start
docker-compose up -d --build

# Monitor logs
docker-compose logs -f
```

Tunggu hingga melihat:
```
✅ Database initialization complete!
🚀 Server running on port 5000
```

### 12. Cek Nginx Configuration

```bash
# Test nginx config
sudo nginx -t

# Cek nginx logs
sudo tail -f /var/log/nginx/error.log
```

**Jika ada error CORS atau proxy:**

```bash
# Edit nginx config
sudo nano /etc/nginx/sites-available/license.iwareid.com
```

Pastikan ada:
```nginx
location /api {
    proxy_pass http://localhost:5001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # CORS headers
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
}
```

Restart nginx:
```bash
sudo systemctl restart nginx
```

## 🔍 Troubleshooting Tambahan

### Error: "Cannot connect to database"

```bash
# Cek MySQL container
docker-compose logs mysql | tail -50

# Restart MySQL
docker-compose restart mysql

# Tunggu 30 detik
sleep 30

# Restart backend
docker-compose restart backend
```

### Error: "Port already in use"

```bash
# Cek port yang digunakan
sudo netstat -tulpn | grep :5001
sudo netstat -tulpn | grep :3001

# Kill process jika perlu
sudo kill -9 [PID]

# Restart containers
docker-compose restart
```

### Error: "CORS policy"

Tambahkan di `backend/server.js` (sudah ada, tapi pastikan):

```javascript
app.use(cors({ origin: '*', credentials: true }));
```

Atau edit nginx config untuk menambahkan CORS headers (lihat langkah 12).

### Database Tidak Auto-Import

Jika setelah restart backend data karyawan masih kosong:

```bash
# Manual import menggunakan script
docker exec -it iware-backend node scripts/import-real-karyawan.js
```

## ✅ Verifikasi Akhir

Setelah semua langkah di atas, test:

1. ✅ `https://license.iwareid.com` - Homepage loading
2. ✅ `https://license.iwareid.com/api/health` - Returns `{"status":"OK"}`
3. ✅ `https://license.iwareid.com/api/karyawan` - Returns array of karyawan
4. ✅ Form pengajuan - Dropdown kantor dan nama karyawan terisi

## 📞 Jika Masih Error

Kirimkan output dari command berikut:

```bash
# 1. Status containers
docker-compose ps

# 2. Backend logs
docker-compose logs backend | tail -100

# 3. Database check
docker exec -it iware-mysql mysql -u iware -p iware_perizinan -e "SELECT COUNT(*) as total FROM karyawan;"

# 4. API test
curl http://localhost:5001/api/karyawan

# 5. Nginx test
sudo nginx -t
```

---

**Dibuat untuk:** IWARE Perizinan VPS Troubleshooting
**Tanggal:** 24 Maret 2026
