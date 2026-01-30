const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

console.log('🚀 Starting server...');
console.log('📍 Environment:', process.env.NODE_ENV || 'development');
console.log('📍 Port:', process.env.PORT || 5000);

// Health check endpoint (before database dependency)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database initialization with retry logic
async function initDatabaseWithRetry() {
  const maxRetries = 10;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      console.log(`🔄 Attempting database connection (${retries + 1}/${maxRetries})...`);
      
      const db = require('./config/mysql');
      
      // Test connection
      await db.query('SELECT 1');
      console.log('✅ Database connection successful!');
      
      // Initialize tables
      await initializeTables(db);
      return db;
      
    } catch (error) {
      retries++;
      console.error(`❌ Database connection failed (attempt ${retries}):`, error.message);
      
      if (retries >= maxRetries) {
        console.error('💥 Max retries reached. Exiting...');
        process.exit(1);
      }
      
      const delay = Math.min(1000 * Math.pow(2, retries), 30000); // Exponential backoff
      console.log(`⏳ Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function initializeTables(db) {
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
  
  console.log('✅ Database tables initialized successfully!');
}

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL,
  /\.up\.railway\.app$/
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
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

// API Health check
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
  app.use('/api/otp', require('./routes/otp'));
  app.use('/api/admin-reset', require('./routes/reset-admin')); // TEMPORARY - Remove after use
  app.use('/api/simple-reset', require('./routes/simple-reset')); // SIMPLE RESET - Remove after use
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
initDatabaseWithRetry()
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