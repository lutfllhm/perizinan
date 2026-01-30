# 🚀 Cara Menjalankan Aplikasi Agar Notifikasi WhatsApp Berfungsi

## ✅ Bukti: Notifikasi WhatsApp SUDAH BERFUNGSI!

Script test berhasil mengirim notifikasi:
```
✅ NOTIFIKASI BERHASIL DIKIRIM!
   Cek WhatsApp di nomor: 6281234567890
   Quota Remaining: 998
```

Artinya:
- ✅ Kode notifikasi sudah benar
- ✅ Token Fonnte valid
- ✅ Device WhatsApp connected
- ✅ API Fonnte berfungsi

## ❌ Masalah: Kenapa Tidak Dapat Notifikasi di Aplikasi?

**Aplikasi backend tidak berjalan!**

Saat HRD klik approve/reject di web, request tidak sampai ke server karena server tidak jalan.

## 🔧 Solusi: Jalankan Aplikasi

Ada 2 cara menjalankan aplikasi:

---

### **CARA 1: Jalankan di LOCAL (Development)**

Untuk testing di komputer Anda sendiri.

#### Step 1: Install Dependencies

```bash
cd backend
npm install
```

Tunggu sampai selesai install semua package (axios, express, mysql2, dll).

#### Step 2: Pastikan MySQL Berjalan

- Buka XAMPP atau MySQL Workbench
- Start MySQL service
- Pastikan database `iware_perizinan` sudah ada

#### Step 3: Jalankan Backend

```bash
cd backend
npm start
```

Atau:
```bash
cd backend
node server.js
```

Output yang benar:
```
🚀 Starting server...
📍 Environment: development
📍 Port: 5000
✅ MySQL connected successfully!
🚀 Server running on port 5000
```

#### Step 4: Jalankan Frontend (Terminal Baru)

Buka terminal baru:
```bash
cd frontend
npm start
```

Output yang benar:
```
Compiled successfully!
Local: http://localhost:3000
```

#### Step 5: Test Notifikasi

1. **Buka browser**: http://localhost:3000
2. **Login sebagai Pegawai**:
   - Username: pegawai
   - Password: pegawai123
3. **Buat pengajuan izin**:
   - Isi semua data
   - **Nomor WA**: Isi dengan nomor WA Anda (08xxx)
   - Submit
4. **Login sebagai HRD** (tab/window baru):
   - Username: hrd
   - Password: hrd123
5. **Approve/Reject pengajuan**:
   - Buka dashboard HRD
   - Klik tombol Approve atau Reject
   - Isi catatan
   - Submit
6. **Cek WhatsApp Anda**:
   - Notifikasi akan masuk dalam beberapa detik! ✅

---

### **CARA 2: Jalankan di RAILWAY (Production)**

Untuk aplikasi yang bisa diakses dari mana saja (online).

#### Step 1: Set Environment Variables di Railway

1. **Login ke Railway**: https://railway.app
2. **Pilih project**: perizinan
3. **Klik service**: backend
4. **Klik tab**: Variables
5. **Tambahkan variables** (klik Raw Editor):
   ```
   WHATSAPP_API_URL=https://api.fonnte.com/send
   WHATSAPP_API_TOKEN=f3LA5pzTUJvkbAX8ng9L
   WHATSAPP_ENABLED=true
   ```
6. **Save** dan tunggu redeploy

#### Step 2: Verifikasi Deployment

1. Tunggu sampai status **"Active"** (hijau)
2. Klik tab **"Deployments"**
3. Lihat logs, pastikan tidak ada error

#### Step 3: Test Notifikasi

1. **Buka aplikasi**: https://licensing-iw.up.railway.app (atau URL Anda)
2. **Login sebagai Pegawai**
3. **Buat pengajuan** dengan nomor WA Anda
4. **Login sebagai HRD**
5. **Approve/Reject pengajuan**
6. **Cek WhatsApp** → Notifikasi masuk! ✅

#### Step 4: Monitoring Logs

Untuk memastikan notifikasi terkirim, cek logs:

1. Railway Dashboard > Backend > Deployments
2. Klik deployment yang aktif
3. Lihat logs real-time
4. Saat HRD approve/reject, akan muncul:
   ```
   ✅ Status updated: 123 approved
   📱 WhatsApp notification sent to: 628123456789
   ```

---

## 🧪 Testing Script (Tanpa Jalankan Server)

Jika ingin test notifikasi tanpa jalankan full aplikasi:

```bash
cd backend
node test-notifikasi-hrd.js
```

Edit file `test-notifikasi-hrd.js` untuk ganti:
- Nomor telepon
- Nama pegawai
- Status (approved/rejected)
- Catatan HRD

---

## 📊 Checklist Troubleshooting

Jika notifikasi tidak terkirim, cek:

### Local Development:
- [ ] Backend server berjalan (`node server.js`)
- [ ] Frontend server berjalan (`npm start`)
- [ ] MySQL berjalan (XAMPP/Workbench)
- [ ] Database `iware_perizinan` ada
- [ ] File `.env` ada dan benar
- [ ] Token Fonnte benar di `.env`
- [ ] Device WhatsApp connected di Fonnte
- [ ] Nomor telepon pegawai benar (08xxx atau 628xxx)

### Railway Production:
- [ ] Environment variables sudah di-set di Railway
- [ ] Backend deployment status "Active"
- [ ] Logs tidak ada error
- [ ] Token Fonnte benar
- [ ] Device WhatsApp connected di Fonnte
- [ ] Nomor telepon pegawai benar

---

## 🔍 Debug: Cek Logs

### Local:
Lihat console terminal backend, akan muncul:
```
✅ Status updated: 123 approved
📱 WhatsApp notification sent to: 628123456789
```

Atau jika error:
```
❌ Error sending WhatsApp notification: ...
```

### Railway:
Railway Dashboard > Backend > Deployments > View Logs

---

## 💡 Tips

1. **Testing Awal**: Gunakan nomor WA Anda sendiri
2. **Catatan HRD**: Selalu isi catatan agar pegawai tahu alasannya
3. **Format Nomor**: Sistem otomatis format, bisa pakai 08xxx atau 628xxx
4. **Quota Fonnte**: Cek sisa quota di https://fonnte.com/dashboard

---

## 🆘 Masih Tidak Berfungsi?

### 1. Test Script Dulu
```bash
cd backend
node test-notifikasi-hrd.js
```

Jika berhasil → Masalah di aplikasi (server tidak jalan)
Jika gagal → Masalah di Fonnte (device disconnect)

### 2. Cek Device Fonnte
- Login ke https://fonnte.com
- Menu "Device"
- Status harus "Connected" (hijau)
- Jika "Disconnected", scan QR code lagi

### 3. Cek Server Berjalan
```bash
# Windows
netstat -ano | findstr :5000

# Jika ada output → Server jalan
# Jika kosong → Server tidak jalan
```

---

## 📞 Support

Jika masih ada masalah:
1. Jalankan `node test-notifikasi-hrd.js` dan screenshot hasilnya
2. Cek logs backend (local atau Railway)
3. Cek status device di Fonnte dashboard

---

**Next Step**: Pilih cara 1 (local) atau cara 2 (Railway), jalankan aplikasi, dan test!
