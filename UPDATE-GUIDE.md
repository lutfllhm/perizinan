# Panduan Update Aplikasi ke VPS

## Perubahan Terbaru (v2.2.0)

### Bug Fixes
- ✅ Fix tombol Edit karyawan tidak berfungsi
- ✅ Fix tombol Reset Cuti tidak berfungsi  
- ✅ Fix tombol Hapus karyawan tidak berfungsi
- ✅ Tambah endpoint CRUD karyawan yang hilang

---

## Cara Update ke VPS

### Opsi 1: Update Otomatis (Recommended)

**1. Push ke GitHub dari local:**
```bash
git add .
git commit -m "Fix: Tambah endpoint CRUD karyawan"
git push origin main
```

**2. Login ke VPS:**
```bash
ssh root@your-vps-ip
# atau
ssh user@your-vps-ip
```

**3. Jalankan script update:**
```bash
cd /var/www/iware
bash update-vps.sh
```

---

### Opsi 2: Update Manual

**1. Push ke GitHub:**
```bash
git add .
git commit -m "Fix: Tambah endpoint CRUD karyawan"
git push origin main
```

**2. Login ke VPS:**
```bash
ssh root@your-vps-ip
```

**3. Pull perubahan:**
```bash
cd /var/www/iware
git pull origin main
```

**4. Rebuild containers:**
```bash
docker-compose down
docker-compose up -d --build
```

**5. Cek status:**
```bash
docker-compose ps
docker-compose logs -f
```

---

## Verifikasi Update Berhasil

### 1. Cek Container Running
```bash
docker-compose ps
```
Semua container harus status "Up"

### 2. Cek Logs
```bash
# Cek backend logs
docker-compose logs backend

# Cek frontend logs  
docker-compose logs frontend

# Cek semua logs
docker-compose logs -f
```

### 3. Test di Browser
1. Buka aplikasi: `https://iwareid.com`
2. Login sebagai HRD
3. Masuk ke menu "Daftar Karyawan"
4. Test tombol:
   - ✅ Edit karyawan
   - ✅ Reset Cuti (icon refresh hijau)
   - ✅ Hapus karyawan

---

## Troubleshooting

### Container tidak mau start
```bash
# Lihat error logs
docker-compose logs

# Restart ulang
docker-compose down
docker-compose up -d --build
```

### Perubahan tidak muncul
```bash
# Force rebuild tanpa cache
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database error
```bash
# Restart database
docker-compose restart mysql

# Cek database logs
docker-compose logs mysql
```

### Port sudah digunakan
```bash
# Cek port yang digunakan
netstat -tulpn | grep :5000
netstat -tulpn | grep :3000

# Kill process yang menggunakan port
kill -9 <PID>
```

---

## Rollback ke Versi Sebelumnya

Jika ada masalah, rollback ke commit sebelumnya:

```bash
cd /var/www/iware

# Lihat history commit
git log --oneline

# Rollback ke commit tertentu
git reset --hard <commit-hash>

# Rebuild
docker-compose down
docker-compose up -d --build
```

---

## Backup Sebelum Update

**Selalu backup sebelum update!**

```bash
# Backup database
docker exec iware-mysql mysqldump -u iware -pIwareDB2026!@# iware_perizinan > backup_$(date +%Y%m%d).sql

# Backup uploads
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz backend/uploads/

# Backup .env
cp .env .env.backup
```

---

## Monitoring Setelah Update

### 1. Monitor Logs Real-time
```bash
docker-compose logs -f
```

### 2. Monitor Resource Usage
```bash
docker stats
```

### 3. Cek Disk Space
```bash
df -h
```

### 4. Cek Memory
```bash
free -h
```

---

## Kontak Support

Jika ada masalah setelah update:
1. Cek logs: `docker-compose logs`
2. Cek status: `docker-compose ps`
3. Restart: `docker-compose restart`
4. Hubungi developer dengan info logs

---

**Update Date:** 2026-02-12  
**Version:** 2.2.0  
**Status:** ✅ Tested & Ready
