const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { auth, isAdmin } = require('../middleware/auth');

// Test database connection
router.get('/test-db', async (req, res) => {
  try {
    const [result] = await db.query('SELECT 1 as test');
    const [tables] = await db.query('SHOW TABLES');
    const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');
    
    res.json({
      status: 'OK',
      message: 'Database connection successful',
      test_query: result[0],
      tables: tables.map(t => Object.values(t)[0]),
      user_count: userCount[0].count
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Login - Masuk ke sistem
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Cari user berdasarkan username
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }
    
    const user = users[0];
    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }
    
    // Buat token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        nama: user.nama,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// Daftarkan HRD baru (hanya admin yang bisa)
router.post('/register-hrd', auth, isAdmin, async (req, res) => {
  try {
    const { username, password, nama } = req.body;
    
    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.query(
      'INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, nama, 'hrd']
    );
    
    res.status(201).json({ message: 'HRD berhasil didaftarkan' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// Ambil semua data user (hanya admin yang bisa)
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, nama, role, created_at FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// Hapus user (hanya admin yang bisa)
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// Update profil user (user yang login sendiri)
router.put('/profile', auth, async (req, res) => {
  try {
    const { nama } = req.body;
    const userId = req.user.id;

    await db.query(
      'UPDATE users SET nama = ? WHERE id = ?',
      [nama, userId]
    );

    res.json({ message: 'Profil berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// Ganti password (user yang login sendiri)
router.put('/change-password', auth, async (req, res) => {
  try {
    const { passwordLama, passwordBaru } = req.body;
    const userId = req.user.id;

    // Ambil data user
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const user = users[0];

    // Verifikasi password lama
    const isMatch = await bcrypt.compare(passwordLama, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Password lama tidak sesuai' });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(passwordBaru, 10);

    // Update password
    await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    res.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

module.exports = router;
