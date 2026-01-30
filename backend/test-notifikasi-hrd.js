/**
 * Script untuk simulasi notifikasi WhatsApp saat HRD approve/reject
 * Jalankan: node backend/test-notifikasi-hrd.js
 */

const https = require('https');

// ========================================
// KONFIGURASI - GANTI DENGAN DATA ANDA
// ========================================
const CONFIG = {
  // Token Fonnte dari .env
  token: 'f3LA5pzTUJvkbAX8ng9L',
  
  // Data Pegawai yang mengajukan
  pegawai: {
    nama: 'Budi Santoso',
    no_telp: '081234567890', // GANTI dengan nomor WA Anda untuk testing
    jenis_perizinan: 'Cuti Tahunan'
  },
  
  // Keputusan HRD
  keputusan: {
    status: 'approved', // 'approved' atau 'rejected'
    catatan: 'Pengajuan disetujui sesuai jadwal yang diajukan. Selamat berlibur!'
  }
};

// ========================================
// FUNGSI HELPER
// ========================================

// Format nomor telepon ke format WhatsApp (62xxx)
function formatPhoneNumber(phone) {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

// Buat pesan notifikasi
function createMessage(nama, status, jenisPerizinan, catatan) {
  if (status === 'approved') {
    return `
*✅ PENGAJUAN DISETUJUI*

Halo *${nama}*,

Pengajuan perizinan Anda telah *DISETUJUI* oleh HRD.

📋 *Detail Pengajuan:*
Jenis: ${jenisPerizinan}
Status: DISETUJUI ✅

${catatan ? `💬 *Catatan HRD:*\n${catatan}\n` : ''}
Silakan cek aplikasi untuk detail lebih lanjut.

Terima kasih.
_Sistem Perizinan IWARE_
    `.trim();
  } else if (status === 'rejected') {
    return `
*❌ PENGAJUAN DITOLAK*

Halo *${nama}*,

Mohon maaf, pengajuan perizinan Anda *DITOLAK* oleh HRD.

📋 *Detail Pengajuan:*
Jenis: ${jenisPerizinan}
Status: DITOLAK ❌

${catatan ? `💬 *Alasan Penolakan:*\n${catatan}\n` : ''}
Anda dapat mengajukan kembali dengan melengkapi persyaratan yang diperlukan.

Terima kasih.
_Sistem Perizinan IWARE_
    `.trim();
  }
}

// Kirim WhatsApp via Fonnte API
function sendWhatsApp(phone, message, callback) {
  const postData = JSON.stringify({
    target: phone,
    message: message,
    countryCode: '62'
  });

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

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      callback(null, { statusCode: res.statusCode, body: data });
    });
  });

  req.on('error', (error) => {
    callback(error, null);
  });

  req.write(postData);
  req.end();
}

// ========================================
// MAIN FUNCTION
// ========================================

function simulasiNotifikasiHRD() {
  console.log('🎭 SIMULASI NOTIFIKASI HRD\n');
  console.log('=' .repeat(60));
  
  // 1. Tampilkan data pengajuan
  console.log('\n📋 DATA PENGAJUAN:');
  console.log('   Nama Pegawai:', CONFIG.pegawai.nama);
  console.log('   No. Telepon:', CONFIG.pegawai.no_telp);
  console.log('   Jenis Izin:', CONFIG.pegawai.jenis_perizinan);
  
  // 2. Tampilkan keputusan HRD
  console.log('\n👔 KEPUTUSAN HRD:');
  console.log('   Status:', CONFIG.keputusan.status.toUpperCase());
  console.log('   Catatan:', CONFIG.keputusan.catatan);
  
  // 3. Format nomor telepon
  const formattedPhone = formatPhoneNumber(CONFIG.pegawai.no_telp);
  console.log('\n📱 NOMOR WHATSAPP:');
  console.log('   Original:', CONFIG.pegawai.no_telp);
  console.log('   Formatted:', formattedPhone);
  
  // 4. Buat pesan
  const message = createMessage(
    CONFIG.pegawai.nama,
    CONFIG.keputusan.status,
    CONFIG.pegawai.jenis_perizinan,
    CONFIG.keputusan.catatan
  );
  
  console.log('\n💬 PESAN YANG AKAN DIKIRIM:');
  console.log('─'.repeat(60));
  console.log(message);
  console.log('─'.repeat(60));
  
  // 5. Kirim WhatsApp
  console.log('\n📤 MENGIRIM NOTIFIKASI...\n');
  
  sendWhatsApp(formattedPhone, message, (error, response) => {
    if (error) {
      console.log('❌ GAGAL MENGIRIM!');
      console.log('   Error:', error.message);
      return;
    }
    
    try {
      const result = JSON.parse(response.body);
      
      console.log('📥 RESPONSE DARI FONNTE:');
      console.log('   Status Code:', response.statusCode);
      console.log('   Status:', result.status ? '✅ Success' : '❌ Failed');
      
      if (result.status) {
        console.log('   Message ID:', result.id);
        console.log('   Process:', result.process);
        if (result.quota) {
          console.log('   Quota Remaining:', result.quota[Object.keys(result.quota)[0]].remaining);
        }
        
        console.log('\n✅ NOTIFIKASI BERHASIL DIKIRIM!');
        console.log('   Cek WhatsApp di nomor:', formattedPhone);
        console.log('\n💡 Ini adalah cara kerja notifikasi saat HRD approve/reject pengajuan.');
      } else {
        console.log('   Reason:', result.reason);
        console.log('\n❌ NOTIFIKASI GAGAL!');
        
        if (result.reason && result.reason.includes('disconnected')) {
          console.log('\n🔧 SOLUSI:');
          console.log('   1. Buka https://fonnte.com');
          console.log('   2. Login dan buka menu "Device"');
          console.log('   3. Scan QR Code dengan WhatsApp di HP');
          console.log('   4. Pastikan status "Connected" (hijau)');
          console.log('   5. Jalankan script ini lagi');
        }
      }
    } catch (e) {
      console.log('⚠️ Response tidak bisa di-parse');
      console.log('   Raw response:', response.body);
    }
    
    console.log('\n' + '='.repeat(60));
  });
}

// ========================================
// JALANKAN SIMULASI
// ========================================

console.log('\n');
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║  SIMULASI NOTIFIKASI WHATSAPP SAAT HRD APPROVE/REJECT     ║');
console.log('╚════════════════════════════════════════════════════════════╝');

simulasiNotifikasiHRD();
