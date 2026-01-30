# 🔍 Debug: Kenapa Notifikasi WhatsApp Tidak Terkirim?

## ❌ Masalah Anda

Sudah mengisi pengajuan dan HRD sudah approve, tapi **tidak dapat notifikasi WhatsApp**.

## 🔎 Checklist Debug

### 1. Aplikasi Berjalan Di Mana?

**A. Jika di LOCAL (localhost:3000):**

Cek apakah backend server berjalan:
```bash
# Buka terminal, jalankan:
cd backend
node server.js
```

Jika muncul error "Cannot find module 'axios'":
```bash
cd backend
npm install
node server.js
```

**B. Jika di RAILWAY (https://licensing-iw.up.railway.app):**

Environment variables **BELUM DI-SET** di Railway Dashboard!

---

### 2. Cek Environment Variables (PENTING!)

#### Jika di Railway:

1. **Login ke Railway**: https://railway.app
2. **Pilih project**: perizinan
3. **Klik service**: backend
4. **Klik tab**: Variables
5. **Cek apakah ada**:
   ```
   WHATSAPP_API_URL
   WHATSAPP_API_TOKEN
   WHATSAPP_ENABLED
   ```

**Jika TIDAK ADA** → Ini masalahnya!

**Solusi**: Tambahkan variables ini:
```
WHATSAPP_API_URL=https://api.fonnte.com/send
WHATSAPP_API_TOKEN=f3LA5pzTUJvkbAX8ng9L
WHATSAPP_ENABLED=true
```

Klik **"Add"** atau **"Save"**, tunggu redeploy selesai.

---

### 3. Cek Device WhatsApp di Fonnte

1. **Login ke Fonnte**: https://fonnte.com
2. **Buka menu**: Device
3. **Cek status**: Harus **"Connected"** (hijau)

**Jika "Disconnected"**:
- Scan QR Code dengan WhatsApp di HP
- Pastikan HP online dan WhatsApp aktif

---

### 4. Cek Logs (Untuk Tahu Error Apa)

#### Jika di Local:

Lihat terminal backend, saat HRD approve harusnya muncul:
```
✅ Status updated: 123 approved
📱 Preparing WhatsApp notification...
   Nama: Budi Santoso
   No. Telp: 081234567890
   Status: approved
   Jenis: Cuti Tahunan
📱 WhatsApp result: { success: true, phone: '6281234567890' }
```

Atau jika error:
```
❌ WhatsApp failed: disconnected device
```

#### Jika di Railway:

1. Railway Dashboard > Backend Service
2. Klik tab **"Deployments"**
3. Klik deployment yang aktif
4. Scroll logs, cari saat HRD approve

---

### 5. Test Manual (Untuk Memastikan API Berfungsi)

Jalankan script test:
```bash
cd backend
node test-notifikasi-hrd.js
```

**Edit file dulu**, ganti nomor telepon dengan nomor Anda:
```javascript
pegawai: {
  nama: 'Test User',
  no_telp: '081234567890', // GANTI INI
  jenis_perizinan: 'Cuti Tahunan'
},
```

Jika berhasil:
```
✅ NOTIFIKASI BERHASIL DIKIRIM!
   Cek WhatsApp di nomor: 6281234567890
```

Artinya: API berfungsi, masalah di aplikasi (environment variables atau server tidak jalan).

Jika gagal:
```
❌ NOTIFIKASI GAGAL!
   Reason: disconnected device
```

Artinya: Device WhatsApp tidak connected di Fonnte.

---

## 🎯 Kemungkinan Penyebab & Solusi

### Penyebab 1: Environment Variables Tidak Di-Set (PALING SERING!)

**Gejala**: 
- Approve berhasil
- Status berubah di database
- Tapi tidak ada notifikasi

**Solusi**:
- Railway: Set variables di Dashboard
- Local: Pastikan file `.env` ada dan benar

---

### Penyebab 2: Device WhatsApp Disconnected

**Gejala**:
- Test script gagal dengan error "disconnected device"

**Solusi**:
- Login ke Fonnte
- Scan QR Code lagi
- Pastikan HP online

---

### Penyebab 3: Server Backend Tidak Jalan (Local)

**Gejala**:
- Klik approve, tidak ada response
- Console browser ada error "Network Error"

**Solusi**:
```bash
cd backend
npm install
node server.js
```

---

### Penyebab 4: Nomor Telepon Salah Format

**Gejala**:
- Notifikasi "terkirim" tapi tidak masuk

**Solusi**:
- Pastikan nomor benar: 08xxx atau 628xxx
- Jangan pakai spasi atau karakter lain
- Nomor harus aktif WhatsApp

---

## 🧪 Langkah-Langkah Debug

### Step 1: Test API Dulu
```bash
cd backend
node test-notifikasi-hrd.js
```

- ✅ Berhasil → Masalah di aplikasi (lanjut Step 2)
- ❌ Gagal → Masalah di Fonnte (scan QR code)

### Step 2: Cek Environment Variables

**Railway**:
- Dashboard > Backend > Variables
- Pastikan ada WHATSAPP_API_TOKEN

**Local**:
- Cek file `backend/.env`
- Pastikan ada WHATSAPP_API_TOKEN

### Step 3: Cek Logs

**Railway**:
- Dashboard > Backend > Deployments > View Logs
- Cari error saat approve

**Local**:
- Lihat terminal backend
- Cari error saat approve

### Step 4: Test Lagi

- Buat pengajuan baru
- HRD approve
- Cek WhatsApp

---

## 📊 Response API (Untuk Debug)

Saat HRD approve, buka **Browser DevTools** (F12) > **Network** tab:

### Response Berhasil:
```json
{
  "message": "Status pengajuan berhasil diupdate dan notifikasi telah dikirim ke 6281234567890",
  "status": "approved",
  "whatsapp": {
    "sent": true,
    "phone": "6281234567890"
  }
}
```

### Response Gagal:
```json
{
  "message": "Status pengajuan berhasil diupdate, namun notifikasi WhatsApp gagal dikirim",
  "status": "approved",
  "whatsapp": {
    "sent": false,
    "error": "WHATSAPP_API_TOKEN tidak ditemukan"
  }
}
```

Error message akan kasih tahu masalahnya!

---

## 🆘 Masih Tidak Bisa?

Lakukan ini dan screenshot hasilnya:

1. **Test script**:
   ```bash
   cd backend
   node test-notifikasi-hrd.js
   ```
   Screenshot hasilnya

2. **Cek Fonnte**:
   - Login ke https://fonnte.com
   - Menu Device
   - Screenshot status device

3. **Cek Railway Variables** (jika pakai Railway):
   - Dashboard > Backend > Variables
   - Screenshot (blur token jika perlu)

4. **Cek Logs**:
   - Railway: Screenshot logs saat approve
   - Local: Screenshot terminal backend

Dengan info ini saya bisa bantu lebih spesifik!

---

## 💡 Tips Cepat

**Jika pakai Railway** (kemungkinan besar ini masalahnya):
1. Buka Railway Dashboard
2. Backend Service > Variables
3. Tambahkan 3 variables WhatsApp
4. Save dan tunggu redeploy
5. Test lagi

**Jika pakai Local**:
1. Pastikan backend server jalan
2. Pastikan file `.env` ada
3. Pastikan MySQL jalan
4. Test lagi

---

**Status**: Fitur sudah berfungsi, tinggal konfigurasi!
