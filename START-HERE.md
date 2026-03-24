# 🚀 START HERE - Perbaikan VPS IWARE Perizinan

## ⚡ Quick Fix (Paling Mudah)

### 1. Upload file ke VPS

Gunakan FileZilla atau SCP untuk upload file berikut ke `/var/www/iware/`:
- `vps-quick-fix.sh`
- `vps-diagnostic.sh`

### 2. SSH ke VPS

```bash
ssh root@your-vps-ip
cd /var/www/iware
```

### 3. Jalankan Quick Fix

```bash
chmod +x vps-quick-fix.sh
bash vps-quick-fix.sh
```

Script akan otomatis memperbaiki masalah!

## 📖 Jika Quick Fix Tidak Berhasil

Baca file berikut sesuai urutan:

1. **VPS-TOOLS-README.md** - Cara menggunakan tools
2. **VPS-FIX-GUIDE.md** - Panduan lengkap manual
3. **QUICK-COMMANDS.md** - Command reference

## 🆘 Butuh Bantuan?

Jalankan diagnostic dan kirimkan output:

```bash
chmod +x vps-diagnostic.sh
bash vps-diagnostic.sh > diagnostic-output.txt
```

Kirimkan file `diagnostic-output.txt` untuk analisis.

---

**Semua file sudah siap digunakan!**
