/**
 * Test Script untuk Notifikasi WhatsApp dari Nomor HRD
 * 
 * Script ini untuk testing pengiriman notifikasi WhatsApp
 * dari nomor HRD (085708600406) ke pegawai
 */

require('dotenv').config();
const { sendOTPWhatsApp } = require('./services/whatsapp');

async function testHRDNotification() {
  console.log('🧪 Testing Notifikasi WhatsApp dari HRD...\n');
  
  // Informasi konfigurasi
  console.log('📋 Konfigurasi:');
  console.log('- API URL:', process.env.WHATSAPP_API_URL);
  console.log('- Token:', process.env.WHATSAPP_API_TOKEN ? '✅ Configured' : '❌ Not configured');
  console.log('- Nomor HRD:', process.env.WHATSAPP_HRD_NUMBER || '085708600406');
  console.log('- Enabled:', process.env.WHATSAPP_ENABLED);
  console.log('');
  
  // Test data pegawai
  const testData = {
    nama: 'Budi Santoso',
    no_telp: '081234567890', // Ganti dengan nomor test Anda
    jenis_perizinan: 'Cuti Tahunan',
    status: 'approved',
    catatan: 'Pengajuan cuti disetujui. Selamat berlibur!'
  };
  
  console.log('📱 Test Data:');
  console.log('- Nama Pegawai:', testData.nama);
  console.log('- No. Telp:', testData.no_telp);
  console.log('- Jenis Perizinan:', testData.jenis_perizinan);
  console.log('- Status:', testData.status);
  console.log('- Catatan:', testData.catatan);
  console.log('');
  
  // Test 1: Notifikasi Approved
  console.log('🧪 Test 1: Mengirim notifikasi APPROVED...');
  try {
    const result1 = await sendOTPWhatsApp(
      testData.no_telp,
      testData.nama,
      'approved',
      testData.jenis_perizinan,
      testData.catatan
    );
    
    if (result1.success) {
      console.log('✅ Test 1 PASSED - Notifikasi approved berhasil dikirim');
      console.log('   Response:', JSON.stringify(result1.data, null, 2));
    } else {
      console.log('❌ Test 1 FAILED - Notifikasi approved gagal');
      console.log('   Error:', result1.error);
    }
  } catch (error) {
    console.log('❌ Test 1 ERROR:', error.message);
  }
  
  console.log('');
  
  // Delay 3 detik sebelum test berikutnya
  console.log('⏳ Menunggu 3 detik...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test 2: Notifikasi Rejected
  console.log('🧪 Test 2: Mengirim notifikasi REJECTED...');
  try {
    const result2 = await sendOTPWhatsApp(
      testData.no_telp,
      testData.nama,
      'rejected',
      testData.jenis_perizinan,
      'Dokumen pendukung belum lengkap. Silakan lengkapi dan ajukan kembali.'
    );
    
    if (result2.success) {
      console.log('✅ Test 2 PASSED - Notifikasi rejected berhasil dikirim');
      console.log('   Response:', JSON.stringify(result2.data, null, 2));
    } else {
      console.log('❌ Test 2 FAILED - Notifikasi rejected gagal');
      console.log('   Error:', result2.error);
    }
  } catch (error) {
    console.log('❌ Test 2 ERROR:', error.message);
  }
  
  console.log('');
  console.log('✅ Testing selesai!');
  console.log('');
  console.log('📝 Catatan:');
  console.log('- Pesan akan dikirim dari nomor HRD: 085708600406');
  console.log('- Pastikan nomor tersebut sudah terhubung di akun Fonnte Anda');
  console.log('- Cek WhatsApp pegawai untuk melihat pesan yang diterima');
  console.log('- Pesan akan muncul dari nomor HRD, bukan dari sistem');
}

// Jalankan test
testHRDNotification().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
