const jwt = require('jsonwebtoken');

// Middleware untuk autentikasi - Memeriksa token JWT
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid.' });
  }
};

// Middleware untuk memeriksa role Admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang diizinkan.' });
  }
  next();
};

// Middleware untuk memeriksa role HRD atau Admin
const isHRD = (req, res, next) => {
  if (req.user.role !== 'hrd' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak. Hanya HRD yang diizinkan.' });
  }
  next();
};

module.exports = { auth, isAdmin, isHRD };
