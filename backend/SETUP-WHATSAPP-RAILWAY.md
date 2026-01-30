# 🚀 Setup WhatsApp Notifikasi di Railway

## ❌ Masalah: Notifikasi Tidak Terkirim di Production

Jika notifikasi WhatsApp tidak terkirim saat aplikasi berjalan di Railway, kemungkinan **environment variables belum di-set di Railway Dashboard**.

## ✅ Solusi: Tambahkan Environment Variables di Railway

### Langkah 1: Login ke Railway Dashboard

1. Buka https://railway.app
2. Login dengan akun Anda
3. Pilih project **perizinan** Anda

### Langkah 2: Buka Backend Service

1. Klik service **backend** (yang menjalankan Node.js)
2. Klik tab **"Variables"** di menu atas

### Langkah 3: Tambahkan Variables WhatsApp

Tambahkan 3 environment variables berikut:

```
WHATSAPP_API_URL=https://api.fonnte.com/send
WHATSAPP_API_TOKEN=f3LA5pzTUJvkbAX8ng9L
WHATSAPP_ENABLED=true
```

**Cara menambahkan:**
1. Klik tombol **"+ New Variable"** atau **"Raw Editor"**
2. Paste 3 baris di atas
3. Klik **"Add"** atau **"Save"**

### Langkah 4: Redeploy Backend

Setelah menambahkan variables:
1. Railway akan otomatis redeploy
2. Atau klik **"Deploy"** manual jika tidak otomatis
3. Tunggu sampai deployment selesai (status: Active)

### Langkah 5: Test Notifikasi

1. **Login sebagai Pegawai**
   - Buat pengajuan izin baru
   - Isi nomor WhatsApp Anda (format: 08xxx atau 628xxx)

2. **Login sebagai HRD**
   - Buka dashboard HRD
   - Approve atau Reject pengajuan
   - Isi catatan (opsional)

3. **Cek WhatsApp**
   - Notifikasi akan masuk dalam beberapa detik
   - Format pesan sesuai status (approved/rejected)

## 📸 Screenshot Railway Dashboard

### Variables Tab
```
┌─────────────────────────────────────────────┐
│  Backend Service > Variables                │
├─────────────────────────────────────────────┤
│  [+ New Variable]  [Raw Editor]             │
│                                             │
│  NODE_ENV = production                      │
│  PORT = 5000                                │
│  JWT_SECRET = b5f51c7f57f3f0d...           │
│  FRONTEND_URL = https://licensing-iw...     │
│                                             │
│  ← TAMBAHKAN INI:                           │
│  WHATSAPP_API_URL = https://api.fonnte...   │
│  WHATSAPP_API_TOKEN = f3LA5pzTUJvkbAX...    │
│  WHATSAPP_ENABLED = true                    │
└─────────────────────────────────────────────┘
```

## 🔍 Verifikasi Setup

### 1. Cek Logs Railway

Setelah HRD approve/reject, cek logs di Railway:

1. Buka service **backend**
2. Klik tab **"Deployments"**
3. Klik deployment yang aktif
4. Lihat logs, cari:

```
✅ WhatsApp notification sent to: 628123456789
📱 Status: approved | Jenis: Cuti Tahunan
```

Atau jika gagal:
```
❌ Error sending WhatsApp notification: ...
⚠️ WHATSAPP_API_TOKEN tidak ditemukan
```

### 2. Cek Response API

Gunakan browser DevTools (F12) > Network tab:
- Saat HRD klik Approve/Reject
- Lihat response dari API `/api/pengajuan/:id`
- Harusnya ada field `whatsapp.sent: true`

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

## 🐛 Troubleshooting

### Error: "WHATSAPP_API_TOKEN tidak ditemukan"

**Penyebab**: Environment variable belum di-set di Railway

**Solusi**:
1. Buka Railway Dashboard > Backend Service > Variables
2. Tambahkan `WHATSAPP_API_TOKEN=f3LA5pzTUJvkbAX8ng9L`
3. Save dan tunggu redeploy

### Error: "disconnected device"

**Penyebab**: WhatsApp device tidak connected di Fonnte

**Solusi**:
1. Buka https://fonnte.com
2. Login dan buka menu "Device"
3. Scan QR Code dengan WhatsApp di HP
4. Pastikan status "Connected" (hijau)
5. Test lagi

### Notifikasi masih tidak terkirim

**Cek checklist ini:**
- [ ] Environment variables sudah di-set di Railway
- [ ] Backend sudah redeploy setelah set variables
- [ ] Device WhatsApp connected di Fonnte
- [ ] Nomor telepon pegawai benar (format 08xxx atau 628xxx)
- [ ] Quota Fonnte masih ada
- [ ] Logs Railway tidak ada error

## 📊 Monitoring

### Cek Quota Fonnte

1. Login ke https://fonnte.com
2. Dashboard akan menampilkan:
   - Quota remaining
   - Messages sent today
   - Device status

### Cek Logs Real-time

```bash
# Via Railway CLI (opsional)
railway logs --service backend

# Atau via Dashboard
Railway > Backend > Deployments > View Logs
```

## 🔐 Keamanan

**PENTING**: Jangan commit file `.env` ke Git!

File yang sudah di-gitignore:
- `.env`
- `.env.local`
- `.env.production`
- `.env.railway.local`

Token Fonnte hanya ada di:
- Railway Dashboard (production)
- File `.env` local (development)

## 📝 Checklist Deployment

Sebelum production, pastikan:

- [ ] Environment variables sudah di-set di Railway:
  - [ ] `WHATSAPP_API_URL`
  - [ ] `WHATSAPP_API_TOKEN`
  - [ ] `WHATSAPP_ENABLED`
- [ ] Device WhatsApp connected di Fonnte
- [ ] Test notifikasi berhasil di local
- [ ] Test notifikasi berhasil di production
- [ ] Logs Railway tidak ada error
- [ ] Quota Fonnte mencukupi

## 🆘 Support

Jika masih ada masalah:

1. **Cek Logs Railway** - Lihat error message detail
2. **Test di Local** - Jalankan `node backend/test-fonnte-simple.js`
3. **Cek Fonnte Dashboard** - Pastikan device connected
4. **Cek Network** - Pastikan Railway bisa akses api.fonnte.com

---

**Next Step**: Set environment variables di Railway Dashboard, redeploy, dan test!
