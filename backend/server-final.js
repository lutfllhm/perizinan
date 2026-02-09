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
    
    // Auto-create tables
    await initializeTables();
    
    return db;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return null;
  }
}

async function initializeTables() {
  try {
    console.log('🔄 Initializing database tables...');
    
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        nama VARCHAR(100) NOT NULL,
        role ENUM('admin', 'hrd') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log('✅ Table users OK');
    
    // Create pengajuan table
    await db.query(`
      CREATE TABLE IF NOT EXISTS pengajuan (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nama VARCHAR(100) NOT NULL,
        no_telp VARCHAR(20) NOT NULL,
        jenis_perizinan VARCHAR(50) NOT NULL,
        tanggal_mulai DATETIME NOT NULL,
        tanggal_selesai DATETIME NOT NULL,
        bukti_foto VARCHAR(255),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        catatan TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log('✅ Table pengajuan OK');
    
    // Create karyawan table
    const currentYear = new Date().getFullYear();
    await db.query(`
      CREATE TABLE IF NOT EXISTS karyawan (
        id INT PRIMARY KEY AUTO_INCREMENT,
        kantor VARCHAR(100) NOT NULL,
        nama VARCHAR(100) NOT NULL,
        jabatan VARCHAR(100) NOT NULL,
        departemen VARCHAR(100) NOT NULL,
        no_telp VARCHAR(20),
        jatah_cuti INT DEFAULT 12,
        sisa_cuti INT DEFAULT 12,
        tahun_cuti INT DEFAULT ${currentYear},
        status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_karyawan (kantor, nama)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log('✅ Table karyawan OK');
    
    // Create quota_bulanan table
    await db.query(`
      CREATE TABLE IF NOT EXISTS quota_bulanan (
        id INT PRIMARY KEY AUTO_INCREMENT,
        karyawan_id INT NOT NULL,
        bulan INT NOT NULL,
        tahun INT NOT NULL,
        pulang_cepat INT DEFAULT 0,
        datang_terlambat INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_quota (karyawan_id, bulan, tahun),
        FOREIGN KEY (karyawan_id) REFERENCES karyawan(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log('✅ Table quota_bulanan OK');
    
    // Add columns to pengajuan if not exist
    const [columns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'pengajuan' 
      AND COLUMN_NAME IN ('karyawan_id', 'kantor', 'jabatan', 'departemen')
    `);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    
    if (!existingColumns.includes('karyawan_id')) {
      await db.query('ALTER TABLE pengajuan ADD COLUMN karyawan_id INT');
      console.log('✅ Column karyawan_id added');
    }
    
    if (!existingColumns.includes('kantor')) {
      await db.query('ALTER TABLE pengajuan ADD COLUMN kantor VARCHAR(100)');
      console.log('✅ Column kantor added');
    }
    
    if (!existingColumns.includes('jabatan')) {
      await db.query('ALTER TABLE pengajuan ADD COLUMN jabatan VARCHAR(100)');
      console.log('✅ Column jabatan added');
    }
    
    if (!existingColumns.includes('departemen')) {
      await db.query('ALTER TABLE pengajuan ADD COLUMN departemen VARCHAR(100)');
      console.log('✅ Column departemen added');
    }
    
    // Create default admin user if not exists
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', ['admin']);
    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.query(
        'INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)',
        ['admin', hashedPassword, 'Administrator', 'admin']
      );
      console.log('✅ Default admin user created (admin/admin123)');
    }
    
    console.log('✅ Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Error initializing tables:', error.message);
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

// Get statistics
app.get('/api/pengajuan/stats', async (req, res) => {
  try {
    if (!db) await connectDB();
    
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM pengajuan
    `);
    
    res.json(stats[0] || { total: 0, pending: 0, approved: 0, rejected: 0 });
  } catch (error) {
    console.error('❌ Get stats error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get users (for admin)
app.get('/api/auth/users', async (req, res) => {
  try {
    if (!db) await connectDB();
    
    const [rows] = await db.query(
      'SELECT id, username, nama, role, created_at FROM users ORDER BY created_at DESC'
    );
    
    res.json({ users: rows });
  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Register HRD user
app.post('/api/auth/register-hrd', async (req, res) => {
  try {
    if (!db) await connectDB();
    
    const { username, password, nama } = req.body;

    if (!username || !password || !nama) {
      return res.status(400).json({ message: 'Username, password, dan nama harus diisi' });
    }

    // Check if username exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query(
      'INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, nama, 'hrd']
    );

    console.log('✅ HRD registered:', username);

    res.status(201).json({
      message: 'HRD berhasil didaftarkan',
      user: { username, nama, role: 'hrd' }
    });

  } catch (error) {
    console.error('❌ Register HRD error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete user
app.delete('/api/auth/users/:id', async (req, res) => {
  try {
    if (!db) await connectDB();
    
    const userId = req.params.id;

    // Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Delete user
    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    console.log('✅ User deleted:', userId);

    res.json({ message: 'User berhasil dihapus' });

  } catch (error) {
    console.error('❌ Delete user error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update pengajuan status
app.put('/api/pengajuan/:id', async (req, res) => {
  try {
    if (!db) await connectDB();
    
    const { id } = req.params;
    const { status, catatan } = req.body;

    await db.query(
      'UPDATE pengajuan SET status = ?, catatan = ? WHERE id = ?',
      [status, catatan, id]
    );

    console.log('✅ Pengajuan updated:', id);

    res.json({ message: 'Status pengajuan berhasil diupdate' });

  } catch (error) {
    console.error('❌ Update pengajuan error:', error);
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
