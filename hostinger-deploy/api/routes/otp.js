const express = require('express');
const router = express.Router();
const { verifyOTP, formatPhoneNumber } = require('../services/whatsapp');

// Verifikasi OTP
router.post('/verify', async (req, res) => {
  try {
    const { no_telp, otp } = req.body;

    if (!no_telp || !otp) {
      return res.status(400).json({ 
        message: 'Nomor telepon dan OTP wajib diisi' 
      });
    }

    const formattedPhone = formatPhoneNumber(no_telp);
    const result = verifyOTP(formattedPhone, otp);

    if (result.valid) {
      res.json({
        success: true,
        message: 'OTP berhasil diverifikasi'
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }

  } catch (error) {
    console.error('❌ Error verify OTP:', error);
    res.status(500).json({ 
      message: 'Gagal memverifikasi OTP',
      error: error.message 
    });
  }
});

module.exports = router;
