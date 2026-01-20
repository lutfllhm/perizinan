const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const db = require('./config/mysql');

const app = express();

console.log('🚀 Starting server...');
console.log('📍 Environment:', process.env.NODE_ENV || 'development');
console.log('📍 Port:', process.env.PORT || 5000);

// Auto-initialize database on startup
async function initDatabaseIfNeeded() {
  try {
    console.log('🔄 Checking database tables...');
    
    // Buat tabel users jika belum ada
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        nama VARCHAR(100) NOT NULL,
        role ENUM('admin', 'hrd') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table users ready');

    // Buat tabel pengajuan jika belum ada
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
      )
    `);
    console.log('✅ Table pengajuan ready');
    
    // Cek apakah sudah ada user admin
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', ['admin']);
    
    if (rows.length === 0) {
      console.log('🔄 Creating default admin user...');
      
      // Hash password default: "admin123"
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await db.query(
        'INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)',
        ['admin', hashedPassword, 'Administrator', 'admin']
      );
      
      console.log('✅ Default admin user created!');
      console.log('💡 Username: admin, Password: admin123');
    } else {
      console.log('✅ Database already initialized');
      console.log('💡 Admin user exists');
    }
  } catch (error) {
    console.error('❌ Error saat init database:', error.message);
    console.error('💡 Pastikan MySQL service sudah running dan database sudah dibuat');
  }
}

// Middleware
// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL,
  // Railway preview URLs
  /\.up\.railway\.app$/
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed origins or patterns
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server berjalan dengan baik',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    database: 'MySQL'
  });
});

// Routes
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/pengajuan', require('./routes/pengajuan'));
  console.log('✅ Routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
}

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    status: 'ERROR', 
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Initialize database first, then start server
initDatabaseIfNeeded()
  .then(() => {
    const server = app.listen(PORT, HOST, () => {
      console.log(`🚀 Server berjalan di port ${PORT}`);
      console.log(`📡 API tersedia di http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💾 Database: MySQL`);
    });

    server.on('error', (err) => {
      console.error('❌ Server failed to start:', err.message);
      process.exit(1);
    });
  })
  .catch(err => {
    console.error('❌ Failed to initialize:', err.message);
    process.exit(1);
  });
