// Route untuk autentikasi
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dapatkanDatabase } = require('../services/database.service');
const { auth } = require('../middleware/auth');

/**
 * POST /api/auth/login
 * Login user (admin/hrd)
 */
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Percobaan login:', req.body);
    
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password harus diisi' });
    }

    const db = dapatkanDatabase();
    if (!db) {
      return res.status(500).json({ message: 'Database tidak terhubung' });
    }

    // Ambil data user
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      console.log('❌ User tidak ditemukan:', username);
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const user = rows[0];

    // Verifikasi password
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      console.log('❌ Password tidak valid');
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ Login berhasil:', username);

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        username: user.username,
        nama: user.nama,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Error login:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat login',
      error: error.message 
    });
  }
});

/**
 * GET /api/auth/users
 * Ambil semua user (admin only)
 */
router.get('/users', auth, async (req, res) => {
  try {
    const db = dapatkanDatabase();
    
    const [rows] = await db.query(
      'SELECT id, username, nama, role, created_at FROM users ORDER BY created_at DESC'
    );
    
    res.json({ users: rows });
  } catch (error) {
    console.error('❌ Error ambil users:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/auth/register-hrd
 * Daftarkan user HRD baru (admin only)
 */
router.post('/register-hrd', auth, async (req, res) => {
  try {
    const db = dapatkanDatabase();
    const { username, password, nama } = req.body;

    if (!username || !password || !nama) {
      return res.status(400).json({ message: 'Username, password, dan nama harus diisi' });
    }

    // Cek apakah username sudah ada
    const [existingUsers] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    await db.query(
      'INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)',
      [username, passwordHash, nama, 'hrd']
    );

    console.log('✅ HRD terdaftar:', username);

    res.status(201).json({
      message: 'HRD berhasil didaftarkan',
      user: { username, nama, role: 'hrd' }
    });

  } catch (error) {
    console.error('❌ Error daftar HRD:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE /api/auth/users/:id
 * Hapus user (admin only)
 */
router.delete('/users/:id', auth, async (req, res) => {
  try {
    const db = dapatkanDatabase();
    const userId = req.params.id;

    // Cek apakah user ada
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Hapus user
    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    console.log('✅ User dihapus:', userId);

    res.json({ message: 'User berhasil dihapus' });

  } catch (error) {
    console.error('❌ Error hapus user:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
