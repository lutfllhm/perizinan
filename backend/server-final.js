const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 FINAL SERVER STARTING...');
console.log('📍 Port:', PORT);

// CORS - allow all
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
let db;
async function connectDB() {
  try {
    db = await mysql.createPool({
      host: process.env.MYSQLHOST || process.env.DB_HOST,
      port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
      user: process.env.MYSQLUSER || process.env.DB_USER,
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
      database: process.env.MYSQLDATABASE || process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log('✅ Database connected');
    return db;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return null;
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server berjalan dengan baik',
    timestamp: new Date().toISOString()
  });
});

// LOGIN ROUTE - HARDCODED
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body);
    
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password harus diisi' });
    }

    if (!db) {
      await connectDB();
    }

    // Get user
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const user = rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'default-secret-key',
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

// Get karyawan
app.get('/api/karyawan', async (req, res) => {
  try {
    if (!db) await connectDB();
    
    const { kantor } = req.query;
    
    let query = 'SELECT * FROM karyawan WHERE status = "aktif"';
    let params = [];
    
    if (kantor) {
      query += ' AND kantor = ?';
      params.push(kantor);
    }
    
    query += ' ORDER BY nama ASC';
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('❌ Get karyawan error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get pengajuan
app.get('/api/pengajuan', async (req, res) => {
  try {
    if (!db) await connectDB();
    
    const [rows] = await db.query(`
      SELECT p.*, k.nama as nama_karyawan, k.kantor, k.jabatan, k.departemen
      FROM pengajuan p
      LEFT JOIN karyawan k ON p.karyawan_id = k.id
      ORDER BY p.created_at DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('❌ Get pengajuan error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create pengajuan
app.post('/api/pengajuan', async (req, res) => {
  try {
    if (!db) await connectDB();
    
    const { karyawan_id, jenis_perizinan, tanggal_mulai, tanggal_selesai, catatan } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO pengajuan (karyawan_id, jenis_perizinan, tanggal_mulai, tanggal_selesai, catatan, status) VALUES (?, ?, ?, ?, ?, ?)',
      [karyawan_id, jenis_perizinan, tanggal_mulai, tanggal_selesai, catatan, 'pending']
    );
    
    res.status(201).json({ 
      message: 'Pengajuan berhasil dibuat',
      id: result.insertId 
    });
  } catch (error) {
    console.error('❌ Create pengajuan error:', error);
    res.status(500).json({ message: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  console.log('❌ 404:', req.method, req.url);
  res.status(404).json({
    error: 'Not Found',
    path: req.url,
    method: req.method,
    availableRoutes: [
      'POST /api/auth/login',
      'GET /api/health',
      'GET /api/karyawan',
      'GET /api/pengajuan',
      'POST /api/pengajuan'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: err.message });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('='.repeat(50));
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ Server ready`);
    console.log('='.repeat(50));
    console.log('');
    console.log('Available routes:');
    console.log('  POST   /api/auth/login');
    console.log('  GET    /api/health');
    console.log('  GET    /api/karyawan');
    console.log('  GET    /api/pengajuan');
    console.log('  POST   /api/pengajuan');
    console.log('');
  });
});
