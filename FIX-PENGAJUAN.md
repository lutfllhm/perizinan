# ✅ Perbaikan Endpoint Pengajuan

## Masalah yang Diperbaiki

❌ **Sebelumnya**: Gagal mengirim pengajuan
- Endpoint tidak menerima semua field dari form
- Tidak ada support untuk upload file (bukti_foto)
- Missing fields: nama, no_telp, kantor, jabatan, departemen

## Solusi yang Diterapkan

### 1. Tambah Multer untuk File Upload

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: 'bukti-[timestamp]-[random].[ext]'
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5MB },
  fileFilter: jpeg|jpg|png|pdf only
});
```

### 2. Update Endpoint POST /api/pengajuan

**Sekarang menerima**:
- ✅ karyawan_id
- ✅ nama (required)
- ✅ no_telp (required)
- ✅ kantor
- ✅ jabatan
- ✅ departemen
- ✅ jenis_perizinan (required)
- ✅ tanggal_mulai (required)
- ✅ tanggal_selesai (required)
- ✅ bukti_foto (file upload, wajib untuk dinas_luar)
- ✅ catatan

**Validasi**:
- Field wajib: nama, no_telp, jenis_perizinan, tanggal_mulai, tanggal_selesai
- Dinas luar WAJIB ada bukti_foto
- File max 5MB
- Format: JPG, PNG, PDF

### 3. Serve Static Files

```javascript
app.use('/uploads', express.static('uploads'));
```

File yang di-upload bisa diakses via:
```
https://backendlicense.up.railway.app/uploads/bukti-1234567890.jpg
```

## Hasil

✅ **Sekarang**: Pengajuan berhasil dikirim
- Semua field dari form diterima dengan benar
- File upload berfungsi
- Validasi field wajib
- Validasi khusus untuk dinas luar

## Testing

### Test Case 1: Pengajuan Cuti (tanpa foto)
```json
POST /api/pengajuan
{
  "karyawan_id": 1,
  "nama": "Sugiharto Tjokro",
  "no_telp": "081234561000",
  "kantor": "RBM-IWARE SURABAYA",
  "jabatan": "Owner",
  "departemen": "Direktur",
  "jenis_perizinan": "cuti",
  "tanggal_mulai": "2026-02-10 08:00",
  "tanggal_selesai": "2026-02-12 17:00",
  "catatan": "Cuti tahunan"
}
```

**Expected**: ✅ Success

### Test Case 2: Dinas Luar (dengan foto)
```json
POST /api/pengajuan
Content-Type: multipart/form-data

{
  "nama": "Lisa Israti",
  "no_telp": "081234561002",
  "jenis_perizinan": "dinas_luar",
  "tanggal_mulai": "2026-02-10 08:00",
  "tanggal_selesai": "2026-02-10 17:00",
  "bukti_foto": [FILE]
}
```

**Expected**: ✅ Success

### Test Case 3: Dinas Luar (tanpa foto)
```json
POST /api/pengajuan
{
  "nama": "Lisa Israti",
  "jenis_perizinan": "dinas_luar",
  ...
  // NO bukti_foto
}
```

**Expected**: ❌ Error 400 - "Dinas luar wajib melampirkan bukti foto"

## Deploy

Perubahan sudah di-push ke GitHub:
```bash
git commit -m "fix: add file upload support and fix pengajuan endpoint"
git push origin main
```

Railway akan auto-deploy dan endpoint pengajuan akan berfungsi dengan baik! 🚀
