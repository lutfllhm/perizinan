/**
 * Script untuk cek konfigurasi WhatsApp
 * Jalankan: node backend/check-config.js
 */

require('dotenv').config();

console.log('\n🔍 CEK KONFIGURASI WHATSAPP\n');
console.log('='.repeat(60));

// Cek environment variables
console.log('\n📋 ENVIRONMENT VARIABLES:');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('   PORT:', process.env.PORT || 'not set');
console.log('');

// Cek WhatsApp config
const whatsappUrl = process.env.WHATSAPP_API_URL;
const whatsappToken = process.env.WHATSAPP_API_TOKEN;
const whatsappEnabled = process.env.WHATSAPP_ENABLED;

console.log('📱 WHATSAPP CONFIGURATION:');

if (!whatsappUrl) {
  console.log('   ❌ WHATSAPP_API_URL: NOT SET');
} else {
  console.log('   ✅ WHATSAPP_API_URL:', whatsappUrl);
}

if (!whatsappToken) {
  console.log('   ❌ WHATSAPP_API_TOKEN: NOT SET');
  console.log('      ⚠️  MASALAH: Token tidak ditemukan!');
} else {
  const maskedToken = whatsappToken.substring(0, 10) + '...';
  console.log('   ✅ WHATSAPP_API_TOKEN:', maskedToken);
}

if (!whatsappEnabled) {
  console.log('   ⚠️  WHATSAPP_ENABLED: NOT SET (default: false)');
} else {
  console.log('   ✅ WHATSAPP_ENABLED:', whatsappEnabled);
}

console.log('\n' + '='.repeat(60));

// Kesimpulan
console.log('\n📊 KESIMPULAN:\n');

if (!whatsappToken) {
  console.log('❌ KONFIGURASI TIDAK LENGKAP!');
  console.log('');
  console.log('🔧 SOLUSI:');
  console.log('');
  console.log('Jika di LOCAL:');
  console.log('   1. Buka file backend/.env');
  console.log('   2. Pastikan ada baris:');
  console.log('      WHATSAPP_API_TOKEN=f3LA5pzTUJvkbAX8ng9L');
  console.log('   3. Save file');
  console.log('   4. Restart server');
  console.log('');
  console.log('Jika di RAILWAY:');
  console.log('   1. Login ke https://railway.app');
  console.log('   2. Pilih project > Backend service');
  console.log('   3. Tab Variables > Tambahkan:');
  console.log('      WHATSAPP_API_TOKEN=f3LA5pzTUJvkbAX8ng9L');
  console.log('   4. Save dan tunggu redeploy');
} else {
  console.log('✅ KONFIGURASI LENGKAP!');
  console.log('');
  console.log('Notifikasi WhatsApp seharusnya berfungsi.');
  console.log('');
  console.log('Jika masih tidak terkirim, cek:');
  console.log('   1. Device WhatsApp connected di https://fonnte.com');
  console.log('   2. Nomor telepon pegawai benar (08xxx atau 628xxx)');
  console.log('   3. Logs server saat HRD approve');
  console.log('');
  console.log('Test notifikasi dengan:');
  console.log('   node backend/test-notifikasi-hrd.js');
}

console.log('\n' + '='.repeat(60) + '\n');
