const axios = require('axios');
const otpGenerator = require('otp-generator');

// Konfigurasi WhatsApp API (Fonnte)
const FONNTE_API_URL = 'https://api.fonnte.com/send';
const FONNTE_TOKEN = process.env.FONNTE_TOKEN || ''; // Tambahkan di .env

// Store OTP sementara (production: gunakan Redis atau database)
const otpStore = new Map();

/**
 * Generate OTP code
 */
function generateOTP() {
  return otpGenerator.generate(6, { 
    upperCaseAlphabets: false, 
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true
  });
}

/**
 * Simpan OTP ke store dengan expiry 5 menit
 */
function saveOTP(phoneNumber, otp) {
  const expiryTime = Date.now() + (5 * 60 * 1000); // 5 menit
  otpStore.set(phoneNumber, { otp, expiryTime });
  
  // Auto delete setelah 5 menit
  setTimeout(() => {
    otpStore.delete(phoneNumber);
  }, 5 * 60 * 1000);
}

/**
 * Verifikasi OTP
 */
function verifyOTP(phoneNumber, otp) {
  const stored = otpStore.get(phoneNumber);
  
  if (!stored) {
    return { valid: false, message: 'OTP tidak ditemukan atau sudah expired' };
  }
  
  if (Date.now() > stored.expiryTime) {
    otpStore.delete(phoneNumber);
    return { valid: false, message: 'OTP sudah expired' };
  }
  
  if (stored.otp !== otp) {
    return { valid: false, message: 'OTP tidak valid' };
  }
  
  otpStore.delete(phoneNumber);
  return { valid: true, message: 'OTP valid' };
}

/**
 * Format nomor telepon ke format WhatsApp (62xxx)
 */
function formatPhoneNumber(phone) {
  // Hapus karakter non-digit
  let cleaned = phone.replace(/\D/g, '');
  
  // Jika diawali 0, ganti dengan 62
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  
  // Jika belum ada 62, tambahkan
  if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  
  return cleaned;
}

/**
 * Kirim OTP via WhatsApp menggunakan Fonnte
 */
async function sendOTPWhatsApp(phoneNumber, nama, status, jenisPerizinan, catatan = '') {
  try {
    // Generate OTP
    const otp = generateOTP();
    
    // Format nomor telepon
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Simpan OTP
    saveOTP(formattedPhone, otp);
    
    // Buat pesan
    const statusText = status === 'approved' ? 'DISETUJUI ✅' : 'DITOLAK ❌';
    const message = `
*NOTIFIKASI PERIZINAN IWARE*

Halo ${nama},

Pengajuan perizinan Anda untuk *${jenisPerizinan}* telah *${statusText}*

${catatan ? `Catatan: ${catatan}\n` : ''}
Kode OTP Anda: *${otp}*

Kode OTP berlaku selama 5 menit.

Terima kasih.
    `.trim();
    
    // Kirim via Fonnte API
    if (!FONNTE_TOKEN) {
      console.warn('⚠️ FONNTE_TOKEN tidak ditemukan, OTP tidak dikirim');
      console.log('📱 OTP untuk testing:', otp);
      return { success: true, otp, message: 'OTP generated (testing mode)' };
    }
    
    const response = await axios.post(
      FONNTE_API_URL,
      {
        target: formattedPhone,
        message: message,
        countryCode: '62'
      },
      {
        headers: {
          'Authorization': FONNTE_TOKEN
        }
      }
    );
    
    console.log('✅ WhatsApp OTP sent to:', formattedPhone);
    
    return {
      success: true,
      otp: otp, // Untuk testing, hapus di production
      data: response.data
    };
    
  } catch (error) {
    console.error('❌ Error sending WhatsApp OTP:', error.message);
    
    // Jika error, tetap return OTP untuk testing
    return {
      success: false,
      error: error.message,
      otp: otp // Untuk testing
    };
  }
}

/**
 * Kirim notifikasi tanpa OTP (opsional)
 */
async function sendWhatsAppNotification(phoneNumber, message) {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    if (!FONNTE_TOKEN) {
      console.warn('⚠️ FONNTE_TOKEN tidak ditemukan');
      return { success: false, message: 'Token not configured' };
    }
    
    const response = await axios.post(
      FONNTE_API_URL,
      {
        target: formattedPhone,
        message: message,
        countryCode: '62'
      },
      {
        headers: {
          'Authorization': FONNTE_TOKEN
        }
      }
    );
    
    console.log('✅ WhatsApp notification sent to:', formattedPhone);
    
    return {
      success: true,
      data: response.data
    };
    
  } catch (error) {
    console.error('❌ Error sending WhatsApp notification:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  generateOTP,
  sendOTPWhatsApp,
  sendWhatsAppNotification,
  verifyOTP,
  formatPhoneNumber
};
