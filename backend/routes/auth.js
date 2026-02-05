const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/mysql');

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('🔐 Login attempt:', { username });

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username dan password harus diisi' 
      });
    }

    // Cari user
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ 
        message: 'Username atau password salah' 
      });
    }

    const user = rows[0];

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', username);
      return res.status(401).json({ 
        message: 'Username atau password salah' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful:', username);

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
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat login',
      error: error.message 
    });
  }
});

// Register HRD (hanya bisa dilakukan oleh admin)
router.post('/register-hrd', async (req, res) => {
  try {
    const { username, password, nama } = req.body;

    console.log('📝 Register HRD attempt:', { username, nama });

    // Validasi input
    if (!username || !password || !nama) {
      return res.status(400).json({ 
        message: 'Username, password, dan nama harus diisi' 
      });
    }

    // Cek apakah username sudah ada
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      console.log('❌ Username already exists:', username);
      return res.status(400).json({ 
        message: 'Username sudah digunakan' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user baru
    await db.query(
      'INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, nama, 'hrd']
    );

    console.log('✅ HRD registered successfully:', username);

    res.status(201).json({
      message: 'HRD berhasil didaftarkan',
      user: {
        username,
        nama,
        role: 'hrd'
      }
    });

  } catch (error) {
    console.error('❌ Register HRD error:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat mendaftarkan HRD',
      error: error.message 
    });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [rows] = await db.query(
      'SELECT id, username, nama, role FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json({ user: rows[0] });

  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(401).json({ 
      message: 'Token tidak valid',
      error: error.message 
    });
  }
});

// Get all users (untuk admin)
router.get('/users', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Cek apakah user adalah admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang dapat melihat daftar user' });
    }

    const [rows] = await db.query(
      'SELECT id, username, nama, role, created_at FROM users ORDER BY created_at DESC'
    );

    console.log('✅ Get users successful, count:', rows.length);

    res.json({ users: rows });

  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat mengambil data user',
      error: error.message 
    });
  }
});

// Delete user (untuk admin)
router.delete('/users/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Cek apakah user adalah admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang dapat menghapus user' });
    }

    const userId = req.params.id;

    // Cek apakah user yang akan dihapus adalah diri sendiri
    if (decoded.id === parseInt(userId)) {
      return res.status(400).json({ message: 'Tidak dapat menghapus akun sendiri' });
    }

    // Cek apakah user ada
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Hapus user
    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    console.log('✅ User deleted successfully:', userId);

    res.json({ message: 'User berhasil dihapus' });

  } catch (error) {
    console.error('❌ Delete user error:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat menghapus user',
      error: error.message 
    });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { nama } = req.body;

    if (!nama) {
      return res.status(400).json({ message: 'Nama harus diisi' });
    }

    await db.query(
      'UPDATE users SET nama = ? WHERE id = ?',
      [nama, decoded.id]
    );

    console.log('✅ Profile updated successfully for user:', decoded.id);

    res.json({ message: 'Profil berhasil diperbarui' });

  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat memperbarui profil',
      error: error.message 
    });
  }
});

// Change password
router.put('/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { passwordLama, passwordBaru } = req.body;

    console.log('🔐 Change password attempt for user:', decoded.id);

    // Validasi input
    if (!passwordLama || !passwordBaru) {
      return res.status(400).json({ 
        message: 'Password lama dan password baru harus diisi' 
      });
    }

    if (passwordBaru.length < 6) {
      return res.status(400).json({ 
        message: 'Password baru minimal 6 karakter' 
      });
    }

    // Ambil data user
    const [rows] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const user = rows[0];

    // Verifikasi password lama
    const isValidPassword = await bcrypt.compare(passwordLama, user.password);

    if (!isValidPassword) {
      console.log('❌ Invalid old password for user:', decoded.id);
      return res.status(401).json({ 
        message: 'Password lama tidak sesuai' 
      });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(passwordBaru, 10);

    // Update password
    await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, decoded.id]
    );

    console.log('✅ Password changed successfully for user:', decoded.id);

    res.json({ message: 'Password berhasil diubah' });

  } catch (error) {
    console.error('❌ Change password error:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat mengubah password',
      error: error.message 
    });
  }
});

module.exports = router;
