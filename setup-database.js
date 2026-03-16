/**
 * Script untuk setup database sistem perizinan
 * Jalankan dengan: node setup-database.js
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './backend/.env' });

// Konfigurasi database
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

// Data default users
const defaultUsers = [
  {
    username: 'admin',
    password: 'admin123',
    nama: 'Administrator',
    role: 'admin'
  },
  {
    username: 'hrd',
    password: 'hrd123',
    nama: 'HRD Staff',
    role: 'hrd'
  }
];

// Data sample karyawan
const sampleKaryawan = [
  {
    kantor: 'RBM-IWARE SURABAYA',
    nama: 'John Doe',
    jabatan: 'Staff IT',
    departemen: 'IT Department'
  },
  {
    kantor: 'RBM-IWARE SURABAYA',
    nama: 'Jane Smith',
    jabatan: 'Marketing Manager',
    departemen: 'Marketing'
  },
  {
    kantor: 'RBM-IWARE JAKARTA',
    nama: 'Ahmad Rizki',
    jabatan: 'Sales Executive',
    departemen: 'Sales'
  },
  {
    kantor: 'SBA-WMP',
    nama: 'Siti Nurhaliza',
    jabatan: 'HR Staff',
    departemen: 'Human Resources'
  },
  {
    kantor: 'ILUMINDO',
    nama: 'Budi Santoso',
    jabatan: 'Finance Manager',
    departemen: 'Finance'
  }
];

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔄 Connecting to MySQL...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL\n');

    // 1. Create Database
    console.log('🔄 Creating database...');
    await connection.query(`
      CREATE DATABASE IF NOT EXISTS perizinan_db 
      CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);
    console.log('✅ Database created\n');

    // Switch to database
    await connection.query('USE perizinan_db');

    // 2. Create Tables
    console.log('🔄 Creating tables...');
    
    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nama VARCHAR(100) NOT NULL,
        role ENUM('admin', 'hrd') NOT NULL DEFAULT 'hrd',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('  ✓ Users table created');

    // Karyawan table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS karyawan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kantor VARCHAR(100) NOT NULL,
        nama VARCHAR(100) NOT NULL,
        jabatan VARCHAR(100),
        departemen VARCHAR(100),
        status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
        kuota_cuti INT DEFAULT 12,
        tahun_cuti INT DEFAULT YEAR(CURDATE()),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_kantor (kantor),
        INDEX idx_nama (nama),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('  ✓ Karyawan table created');

    // Pengajuan table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pengajuan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kantor VARCHAR(100) NOT NULL,
        karyawan_id INT,
        nama VARCHAR(100) NOT NULL,
        jabatan VARCHAR(100),
        departemen VARCHAR(100),
        no_telp VARCHAR(20),
        jenis_perizinan ENUM(
          'tidak_masuk_cuti',
          'sakit',
          'dinas_luar',
          'pulang_setengah_hari',
          'datang_terlambat',
          'ijin_keluar',
          'absen_manual'
        ) NOT NULL,
        tanggal_mulai DATETIME NOT NULL,
        tanggal_selesai DATETIME NOT NULL,
        bukti_foto VARCHAR(255),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        catatan_hrd TEXT,
        approved_by INT,
        approved_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (karyawan_id) REFERENCES karyawan(id) ON DELETE SET NULL,
        FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_kantor (kantor),
        INDEX idx_karyawan (karyawan_id),
        INDEX idx_status (status),
        INDEX idx_jenis (jenis_perizinan),
        INDEX idx_tanggal (tanggal_mulai, tanggal_selesai),
        INDEX idx_created_at (created_at DESC)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('  ✓ Pengajuan table created');

    // Quota tracking table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS quota_tracking (
        id INT AUTO_INCREMENT PRIMARY KEY,
        karyawan_id INT NOT NULL,
        bulan INT NOT NULL,
        tahun INT NOT NULL,
        pulang_cepat INT DEFAULT 0,
        datang_terlambat INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (karyawan_id) REFERENCES karyawan(id) ON DELETE CASCADE,
        UNIQUE KEY unique_karyawan_bulan (karyawan_id, bulan, tahun),
        INDEX idx_periode (bulan, tahun)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('  ✓ Quota tracking table created\n');

    // 3. Insert Default Users
    console.log('🔄 Creating default users...');
    for (const user of defaultUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      await connection.query(`
        INSERT INTO users (username, password, nama, role) 
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE nama = VALUES(nama), role = VALUES(role)
      `, [user.username, hashedPassword, user.nama, user.role]);
      
      console.log(`  ✓ User created: ${user.username} (${user.role})`);
    }
    console.log('');

    // 4. Insert Sample Karyawan
    console.log('🔄 Creating sample karyawan data...');
    const currentYear = new Date().getFullYear();
    
    for (const karyawan of sampleKaryawan) {
      await connection.query(`
        INSERT INTO karyawan (kantor, nama, jabatan, departemen, status, kuota_cuti, tahun_cuti) 
        VALUES (?, ?, ?, ?, 'aktif', 12, ?)
        ON DUPLICATE KEY UPDATE 
          jabatan = VALUES(jabatan), 
          departemen = VALUES(departemen)
      `, [karyawan.kantor, karyawan.nama, karyawan.jabatan, karyawan.departemen, currentYear]);
      
      console.log(`  ✓ Karyawan created: ${karyawan.nama} - ${karyawan.kantor}`);
    }
    console.log('');

    // 5. Create Views
    console.log('🔄 Creating views...');
    
    await connection.query(`
      CREATE OR REPLACE VIEW v_statistik_kantor AS
      SELECT 
        kantor,
        COUNT(*) as total_pengajuan,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM pengajuan
      GROUP BY kantor
    `);
    console.log('  ✓ View v_statistik_kantor created');

    await connection.query(`
      CREATE OR REPLACE VIEW v_sisa_cuti AS
      SELECT 
        k.id,
        k.kantor,
        k.nama,
        k.jabatan,
        k.departemen,
        k.kuota_cuti,
        k.tahun_cuti,
        COALESCE(
          k.kuota_cuti - (
            SELECT COUNT(*) 
            FROM pengajuan p 
            WHERE p.karyawan_id = k.id 
            AND p.jenis_perizinan = 'tidak_masuk_cuti'
            AND p.status = 'approved'
            AND YEAR(p.tanggal_mulai) = k.tahun_cuti
          ), k.kuota_cuti
        ) as sisa_cuti
      FROM karyawan k
      WHERE k.status = 'aktif'
    `);
    console.log('  ✓ View v_sisa_cuti created\n');

    // Success message
    console.log('✅ Database setup completed successfully!\n');
    console.log('📋 Default Credentials:');
    console.log('   Admin:');
    console.log('   - Username: admin');
    console.log('   - Password: admin123\n');
    console.log('   HRD:');
    console.log('   - Username: hrd');
    console.log('   - Password: hrd123\n');
    console.log('⚠️  IMPORTANT: Please change default passwords immediately!\n');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run setup
console.log('='.repeat(60));
console.log('  DATABASE SETUP - SISTEM PERIZINAN IWARE');
console.log('='.repeat(60));
console.log('');

setupDatabase();
