# 📱 Flow Notifikasi WhatsApp - Sistem Perizinan IWARE

## 🎯 Cara Kerja Sistem

### **PEGAWAI TIDAK PERLU LOGIN!**

Sistem dirancang agar pegawai bisa langsung mengajukan izin tanpa login.

---

## 📊 Flow Lengkap

```
┌─────────────────────────────────────────────────────────────────┐
│                         FLOW NOTIFIKASI                         │
└─────────────────────────────────────────────────────────────────┘

1. PEGAWAI (Tanpa Login)
   │
   ├─> Buka website: https://licensing-iw.up.railway.app
   │
   ├─> Klik tombol "Ajukan Pengajuan"
   │
   ├─> Isi Form:
   │   ├─ Nama Lengkap: "Budi Santoso"
   │   ├─ No. Telp/WhatsApp: "081234567890"  ← PENTING!
   │   ├─ Jenis Perizinan: "Cuti Tahunan"
   │   ├─ Tanggal Mulai: "2026-02-01 08:00"
   │   ├─ Tanggal Selesai: "2026-02-05 17:00"
   │   └─ Bukti Foto: (opsional)
   │
   ├─> Klik "Kirim Pengajuan"
   │
   └─> ✅ Data tersimpan dengan status "Pending"

        ⬇️

2. HRD (Perlu Login)
   │
   ├─> Login ke dashboard HRD
   │   Username: hrd
   │   Password: hrd123
   │
   ├─> Lihat daftar pengajuan masuk
   │
   ├─> Review pengajuan "Budi Santoso"
   │
   ├─> Klik tombol "Approve" atau "Reject"
   │
   ├─> Isi catatan (opsional):
   │   "Pengajuan disetujui. Selamat berlibur!"
   │
   └─> Klik "Submit"

        ⬇️

3. SISTEM (Otomatis)
   │
   ├─> Update status di database
   │   Status: "approved" atau "rejected"
   │
   ├─> Ambil nomor WhatsApp pegawai: "081234567890"
   │
   ├─> Format nomor: "081234567890" → "6281234567890"
   │
   ├─> Buat pesan notifikasi:
   │   ┌─────────────────────────────────────┐
   │   │ ✅ PENGAJUAN DISETUJUI              │
   │   │                                     │
   │   │ Halo *Budi Santoso*,                │
   │   │                                     │
   │   │ Pengajuan perizinan Anda telah      │
   │   │ *DISETUJUI* oleh HRD.               │
   │   │                                     │
   │   │ 📋 Detail Pengajuan:                │
   │   │ Jenis: Cuti Tahunan                 │
   │   │ Status: DISETUJUI ✅                │
   │   │                                     │
   │   │ 💬 Catatan HRD:                     │
   │   │ Pengajuan disetujui. Selamat        │
   │   │ berlibur!                           │
   │   │                                     │
   │   │ Terima kasih.                       │
   │   │ _Sistem Perizinan IWARE_            │
   │   └─────────────────────────────────────┘
   │
   ├─> Kirim ke Fonnte API
   │
   └─> ✅ Notifikasi terkirim!

        ⬇️

4. PEGAWAI
   │
   └─> 📱 Dapat notifikasi WhatsApp
       "Ting!" → Buka WhatsApp → Lihat pesan dari sistem
```

---

## 🔑 Poin Penting

### ✅ Yang TIDAK Perlu Login:
- **Pegawai** - Langsung isi form pengajuan
- Siapa saja bisa akses halaman form

### 🔐 Yang Perlu Login:
- **HRD** - Untuk approve/reject pengajuan
- **Admin** - Untuk manage sistem

### 📱 Nomor WhatsApp:
- Pegawai **wajib isi** nomor WhatsApp di form
- Format bebas: `08xxx` atau `628xxx` (sistem otomatis format)
- Nomor ini yang akan dapat notifikasi

---

## 📝 Contoh Penggunaan

### Skenario 1: Pengajuan Disetujui

**Pegawai:**
```
Nama: Ahmad Rizki
No. WA: 08123456789
Jenis: Cuti Tahunan
Tanggal: 1-5 Februari 2026
```

**HRD Approve:**
```
Status: Approved ✅
Catatan: "Pengajuan disetujui. Selamat berlibur!"
```

**Notifikasi WhatsApp ke 08123456789:**
```
✅ PENGAJUAN DISETUJUI

Halo *Ahmad Rizki*,

Pengajuan perizinan Anda telah *DISETUJUI* oleh HRD.

📋 Detail Pengajuan:
Jenis: Cuti Tahunan
Status: DISETUJUI ✅

💬 Catatan HRD:
Pengajuan disetujui. Selamat berlibur!

Terima kasih.
_Sistem Perizinan IWARE_
```

---

### Skenario 2: Pengajuan Ditolak

**Pegawai:**
```
Nama: Siti Nurhaliza
No. WA: 08987654321
Jenis: Cuti Tahunan
Tanggal: 1-5 Februari 2026
```

**HRD Reject:**
```
Status: Rejected ❌
Catatan: "Mohon maaf, periode cuti sudah penuh. Silakan ajukan tanggal lain."
```

**Notifikasi WhatsApp ke 08987654321:**
```
❌ PENGAJUAN DITOLAK

Halo *Siti Nurhaliza*,

Mohon maaf, pengajuan perizinan Anda *DITOLAK* oleh HRD.

📋 Detail Pengajuan:
Jenis: Cuti Tahunan
Status: DITOLAK ❌

💬 Alasan Penolakan:
Mohon maaf, periode cuti sudah penuh. Silakan ajukan tanggal lain.

Anda dapat mengajukan kembali dengan melengkapi persyaratan yang diperlukan.

Terima kasih.
_Sistem Perizinan IWARE_
```

---

## 🧪 Cara Testing

### 1. Test Form Pengajuan (Tanpa Login)

1. Buka browser
2. Akses: https://licensing-iw.up.railway.app (atau localhost:3000)
3. Klik tombol **"Ajukan Pengajuan"**
4. Isi form dengan **nomor WA Anda sendiri**
5. Submit

### 2. Test Approve/Reject (Login HRD)

1. Buka tab/window baru
2. Login sebagai HRD:
   - Username: `hrd`
   - Password: `hrd123`
3. Lihat pengajuan yang baru masuk
4. Klik **"Approve"** atau **"Reject"**
5. Isi catatan
6. Submit

### 3. Cek WhatsApp

- Buka WhatsApp di HP Anda
- Notifikasi akan masuk dalam beberapa detik
- Pesan sesuai status (approved/rejected)

---

## ⚙️ Konfigurasi

### Local Development:

File: `backend/.env`
```env
WHATSAPP_API_URL=https://api.fonnte.com/send
WHATSAPP_API_TOKEN=f3LA5pzTUJvkbAX8ng9L
WHATSAPP_ENABLED=true
```

### Railway Production:

Railway Dashboard > Backend Service > Variables:
```
WHATSAPP_API_URL=https://api.fonnte.com/send
WHATSAPP_API_TOKEN=f3LA5pzTUJvkbAX8ng9L
WHATSAPP_ENABLED=true
```

---

## 🔍 Troubleshooting

### Notifikasi tidak terkirim?

**Cek 1: Aplikasi berjalan?**
- Local: `node backend/server.js` harus jalan
- Railway: Deployment status harus "Active"

**Cek 2: Device WhatsApp connected?**
- Login ke https://fonnte.com
- Menu "Device" → Status harus "Connected" (hijau)

**Cek 3: Nomor WhatsApp benar?**
- Format: 08xxx atau 628xxx
- Pastikan nomor aktif dan bisa menerima pesan

**Cek 4: Environment variables?**
- Local: Cek file `.env`
- Railway: Cek Variables di dashboard

**Cek 5: Logs server?**
- Saat HRD approve/reject, cek console/logs
- Harusnya muncul: `✅ WhatsApp notification sent to: 628xxx`

---

## 💡 Tips

1. **Testing**: Gunakan nomor WA Anda sendiri untuk testing
2. **Catatan HRD**: Selalu isi catatan agar pegawai tahu alasannya
3. **Format Nomor**: Sistem otomatis format, bisa pakai 08xxx atau 628xxx
4. **Quota Fonnte**: Cek sisa quota di https://fonnte.com/dashboard

---

## 📞 Support

Jika ada masalah:
1. Test dengan script: `node backend/test-notifikasi-hrd.js`
2. Cek logs backend (local atau Railway)
3. Cek status device di Fonnte dashboard

---

**Status**: ✅ Fitur sudah berfungsi 100%
**Pegawai**: Tidak perlu login, langsung isi form
**Notifikasi**: Otomatis terkirim saat HRD approve/reject
