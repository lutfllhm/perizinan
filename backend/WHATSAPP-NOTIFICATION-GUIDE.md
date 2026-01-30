# 📱 Panduan Notifikasi WhatsApp - Sistem Perizinan IWARE

## ✅ Status Implementasi

Fitur notifikasi WhatsApp **SUDAH TERINTEGRASI** dan siap digunakan!

## 🎯 Cara Kerja

Ketika HRD memberikan keputusan (Approve/Reject) pada pengajuan izin pegawai:

1. **Pegawai mengisi form pengajuan** → Data tersimpan dengan status "Pending"
2. **HRD review pengajuan** → Buka dashboard HRD
3. **HRD klik Approve/Reject** → Sistem update status di database
4. **Sistem otomatis kirim WhatsApp** → Pegawai langsung dapat notifikasi

## 📋 Format Pesan WhatsApp

### Jika DISETUJUI:
```
✅ PENGAJUAN DISETUJUI

Halo *Nama Pegawai*,

Pengajuan perizinan Anda telah *DISETUJUI* oleh HRD.

📋 Detail Pengajuan:
Jenis: Cuti Tahunan
Status: DISETUJUI ✅

💬 Catatan HRD:
Pengajuan disetujui sesuai jadwal yang diajukan

Silakan cek aplikasi untuk detail lebih lanjut.

Terima kasih.
_Sistem Perizinan IWARE_
```

### Jika DITOLAK:
```
❌ PENGAJUAN DITOLAK

Halo *Nama Pegawai*,

Mohon maaf, pengajuan perizinan Anda *DITOLAK* oleh HRD.

📋 Detail Pengajuan:
Jenis: Cuti Tahunan
Status: DITOLAK ❌

💬 Alasan Penolakan:
Dokumen pendukung belum lengkap

Anda dapat mengajukan kembali dengan melengkapi persyaratan yang diperlukan.

Terima kasih.
_Sistem Perizinan IWARE_
```

## 🔧 Konfigurasi (Sudah Selesai)

File `.env` sudah dikonfigurasi:

```env
WHATSAPP_API_URL=https://api.fonnte.com/send
WHATSAPP_API_TOKEN=f3LA5pzTUJvkbAX8ng9L
WHATSAPP_ENABLED=true
WHATSAPP_HRD_NUMBER=085708600406
```

### 📱 Nomor Pengirim (HRD)

Pesan WhatsApp akan dikirim dari **nomor HRD: 085708600406**

**Penting:**
- Nomor ini harus terhubung ke akun Fonnte Anda
- Login ke https://fonnte.com
- Menu "Device" → Pastikan nomor 085708600406 sudah tersambung
- Status harus "Connected" (hijau)
- Jika belum, scan QR code dengan WhatsApp nomor tersebut

## 🧪 Testing

### 1. Test Manual via Script

Edit file `backend/test-whatsapp-notification.js`:

```javascript
const testData = {
  phoneNumber: '081234567890', // GANTI dengan nomor WA Anda
  nama: 'John Doe',
  jenisPerizinan: 'Cuti Tahunan',
  catatan: 'Pengajuan disetujui'
};
```

Jalankan:
```bash
cd backend
node test-whatsapp-notification.js
```

### 2. Test via Aplikasi (Recommended)

1. **Login sebagai Pegawai**
   - Buat pengajuan izin baru
   - Isi semua data termasuk nomor WhatsApp

2. **Login sebagai HRD/Admin**
   - Buka dashboard HRD
   - Lihat pengajuan yang masuk
   - Klik tombol "Approve" atau "Reject"
   - Isi catatan (opsional)
   - Submit

3. **Cek WhatsApp Pegawai**
   - Notifikasi akan masuk otomatis
   - Cek format pesan sudah sesuai

## 📱 Format Nomor Telepon

Sistem otomatis menangani berbagai format:

- `08123456789` → Dikonversi ke `628123456789` ✅
- `628123456789` → Tetap `628123456789` ✅
- `+628123456789` → Dikonversi ke `628123456789` ✅
- `8123456789` → Dikonversi ke `628123456789` ✅

## 🔍 Troubleshooting

### Notifikasi tidak terkirim?

1. **Cek Token Fonnte**
   ```bash
   # Di backend/.env
   WHATSAPP_API_TOKEN=your_token_here
   ```

2. **Cek Device WhatsApp di Fonnte**
   - Login ke https://fonnte.com
   - Menu "Device"
   - Pastikan status "Connected" (hijau)
   - Jika "Disconnected", scan QR code lagi

3. **Cek Logs Server**
   ```bash
   # Lihat console saat HRD approve/reject
   ✅ WhatsApp notification sent to: 628123456789
   # atau
   ❌ Error sending WhatsApp notification: ...
   ```

4. **Cek Quota Fonnte**
   - Login ke dashboard Fonnte
   - Cek sisa quota/saldo
   - Top up jika habis

### Error: "Invalid Token"

- Token salah atau expired
- Login ke Fonnte, copy token baru
- Update di `.env`
- Restart server

### Error: "Device not connected"

- WhatsApp device offline
- Login ke Fonnte
- Scan QR code ulang
- Pastikan HP tetap online

## 🚀 Flow Lengkap di Aplikasi

```
PEGAWAI                          SISTEM                          HRD
   |                                |                              |
   |--[1] Isi Form Pengajuan------->|                              |
   |                                |--[2] Simpan ke DB (Pending)->|
   |                                |                              |
   |                                |<--[3] HRD Review Pengajuan---|
   |                                |                              |
   |                                |<--[4] HRD Klik Approve-------|
   |                                |                              |
   |                                |--[5] Update Status DB------->|
   |                                |                              |
   |<--[6] Kirim WhatsApp-----------|                              |
   |    "Pengajuan Disetujui"       |                              |
   |                                |                              |
```

## 📊 Response API

Ketika HRD update status, API akan return:

### Success (WhatsApp Terkirim):
```json
{
  "message": "Status pengajuan berhasil diupdate dan notifikasi telah dikirim ke 628123456789",
  "status": "approved",
  "whatsapp": {
    "sent": true,
    "phone": "628123456789"
  }
}
```

### Success (WhatsApp Gagal):
```json
{
  "message": "Status pengajuan berhasil diupdate, namun notifikasi WhatsApp gagal dikirim",
  "status": "approved",
  "whatsapp": {
    "sent": false,
    "error": "Device not connected"
  }
}
```

## 💡 Tips

1. **Testing Awal**: Gunakan nomor WA Anda sendiri untuk testing
2. **Catatan HRD**: Selalu isi catatan agar pegawai tahu alasannya
3. **Monitor Logs**: Pantau console untuk memastikan notifikasi terkirim
4. **Backup Plan**: Jika WhatsApp gagal, status tetap tersimpan di database

## 🔐 Keamanan

- Token Fonnte disimpan di `.env` (tidak di-commit ke Git)
- Nomor telepon divalidasi dan diformat otomatis
- Error handling mencegah crash jika WhatsApp gagal
- Status tetap tersimpan meskipun notifikasi gagal

## 📞 Support

Jika ada masalah:
1. Cek logs di console server
2. Cek dashboard Fonnte
3. Test dengan script `test-whatsapp-notification.js`
4. Pastikan device WhatsApp online

---

**Status**: ✅ Ready to Use
**Last Updated**: 2026-01-30
