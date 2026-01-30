# 📱 Flow Notifikasi WhatsApp dari Nomor HRD

## 🎯 Konsep

Ketika pegawai mengajukan izin, setelah HRD memberikan keputusan (Approve/Reject), pegawai akan menerima notifikasi WhatsApp **dari nomor HRD: 085708600406**

## 📊 Alur Lengkap

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   PEGAWAI   │         │    SISTEM    │         │     HRD     │
└──────┬──────┘         └──────┬───────┘         └──────┬──────┘
       │                       │                        │
       │ 1. Ajukan Izin        │                        │
       ├──────────────────────>│                        │
       │                       │                        │
       │                       │ 2. Simpan (Pending)    │
       │                       ├───────────────────────>│
       │                       │                        │
       │                       │   3. Review Pengajuan  │
       │                       │<───────────────────────┤
       │                       │                        │
       │                       │   4. Approve/Reject    │
       │                       │<───────────────────────┤
       │                       │                        │
       │                       │ 5. Update Status       │
       │                       │                        │
       │ 6. Notifikasi WA      │                        │
       │    dari 085708600406  │                        │
       │<──────────────────────┤                        │
       │                       │                        │
```

## 🔧 Konfigurasi Teknis

### 1. Environment Variables

File: `backend/.env`
```env
WHATSAPP_API_URL=https://api.fonnte.com/send
WHATSAPP_API_TOKEN=f3LA5pzTUJvkbAX8ng9L
WHATSAPP_ENABLED=true
WHATSAPP_HRD_NUMBER=085708600406
```

### 2. Service WhatsApp

File: `backend/services/whatsapp.js`
- Fungsi `sendOTPWhatsApp()` mengirim notifikasi
- Menggunakan Fonnte API
- Pesan dikirim dari nomor yang terhubung di Fonnte

### 3. Route Pengajuan

File: `backend/routes/pengajuan.js`
- Endpoint: `PUT /api/pengajuan/:id`
- Endpoint: `PATCH /api/pengajuan/:id/status`
- Otomatis trigger notifikasi saat status berubah

## 📱 Format Pesan

### Approved
```
✅ PENGAJUAN DISETUJUI

Halo *[Nama Pegawai]*,

Pengajuan perizinan Anda telah *DISETUJUI* oleh HRD.

📋 Detail Pengajuan:
Jenis: [Jenis Perizinan]
Status: DISETUJUI ✅

💬 Catatan HRD:
[Catatan dari HRD]

Silakan cek aplikasi untuk detail lebih lanjut.

Terima kasih.
_Sistem Perizinan IWARE_
```

### Rejected
```
❌ PENGAJUAN DITOLAK

Halo *[Nama Pegawai]*,

Mohon maaf, pengajuan perizinan Anda *DITOLAK* oleh HRD.

📋 Detail Pengajuan:
Jenis: [Jenis Perizinan]
Status: DITOLAK ❌

💬 Alasan Penolakan:
[Catatan dari HRD]

Anda dapat mengajukan kembali dengan melengkapi persyaratan yang diperlukan.

Terima kasih.
_Sistem Perizinan IWARE_
```

## 🧪 Testing

### Test Script
```bash
cd backend
node test-hrd-notification.js
```

Script ini akan:
1. Menampilkan konfigurasi saat ini
2. Mengirim test notifikasi APPROVED
3. Mengirim test notifikasi REJECTED
4. Menampilkan hasil pengiriman

### Test Manual via Aplikasi

1. **Login sebagai Pegawai**
   - Buat pengajuan baru
   - Isi nomor WhatsApp Anda

2. **Login sebagai HRD**
   - Buka dashboard HRD
   - Approve/Reject pengajuan
   - Isi catatan

3. **Cek WhatsApp**
   - Pesan masuk dari 085708600406
   - Format sesuai template

## ⚙️ Setup Fonnte

### Langkah-langkah:

1. **Login ke Fonnte**
   - Buka https://fonnte.com
   - Login dengan akun Anda

2. **Hubungkan Device**
   - Menu "Device"
   - Klik "Add Device"
   - Scan QR code dengan WhatsApp nomor **085708600406**
   - Tunggu status "Connected"

3. **Copy Token**
   - Menu "API"
   - Copy token API
   - Paste ke `.env` → `WHATSAPP_API_TOKEN`

4. **Test Koneksi**
   - Jalankan `node test-hrd-notification.js`
   - Cek apakah pesan terkirim

## 🔍 Troubleshooting

### Pesan tidak terkirim?

**Cek 1: Device Status**
```
Login Fonnte → Device → Pastikan "Connected"
```

**Cek 2: Token Valid**
```
Login Fonnte → API → Copy token baru
Update .env → Restart server
```

**Cek 3: Quota/Saldo**
```
Login Fonnte → Dashboard → Cek sisa quota
Top up jika habis
```

**Cek 4: Nomor Tujuan**
```
Pastikan format nomor benar: 08xxx atau 628xxx
Sistem otomatis format ke 628xxx
```

### Error di Console?

**"Invalid Token"**
- Token salah atau expired
- Copy token baru dari Fonnte
- Update `.env`

**"Device not connected"**
- WhatsApp device offline
- Scan QR code ulang
- Pastikan HP online

**"Insufficient balance"**
- Quota habis
- Top up di Fonnte

## 💡 Best Practices

1. **Selalu isi catatan** saat approve/reject
2. **Monitor logs** untuk memastikan notifikasi terkirim
3. **Test berkala** untuk memastikan device tetap connected
4. **Backup nomor** jika nomor HRD berubah

## 🔐 Keamanan

- Token disimpan di `.env` (tidak di-commit)
- Nomor divalidasi otomatis
- Error handling mencegah crash
- Status tetap tersimpan meski WA gagal

## 📞 Kontak

Jika ada masalah teknis:
1. Cek dokumentasi ini
2. Jalankan test script
3. Cek dashboard Fonnte
4. Cek logs server

---

**Nomor HRD**: 085708600406  
**Status**: ✅ Configured  
**Last Updated**: 2026-01-30
