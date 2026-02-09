/**
 * Force Migration Script
 * Jalankan script ini untuk force migration database di Railway
 * 
 * Usage:
 *   railway run node scripts/force-migration.js
 *   atau
 *   node scripts/force-migration.js (local)
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function forceMigration() {
  console.log('🚀 Starting FORCE MIGRATION...');
  console.log('📍 Environment:', process.env.NODE_ENV || 'development');
  
  const connection = await mysql.createConnection({
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway'
  });

  try {
    console.log('✅ Database connected');
    console.log('📍 Database:', process.env.MYSQLDATABASE || process.env.DB_NAME);
    
    // Check existing tables
    console.log('\n📊 Checking existing tables...');
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📊 Existing tables:', tables.map(t => Object.values(t)[0]));
    
    // 1. Create karyawan table
    console.log('\n📝 Creating karyawan table...');
    await connection.query(`
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

    // 2. Create quota_bulanan table
    console.log('\n📝 Creating quota_bulanan table...');
    await connection.query(`
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

    // 3. Update pengajuan table
    console.log('\n📝 Updating pengajuan table...');
    
    // Check existing columns
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'pengajuan' 
      AND COLUMN_NAME IN ('karyawan_id', 'kantor', 'jabatan', 'departemen')
    `);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    console.log('📊 Existing columns in pengajuan:', existingColumns);
    
    if (!existingColumns.includes('karyawan_id')) {
      await connection.query('ALTER TABLE pengajuan ADD COLUMN karyawan_id INT');
      console.log('✅ Kolom karyawan_id ditambahkan');
    } else {
      console.log('⏭️  Kolom karyawan_id sudah ada');
    }
    
    if (!existingColumns.includes('kantor')) {
      await connection.query('ALTER TABLE pengajuan ADD COLUMN kantor VARCHAR(100)');
      console.log('✅ Kolom kantor ditambahkan');
    } else {
      console.log('⏭️  Kolom kantor sudah ada');
    }
    
    if (!existingColumns.includes('jabatan')) {
      await connection.query('ALTER TABLE pengajuan ADD COLUMN jabatan VARCHAR(100)');
      console.log('✅ Kolom jabatan ditambahkan');
    } else {
      console.log('⏭️  Kolom jabatan sudah ada');
    }
    
    if (!existingColumns.includes('departemen')) {
      await connection.query('ALTER TABLE pengajuan ADD COLUMN departemen VARCHAR(100)');
      console.log('✅ Kolom departemen ditambahkan');
    } else {
      console.log('⏭️  Kolom departemen sudah ada');
    }
    
    // Add foreign key
    const [fks] = await connection.query(`
      SELECT CONSTRAINT_NAME 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'pengajuan' 
      AND COLUMN_NAME = 'karyawan_id' 
      AND REFERENCED_TABLE_NAME = 'karyawan'
    `);
    
    if (fks.length === 0) {
      await connection.query(`
        ALTER TABLE pengajuan 
        ADD CONSTRAINT fk_pengajuan_karyawan 
        FOREIGN KEY (karyawan_id) REFERENCES karyawan(id) ON DELETE SET NULL
      `);
      console.log('✅ Foreign key karyawan_id ditambahkan');
    } else {
      console.log('⏭️  Foreign key karyawan_id sudah ada');
    }

    // 4. Check karyawan data
    console.log('\n📊 Checking karyawan data...');
    const [karyawanCount] = await connection.query('SELECT COUNT(*) as count FROM karyawan');
    console.log('📊 Current karyawan count:', karyawanCount[0].count);
    
    if (karyawanCount[0].count === 0) {
      console.log('\n⚠️  Tabel karyawan kosong!');
      console.log('💡 Jalankan: railway run npm run import-karyawan');
      console.log('💡 Atau: node scripts/import-karyawan.js');
    } else {
      console.log('✅ Tabel karyawan sudah berisi data');
    }

    // 5. Show final status
    console.log('\n📊 Final table status:');
    const [finalTables] = await connection.query('SHOW TABLES');
    finalTables.forEach(t => {
      console.log('  ✅', Object.values(t)[0]);
    });

    console.log('\n✅ FORCE MIGRATION SELESAI!');
    console.log('');
    console.log('📝 Langkah selanjutnya:');
    if (karyawanCount[0].count === 0) {
      console.log('1. Import data karyawan: railway run npm run import-karyawan');
      console.log('2. Restart Railway service');
    } else {
      console.log('1. Restart Railway service (jika perlu)');
      console.log('2. Test API: /api/karyawan');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('❌ Stack:', error.stack);
    throw error;
  } finally {
    await connection.end();
  }
}

forceMigration()
  .then(() => {
    console.log('\n🎉 Success!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Failed:', error.message);
    process.exit(1);
  });
