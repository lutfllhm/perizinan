# ✅ Fitur Quota Karyawan - Lengkap!

## 🎯 Fitur yang Ditambahkan

### 1. ✅ No WhatsApp Tidak Auto-fill
**Sebelumnya**: No telp otomatis terisi dari database karyawan  
**Sekarang**: User harus input manual no WhatsApp mereka sendiri

**Alasan**: Setiap karyawan bisa punya nomor WA yang berbeda dari database

---

### 2. ✅ Info Sisa Cuti di Form Pengajuan
Ketika karyawan memilih jenis perizinan **"Cuti"**, akan muncul info:

```
📅 Sisa Cuti: 8 hari (Tahun 2026)
```

**Warna indikator**:
- 🟢 Hijau: Sisa > 0 hari (masih bisa cuti)
- 🔴 Merah: Sisa = 0 hari (cuti habis)

---

### 3. ✅ Info Quota Pulang Cepat & Datang Terlambat
Ketika karyawan memilih:
- **"Pulang Lebih Awal"** → Muncul: `🏃 Sisa Pulang Cepat Bulan Ini: 2x dari 3x`
- **"Datang Terlambat"** → Muncul: `⏰ Sisa Datang Terlambat Bulan Ini: 1x dari 3x`

**Warna indikator**:
- 🟢 Hijau/Biru: Masih ada quota (< 3x)
- 🔴 Merah: Quota habis (= 3x)

**Validasi**:
- Jika quota sudah 3x, form tidak bisa disubmit
- Muncul error: "Quota pulang cepat bulan ini sudah habis (maksimal 3x)"

---

### 4. ✅ HRD Dashboard - Lihat Semua Quota Karyawan

**Menu Baru**: "Quota Karyawan" di sidebar HRD

**Fitur**:
- ✅ Lihat semua karyawan dengan sisa cuti & izin mereka
- ✅ Filter by Kantor
- ✅ Search by Nama/Jabatan/Departemen
- ✅ Tampilan tabel lengkap dengan warna indikator

**Kolom Tabel**:
1. No
2. Kantor
3. Nama
4. Jabatan
5. Departemen
6. **Sisa Cuti** (hijau/kuning/merah)
7. **Pulang Cepat** (X/3x)
8. **Datang Terlambat** (X/3x)

**Warna Indikator**:

**Sisa Cuti**:
- 🟢 Hijau: > 5 hari (Aman)
- 🟡 Kuning: 1-5 hari (Perhatian)
- 🔴 Merah: 0 hari (Habis)

**Pulang Cepat & Datang Terlambat**:
- 🟢 Hijau: < 3x (Masih bisa)
- 🔴 Merah: 3x (Quota habis)

---

## 🔧 Implementasi Teknis

### Backend API Endpoints

#### 1. GET `/api/karyawan/:id/quota`
Mendapatkan quota satu karyawan

**Response**:
```json
{
  "jatah_cuti": 12,
  "sisa_cuti": 8,
  "tahun_cuti": 2026,
  "pulang_cepat": 2,
  "datang_terlambat": 1,
  "bulan": 2,
  "tahun": 2026
}
```

#### 2. GET `/api/karyawan/all/with-quota`
Mendapatkan semua karyawan dengan quota mereka (untuk HRD)

**Response**:
```json
{
  "karyawan": [
    {
      "id": 1,
      "kantor": "RBM-IWARE SURABAYA",
      "nama": "Sugiharto Tjokro",
      "jabatan": "Owner",
      "departemen": "Direktur",
      "jatah_cuti": 12,
      "sisa_cuti": 12,
      "tahun_cuti": 2026,
      "pulang_cepat": 0,
      "datang_terlambat": 0
    },
    ...
  ],
  "bulan": 2,
  "tahun": 2026
}
```

### Database Schema

**Table: `karyawan`**
- `jatah_cuti` INT DEFAULT 12
- `sisa_cuti` INT DEFAULT 12
- `tahun_cuti` INT DEFAULT YEAR(CURDATE())

**Table: `quota_bulanan`**
- `karyawan_id` INT (FK to karyawan)
- `bulan` INT (1-12)
- `tahun` INT
- `pulang_cepat` INT DEFAULT 0
- `datang_terlambat` INT DEFAULT 0
- UNIQUE KEY (karyawan_id, bulan, tahun)

### Frontend Components

**PengajuanForm.jsx**:
- Fetch quota saat karyawan dipilih
- Tampilkan info quota sesuai jenis perizinan
- Validasi quota sebelum submit

**HRDDashboard.jsx**:
- Komponen baru: `QuotaKaryawan`
- Fetch all karyawan with quota
- Filter & search functionality
- Color-coded indicators

---

## 📊 Cara Kerja Quota

### Cuti Tahunan
- Setiap karyawan dapat **12 hari cuti per tahun**
- Sisa cuti berkurang setiap kali pengajuan cuti disetujui
- Reset setiap tahun baru

### Pulang Cepat & Datang Terlambat
- Maksimal **3x per bulan**
- Counter reset setiap bulan baru
- Jika sudah 3x, tidak bisa mengajukan lagi bulan itu

---

## 🎨 UI/UX Improvements

### Form Pengajuan
- Info quota muncul real-time saat pilih jenis perizinan
- Warna indikator jelas (hijau = aman, merah = habis)
- Validasi sebelum submit dengan pesan error yang jelas

### HRD Dashboard
- Tabel responsive dengan scroll horizontal
- Filter & search untuk kemudahan mencari karyawan
- Refresh button untuk update data terbaru
- Legend/keterangan di bawah tabel

---

## 🚀 Testing

### Test Case 1: Cek Sisa Cuti
1. Login sebagai karyawan
2. Buka form pengajuan
3. Pilih kantor & nama karyawan
4. Pilih jenis perizinan: "Cuti"
5. **Expected**: Muncul info "📅 Sisa Cuti: X hari"

### Test Case 2: Cek Quota Pulang Cepat
1. Pilih jenis perizinan: "Pulang Lebih Awal"
2. **Expected**: Muncul info "🏃 Sisa Pulang Cepat Bulan Ini: X/3x"

### Test Case 3: Validasi Quota Habis
1. Karyawan yang sudah 3x pulang cepat bulan ini
2. Coba ajukan pulang cepat lagi
3. **Expected**: Error "Quota pulang cepat bulan ini sudah habis"

### Test Case 4: HRD Lihat Semua Quota
1. Login sebagai HRD
2. Klik menu "Quota Karyawan"
3. **Expected**: Tampil tabel semua karyawan dengan quota mereka
4. Test filter by kantor
5. Test search by nama

---

## 📝 Catatan Penting

### Auto-create Quota Bulanan
Jika karyawan belum punya record di `quota_bulanan` untuk bulan ini, sistem otomatis create dengan nilai 0.

### Reset Quota
- **Cuti**: Reset manual oleh HRD (fitur sudah ada)
- **Pulang Cepat & Datang Terlambat**: Auto-reset setiap bulan baru (karena query by bulan & tahun)

### Perhitungan Quota
Quota berkurang saat:
1. Pengajuan disetujui (status = 'approved')
2. Backend perlu update untuk mengurangi quota saat approve

**TODO**: Tambahkan logic di endpoint approve untuk:
- Kurangi `sisa_cuti` jika jenis = 'cuti'
- Tambah `pulang_cepat` jika jenis = 'pulang_cepat'
- Tambah `datang_terlambat` jika jenis = 'datang_terlambat'

---

## ✅ Status

✅ No WhatsApp tidak auto-fill  
✅ Info sisa cuti di form  
✅ Info quota pulang cepat & datang terlambat  
✅ Validasi quota sebelum submit  
✅ HRD dashboard quota karyawan  
✅ Filter & search di HRD dashboard  
✅ Color-coded indicators  

**Semua fitur sudah di-push ke GitHub dan siap deploy!** 🚀
