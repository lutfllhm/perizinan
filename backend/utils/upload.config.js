// Konfigurasi upload file
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderUpload = path.join(__dirname, '..', 'uploads');
    // Buat folder uploads jika belum ada
    if (!fs.existsSync(folderUpload)) {
      fs.mkdirSync(folderUpload, { recursive: true });
    }
    cb(null, folderUpload);
  },
  filename: function (req, file, cb) {
    const suffiksUnik = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'bukti-' + suffiksUnik + path.extname(file.originalname));
  }
});

// Konfigurasi multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Batas 5MB
  fileFilter: function (req, file, cb) {
    const tipeYangDiizinkan = /jpeg|jpg|png|pdf/;
    const ekstensi = tipeYangDiizinkan.test(path.extname(file.originalname).toLowerCase());
    const mimetype = tipeYangDiizinkan.test(file.mimetype);
    
    if (mimetype && ekstensi) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya file .png, .jpg, .jpeg dan .pdf yang diizinkan!'));
    }
  }
});

module.exports = upload;
