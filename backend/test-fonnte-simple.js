/**
 * Simple test untuk Fonnte API tanpa dependencies
 * Jalankan: node backend/test-fonnte-simple.js
 */

const https = require('https');

// Konfigurasi - GANTI dengan data Anda
const CONFIG = {
  token: 'f3LA5pzTUJvkbAX8ng9L', // Token dari .env
  targetPhone: '081234567890',    // GANTI dengan nomor WA Anda
  nama: 'Test User',
  jenisPerizinan: 'Cuti Tahunan'
};

// Format nomor telepon
function formatPhone(phone) {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

// Buat pesan
const formattedPhone = formatPhone(CONFIG.targetPhone);
const message = `
*✅ PENGAJUAN DISETUJUI*

Halo *${CONFIG.nama}*,

Pengajuan perizinan Anda telah *DISETUJUI* oleh HRD.

📋 *Detail Pengajuan:*
Jenis: ${CONFIG.jenisPerizinan}
Status: DISETUJUI ✅

💬 *Catatan HRD:*
Ini adalah pesan testing dari sistem

Silakan cek aplikasi untuk detail lebih lanjut.

Terima kasih.
_Sistem Perizinan IWARE_
`.trim();

// Data untuk dikirim
const postData = JSON.stringify({
  target: formattedPhone,
  message: message,
  countryCode: '62'
});

// Options untuk HTTPS request
const options = {
  hostname: 'api.fonnte.com',
  port: 443,
  path: '/send',
  method: 'POST',
  headers: {
    'Authorization': CONFIG.token,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing Fonnte API...\n');
console.log('📋 Konfigurasi:');
console.log('   Token:', CONFIG.token.substring(0, 10) + '...');
console.log('   Target:', CONFIG.targetPhone, '→', formattedPhone);
console.log('   Nama:', CONFIG.nama);
console.log('   Jenis:', CONFIG.jenisPerizinan);
console.log('\n📤 Mengirim pesan...\n');

// Kirim request
const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📥 Response Status:', res.statusCode);
    console.log('📥 Response Body:', data);
    
    try {
      const response = JSON.parse(data);
      
      if (res.statusCode === 200 && response.status) {
        console.log('\n✅ BERHASIL! Pesan terkirim ke WhatsApp');
        console.log('   Cek WhatsApp Anda di nomor:', formattedPhone);
      } else {
        console.log('\n❌ GAGAL! Pesan tidak terkirim');
        console.log('   Reason:', response.reason || 'Unknown');
      }
    } catch (e) {
      console.log('\n⚠️ Response tidak bisa di-parse:', e.message);
    }
    
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Pastikan token benar di .env');
    console.log('   2. Cek device WhatsApp connected di https://fonnte.com');
    console.log('   3. Pastikan nomor telepon benar');
    console.log('   4. Cek quota/saldo Fonnte');
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write(postData);
req.end();
