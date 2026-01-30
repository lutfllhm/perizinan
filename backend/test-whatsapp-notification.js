require('dotenv').config();
const { sendOTPWhatsApp } = require('./services/whatsapp');

/**
 * Script untuk testing notifikasi WhatsApp
 * Jalankan: node backend/test-whatsapp-notification.js
 */

async function testNotification() {
  console.log('🧪 Testing WhatsApp Notification...\n');
  
  // Data testing - GANTI dengan nomor Anda
  const testData = {
    phoneNumber: '081234567890', // GANTI dengan nomor WA Anda
    nama: 'John Doe',
    jenisPerizinan: 'Cuti Tahunan',
    catatan: 'Pengajuan disetujui sesuai jadwal yang diajukan'
  };
  
  console.log('📋 Data Testing:');
  console.log('   Nama:', testData.nama);
  console.log('   No. Telp:', testData.phoneNumber);
  console.log('   Jenis:', testData.jenisPerizinan);
  console.log('   Catatan:', testData.catatan);
  console.log('');
  
  // Test 1: Notifikasi APPROVED
  console.log('📤 Test 1: Mengirim notifikasi APPROVED...');
  try {
    const result1 = await sendOTPWhatsApp(
      testData.phoneNumber,
      testData.nama,
      'approved',
      testData.jenisPerizinan,
      testData.catatan
    );
    
    if (result1.success) {
      console.log('✅ Notifikasi APPROVED berhasil dikirim!');
      console.log('   Phone:', result1.phone);
    } else {
      console.log('❌ Notifikasi APPROVED gagal:', result1.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n⏳ Menunggu 3 detik...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test 2: Notifikasi REJECTED
  console.log('📤 Test 2: Mengirim notifikasi REJECTED...');
  try {
    const result2 = await sendOTPWhatsApp(
      testData.phoneNumber,
      testData.nama,
      'rejected',
      testData.jenisPerizinan,
      'Dokumen pendukung belum lengkap. Silakan lengkapi dan ajukan kembali.'
    );
    
    if (result2.success) {
      console.log('✅ Notifikasi REJECTED berhasil dikirim!');
      console.log('   Phone:', result2.phone);
    } else {
      console.log('❌ Notifikasi REJECTED gagal:', result2.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n✅ Testing selesai!');
  console.log('\n💡 Tips:');
  console.log('   - Pastikan FONNTE_TOKEN sudah diisi di .env');
  console.log('   - Pastikan device WhatsApp sudah tersambung di Fonnte');
  console.log('   - Cek nomor telepon sudah benar (format: 08xxx atau 628xxx)');
}

// Jalankan test
testNotification().catch(console.error);
