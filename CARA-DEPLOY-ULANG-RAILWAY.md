# 🚀 Cara Deploy Ulang Backend di Railway dengan WhatsApp

## ✅ Status Saat Ini

Dari logs Railway, backend **sudah berjalan dengan baik**:
- ✅ Database connected
- ✅ Tables initialized
- ✅ Server running on port 8000
- ✅ Routes loaded

Yang kurang hanya **environment variables WhatsApp**.

---

## 📋 Langkah-Langkah Deploy Ulang

### Step 1: Tambah Environment Variables WhatsApp

1. **Buka Railway Dashboard**: https://railway.app
2. **Pilih project**: perizinan
3. **Klik service**: backend (yang sedang running)
4. **Klik tab**: **Variables** (di menu atas)
5. **Klik**: **"Raw Editor"** (pojok kanan atas)
6. **Scroll ke bawah**, tambahkan 3 baris ini:
   ```
   WHATSAPP_API_URL=https://api.fonnte.com/send
   WHATSAPP_API_TOKEN=f3LA5pzTUJvkbAX8ng9L
   WHATSAPP_ENABLED=true
   ```
7. **Klik**: **"Update Variables"** atau **"Save"**

### Step 2: Tunggu Auto Redeploy

Railway akan **otomatis redeploy** setelah variables di-update:
- Status akan berubah jadi "Building..."
- Tunggu sampai jadi "Active" (hijau)
- Biasanya 2-3 menit

### Step 3: Verifikasi Deployment

Setelah status "Active", cek logs:
1. Klik tab **"Deployments"**
2. Klik deployment terbaru
3. Lihat logs, pastikan tidak ada error
4. Cari baris: `✅ Routes loaded successfully`

### Step 4: Test Notifikasi WhatsApp

1. **Buka aplikasi**: https://perizinan-production.up.railway.app (atau URL Anda)
2. **Klik**: "Ajukan Pengajuan" (tanpa login)
3. **Isi form**:
   - Nama: Nama Anda
   - No. Telp/WhatsApp: **Nomor WA Anda** (08xxx)
   - Jenis: Cuti Tahunan
   - Tanggal: Pilih tanggal
4. **Submit**
5. **Login sebagai HRD** (tab/window baru):
   - URL: https://perizinan-production.up.railway.app/login
   - Username: `hrd`
   - Password: `hrd123`
6. **Approve pengajuan**:
   - Klik tombol "Approve"
   - Isi catatan: "Pengajuan disetujui"
   - Submit
7. **Cek WhatsApp Anda**:
   - Notifikasi akan masuk dalam beberapa detik! ✅

---

## 🔍 Cara Cek Variables Sudah Benar

### Via Railway Dashboard:

1. Backend Service > Variables
2. Scroll, cari:
   - `WHATSAPP_API_URL` → Harus ada
   - `WHATSAPP_API_TOKEN` → Harus ada (nilai: f3LA5pzTUJ...)
   - `WHATSAPP_ENABLED` → Harus ada (nilai: true)

### Via Logs:

Setelah redeploy, cek logs. Jika ada error:
```
⚠️ WHATSAPP_API_TOKEN tidak ditemukan
```
Artinya variables belum di-set dengan benar.

---

## 📸 Screenshot Panduan

### 1. Railway Dashboard > Backend Service
```
┌─────────────────────────────────────────┐
│  perizinan                              │
├─────────────────────────────────────────┤
│  Services:                              │
│  ├─ backend  ← KLIK INI                 │
│  ├─ frontend                            │
│  └─ MySQL                               │
└─────────────────────────────────────────┘
```

### 2. Tab Variables
```
┌─────────────────────────────────────────┐
│  Details | Deployments | Variables | ... │
│           ← KLIK TAB INI                │
└─────────────────────────────────────────┘
```

### 3. Raw Editor
```
┌─────────────────────────────────────────┐
│  Variables                [Raw Editor]  │
│                           ← KLIK INI    │
├─────────────────────────────────────────┤
│  NODE_ENV=production                    │
│  PORT=5000                              │
│  JWT_SECRET=...                         │
│  FRONTEND_URL=...                       │
│                                         │
│  ← TAMBAHKAN DI BAWAH:                  │
│  WHATSAPP_API_URL=https://api.fonnte... │
│  WHATSAPP_API_TOKEN=f3LA5pzTUJvkbAX...  │
│  WHATSAPP_ENABLED=true                  │
│                                         │
│  [Update Variables]  ← KLIK SAVE        │
└─────────────────────────────────────────┘
```

### 4. Status Deployment
```
┌─────────────────────────────────────────┐
│  Deployments                            │
├─────────────────────────────────────────┤
│  ● Active  b87c3632  2 mins ago         │
│    ↑ Status harus "Active" (hijau)      │
└─────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Variables tidak muncul setelah save?

- Refresh halaman Railway
- Atau logout dan login lagi
- Pastikan klik "Update Variables" atau "Save"

### Deployment gagal?

Cek logs untuk error message:
- Tab Deployments > Klik deployment > View Logs
- Cari baris dengan ❌ atau error

### Notifikasi masih tidak terkirim?

1. **Cek variables sudah benar**:
   - Railway > Backend > Variables
   - Pastikan WHATSAPP_API_TOKEN ada

2. **Cek device Fonnte**:
   - Login ke https://fonnte.com
   - Menu Device
   - Status harus "Connected" (hijau)

3. **Cek logs saat approve**:
   - Railway > Backend > Deployments > View Logs
   - Saat HRD approve, cari:
     ```
     📱 Preparing WhatsApp notification...
     📱 WhatsApp result: { success: true, ... }
     ```

4. **Test manual**:
   - Jalankan script: `node backend/test-notifikasi-hrd.js`
   - Jika berhasil → Masalah di variables Railway
   - Jika gagal → Masalah di Fonnte (device disconnect)

---

## ✅ Checklist Sebelum Test

Pastikan semua ini sudah:
- [ ] Environment variables WhatsApp sudah di-set di Railway
- [ ] Deployment status "Active" (hijau)
- [ ] Logs tidak ada error
- [ ] Device WhatsApp connected di Fonnte (https://fonnte.com)
- [ ] Nomor WA yang diisi di form adalah nomor aktif

---

## 💡 Tips

1. **Jangan commit file .env ke Git** - Token sudah aman di Railway
2. **Gunakan nomor WA Anda sendiri** untuk testing pertama kali
3. **Isi catatan HRD** agar pegawai tahu alasan approve/reject
4. **Monitor logs** untuk memastikan notifikasi terkirim

---

## 📞 Support

Jika masih ada masalah setelah ikuti semua langkah:

1. Screenshot variables di Railway (blur token jika perlu)
2. Screenshot logs saat HRD approve
3. Screenshot status device di Fonnte
4. Hasil test script: `node backend/test-notifikasi-hrd.js`

---

## 🎯 Kesimpulan

**Backend sudah berjalan dengan baik di Railway!**

Yang perlu dilakukan:
1. ✅ Tambah 3 environment variables WhatsApp
2. ✅ Tunggu auto redeploy (2-3 menit)
3. ✅ Test approve/reject pengajuan
4. ✅ Cek WhatsApp → Notifikasi masuk!

**Setelah variables di-set, notifikasi WhatsApp akan langsung berfungsi!** 🚀
