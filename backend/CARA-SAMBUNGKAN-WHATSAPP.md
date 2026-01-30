# 📱 Cara Menyambungkan WhatsApp ke Fonnte

## ❌ Error yang Anda Alami

```
request invalid on disconnected device
```

Artinya: **Device WhatsApp belum tersambung ke Fonnte**

## ✅ Solusi: Sambungkan Device WhatsApp

### Langkah 1: Login ke Fonnte

1. Buka browser, kunjungi: **https://fonnte.com**
2. Login dengan akun Anda
3. Jika belum punya akun, daftar dulu (gratis)

### Langkah 2: Buka Menu Device

1. Setelah login, klik menu **"Device"** di sidebar kiri
2. Atau langsung ke: **https://fonnte.com/device**

### Langkah 3: Scan QR Code

1. Di halaman Device, Anda akan melihat **QR Code**
2. Buka WhatsApp di HP Anda
3. Pilih menu **"Linked Devices"** atau **"Perangkat Tertaut"**
4. Tap **"Link a Device"** atau **"Tautkan Perangkat"**
5. **Scan QR Code** yang muncul di website Fonnte
6. Tunggu sampai status berubah jadi **"Connected"** (hijau)

### Langkah 4: Verifikasi Status

Di halaman Device Fonnte, pastikan:
- ✅ Status: **Connected** (warna hijau)
- ✅ Device Name: Nama HP Anda
- ✅ Token: Sudah ada (sama dengan yang di .env)

### Langkah 5: Test Lagi

Setelah device connected, jalankan test lagi:

```bash
cd backend
node test-fonnte-simple.js
```

Sekarang harusnya berhasil! ✅

## 📸 Screenshot Panduan

### 1. Login Fonnte
```
https://fonnte.com
┌─────────────────────────┐
│  Login / Register       │
│  Email: ___________     │
│  Password: ________     │
│  [Login]                │
└─────────────────────────┘
```

### 2. Menu Device
```
Dashboard
├── Device  ← KLIK INI
├── API
├── Message
└── Settings
```

### 3. Scan QR Code
```
┌─────────────────────────┐
│  Device Status          │
│                         │
│  ┌─────────────┐        │
│  │ QR CODE     │        │
│  │ [████████]  │ ← SCAN │
│  │ [████████]  │        │
│  └─────────────┘        │
│                         │
│  Status: Disconnected   │
│  Token: f3LA5pzT...     │
└─────────────────────────┘
```

### 4. WhatsApp di HP
```
WhatsApp > Settings > Linked Devices
┌─────────────────────────┐
│  Linked Devices         │
│                         │
│  [+ Link a Device]  ← TAP│
│                         │
│  Camera akan terbuka    │
│  Arahkan ke QR Code     │
└─────────────────────────┘
```

### 5. Setelah Connected
```
┌─────────────────────────┐
│  Device Status          │
│                         │
│  Status: ✅ Connected   │
│  Device: iPhone 12      │
│  Token: f3LA5pzT...     │
│  Last Active: Just now  │
└─────────────────────────┘
```

## ⚠️ Penting!

1. **HP Harus Online**: WhatsApp di HP harus tetap online dan terkoneksi internet
2. **Jangan Logout**: Jangan logout WhatsApp di HP
3. **Battery Saver**: Matikan battery saver untuk WhatsApp agar tidak disconnect
4. **Stable Connection**: Pastikan koneksi internet HP stabil

## 🔄 Jika Disconnect

Device bisa disconnect karena:
- HP mati atau kehabisan baterai
- WhatsApp di-force close
- Koneksi internet HP terputus lama
- Logout WhatsApp di HP

**Solusi**: Scan QR Code lagi (ulangi Langkah 3)

## 🧪 Testing Setelah Connected

### Test 1: Via Script
```bash
cd backend
node test-fonnte-simple.js
```

Expected output:
```
✅ BERHASIL! Pesan terkirim ke WhatsApp
   Cek WhatsApp Anda di nomor: 6281234567890
```

### Test 2: Via Aplikasi

1. **Login sebagai Pegawai**
   - Buat pengajuan izin
   - Isi nomor WA Anda

2. **Login sebagai HRD**
   - Approve/Reject pengajuan
   - Isi catatan

3. **Cek WhatsApp**
   - Notifikasi masuk otomatis ✅

## 📊 Monitoring

### Cek Status Device
```bash
# Via browser
https://fonnte.com/device

# Atau via API (opsional)
curl -X POST https://api.fonnte.com/status \
  -H "Authorization: f3LA5pzTUJvkbAX8ng9L"
```

### Cek Logs Server
```bash
# Saat HRD approve/reject, lihat console:
✅ WhatsApp notification sent to: 628123456789
```

## 💰 Quota & Pricing

Fonnte punya beberapa paket:
- **Free Trial**: Biasanya dapat beberapa pesan gratis
- **Paid Plan**: Mulai dari Rp 50.000/bulan

Cek quota di: https://fonnte.com/dashboard

## 🆘 Troubleshooting

### Error: "disconnected device"
→ Scan QR Code lagi

### Error: "invalid token"
→ Copy token baru dari Fonnte, update di .env

### Error: "quota exceeded"
→ Top up saldo di Fonnte

### Pesan tidak masuk
→ Cek nomor telepon format benar (08xxx atau 628xxx)

## ✅ Checklist

Sebelum production, pastikan:
- [ ] Device WhatsApp connected di Fonnte
- [ ] Token sudah benar di .env
- [ ] Test script berhasil
- [ ] Test via aplikasi berhasil
- [ ] HP WhatsApp online 24/7
- [ ] Quota Fonnte mencukupi

## 📞 Support Fonnte

Jika ada masalah dengan Fonnte:
- Website: https://fonnte.com
- Support: https://fonnte.com/support
- WhatsApp: Biasanya ada di website mereka

---

**Next Step**: Setelah device connected, test lagi dengan script atau langsung via aplikasi!
