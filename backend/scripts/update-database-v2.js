const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway'
  });

  try {
    console.log('🔄 Memulai update database...');

    // 1. Buat tabel karyawan
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

    // 2. Buat tabel quota_bulanan untuk tracking pulang cepat & datang terlambat
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

    // 3. Update tabel pengajuan - tambah kolom karyawan_id
    await connection.query(`
      ALTER TABLE pengajuan 
      ADD COLUMN IF NOT EXISTS karyawan_id INT,
      ADD COLUMN IF NOT EXISTS kantor VARCHAR(100),
      ADD COLUMN IF NOT EXISTS jabatan VARCHAR(100),
      ADD COLUMN IF NOT EXISTS departemen VARCHAR(100),
      ADD FOREIGN KEY IF NOT EXISTS (karyawan_id) REFERENCES karyawan(id) ON DELETE SET NULL
    `).catch(() => {
      console.log('⚠️  Kolom sudah ada atau error, melanjutkan...');
    });
    console.log('✅ Tabel pengajuan berhasil diupdate');

    console.log('✅ Update database selesai!');
    console.log('');
    console.log('📝 Langkah selanjutnya:');
    console.log('1. Jalankan script import-karyawan.js untuk mengisi data karyawan');
    console.log('2. Restart server backend');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

updateDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
