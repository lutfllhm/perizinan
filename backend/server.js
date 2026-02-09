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
  console.log('📍 Database:', process.env.MYSQLDATABASE || process.env.DB_NAME);
  
  try {
    // Create users table
    console.log('📝 Creating users table...');
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
    console.log('✅ Tabel users OK');
    
    // Create pengajuan table
    console.log('📝 Creating pengajuan table...');
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
    console.log('✅ Tabel pengajuan OK');
    
    // Create karyawan table (v2.0)
    console.log('📝 Creating karyawan table...');
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
        tahun_cuti INT DEFAULT YEAR(CURDATE()),
        status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_karyawan (kantor, nama)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log('✅ Tabel karyawan berhasil dibuat');
    
    // Create quota_bulanan table (v2.0)
    console.log('📝 Creating quota_bulanan table...');
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
    console.log('✅ Tabel quota_bulanan berhasil dibuat');
    
    // Update pengajuan table - add new columns (v2.0)
    console.log('📝 Updating pengajuan table with new columns...');
    try {
      // Check if columns exist first
      const [columns] = await db.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'pengajuan' 
        AND COLUMN_NAME IN ('karyawan_id', 'kantor', 'jabatan', 'departemen')
      `);
      
      const existingColumns = columns.map(col => col.COLUMN_NAME);
      console.log('📊 Existing columns in pengajuan:', existingColumns);
      
      if (!existingColumns.includes('karyawan_id')) {
        await db.query('ALTER TABLE pengajuan ADD COLUMN karyawan_id INT');
        console.log('✅ Kolom karyawan_id ditambahkan');
      } else {
        console.log('⏭️  Kolom karyawan_id sudah ada');
      }
      
      if (!existingColumns.includes('kantor')) {
        await db.query('ALTER TABLE pengajuan ADD COLUMN kantor VARCHAR(100)');
        console.log('✅ Kolom kantor ditambahkan');
      } else {
        console.log('⏭️  Kolom kantor sudah ada');
      }
      
      if (!existingColumns.includes('jabatan')) {
        await db.query('ALTER TABLE pengajuan ADD COLUMN jabatan VARCHAR(100)');
        console.log('✅ Kolom jabatan ditambahkan');
      } else {
        console.log('⏭️  Kolom jabatan sudah ada');
      }
      
      if (!existingColumns.includes('departemen')) {
        await db.query('ALTER TABLE pengajuan ADD COLUMN departemen VARCHAR(100)');
        console.log('✅ Kolom departemen ditambahkan');
      } else {
        console.log('⏭️  Kolom departemen sudah ada');
      }
      
      // Add foreign key if not exists
      const [fks] = await db.query(`
        SELECT CONSTRAINT_NAME 
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'pengajuan' 
        AND COLUMN_NAME = 'karyawan_id' 
        AND REFERENCED_TABLE_NAME = 'karyawan'
      `);
      
      if (fks.length === 0 && existingColumns.includes('karyawan_id')) {
        await db.query(`
          ALTER TABLE pengajuan 
          ADD CONSTRAINT fk_pengajuan_karyawan 
          FOREIGN KEY (karyawan_id) REFERENCES karyawan(id) ON DELETE SET NULL
        `);
        console.log('✅ Foreign key karyawan_id ditambahkan');
      } else if (fks.length > 0) {
        console.log('⏭️  Foreign key karyawan_id sudah ada');
      }
    } catch (error) {
      console.log('⚠️  Update pengajuan table error:', error.message);
      console.log('⚠️  Continuing anyway...');
    }
    
    // Auto-import karyawan data if table is empty
    console.log('📊 Checking karyawan data...');
    const [karyawanCount] = await db.query('SELECT COUNT(*) as count FROM karyawan');
    console.log('📊 Current karyawan count:', karyawanCount[0].count);
    
    if (karyawanCount[0].count === 0) {
      console.log('📥 Tabel karyawan kosong, memulai auto-import...');
      try {
        await autoImportKaryawan(db);
      } catch (error) {
        console.log('⚠️  Auto-import karyawan gagal:', error.message);
        console.log('💡 Jalankan manual: npm run import-karyawan');
      }
    } else {
      console.log('✅ Tabel karyawan sudah berisi data');
    }
    
    // Create default admin user if not exists
    console.log('📝 Checking admin user...');
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', ['admin']);
    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.query(
        'INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)',
        ['admin', hashedPassword, 'Administrator', 'admin']
      );
      console.log('✅ Default admin user created (admin/admin123)');
    } else {
      console.log('⏭️  Admin user sudah ada');
    }
    
    console.log('✅ Database tables initialized successfully!');
    
  } catch (error) {
    console.error('❌ Error during table initialization:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Stack trace:', error.stack);
    throw error;
  }
}

async function autoImportKaryawan(db) {
  console.log('🚀 Starting auto-import karyawan...');
  const fs = require('fs');
  const path = require('path');
  
  const importScript = path.join(__dirname, 'scripts', 'import-karyawan.js');
  console.log('📂 Import script path:', importScript);
  
  if (!fs.existsSync(importScript)) {
    console.log('❌ Script import-karyawan.js tidak ditemukan di:', importScript);
    throw new Error('Import script not found');
  }
  
  console.log('✅ Import script found, executing...');
  
  // Run import inline
  const { spawn } = require('child_process');
  
  return new Promise((resolve, reject) => {
    const child = spawn('node', [importScript], {
      stdio: 'inherit',
      env: process.env,
      cwd: __dirname
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Auto-import karyawan berhasil (exit code 0)');
        resolve();
      } else {
        console.log('❌ Auto-import karyawan gagal (exit code:', code, ')');
        reject(new Error(`Import failed with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      console.log('❌ Auto-import karyawan error:', error.message);
      reject(error);
    });
    
    // Timeout after 60 seconds
    setTimeout(() => {
      console.log('⏱️  Auto-import timeout after 60s, killing process...');
      child.kill();
      reject(new Error('Import timeout'));
    }, 60000);
  });
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

// Serve static files from React build (for production)
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(frontendBuildPath));
  console.log('📦 Serving static files from:', frontendBuildPath);
}

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
  app.use('/api/karyawan', require('./routes/karyawan'));
  app.use('/api/admin-reset', require('./routes/reset-admin')); // TEMPORARY - Remove after use
  app.use('/api/simple-reset', require('./routes/simple-reset')); // SIMPLE RESET - Remove after use
  console.log('✅ Routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
}

// Serve React app for all non-API routes (for production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
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