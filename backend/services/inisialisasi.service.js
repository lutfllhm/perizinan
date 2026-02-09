// Service untuk inisialisasi database dan tabel
const bcrypt = require('bcryptjs');
const { importOtomatisKaryawan } = require('./karyawan.service');

/**
 * Inisialisasi semua tabel database
 */
async function inisialisasiTabel(db) {
  try {
    console.log('🔄 Menginisialisasi tabel database...');
    
    // Buat tabel users
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
    
    // Buat tabel pengajuan
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
    
    // Buat tabel karyawan
    const tahunSekarang = new Date().getFullYear();
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
        tahun_cuti INT DEFAULT ${tahunSekarang},
        status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_karyawan (kantor, nama)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log('✅ Tabel karyawan OK');
    
    // Buat tabel quota_bulanan
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
    console.log('✅ Tabel quota_bulanan OK');
    
    // Tambahkan kolom ke tabel pengajuan jika belum ada
    await tambahKolomPengajuan(db);
    
    // Buat user admin default jika belum ada
    await buatUserAdminDefault(db);
    
    // Import otomatis data karyawan jika tabel kosong
    await importOtomatisKaryawan(db);
    
    console.log('✅ Inisialisasi database selesai!');
    
  } catch (error) {
    console.error('❌ Error inisialisasi tabel:', error.message);
  }
}

/**
 * Tambahkan kolom tambahan ke tabel pengajuan
 */
async function tambahKolomPengajuan(db) {
  const [columns] = await db.query(`
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'pengajuan' 
    AND COLUMN_NAME IN ('karyawan_id', 'kantor', 'jabatan', 'departemen')
  `);
  
  const kolomYangAda = columns.map(col => col.COLUMN_NAME);
  
  if (!kolomYangAda.includes('karyawan_id')) {
    await db.query('ALTER TABLE pengajuan ADD COLUMN karyawan_id INT');
    console.log('✅ Kolom karyawan_id ditambahkan');
  }
  
  if (!kolomYangAda.includes('kantor')) {
    await db.query('ALTER TABLE pengajuan ADD COLUMN kantor VARCHAR(100)');
    console.log('✅ Kolom kantor ditambahkan');
  }
  
  if (!kolomYangAda.includes('jabatan')) {
    await db.query('ALTER TABLE pengajuan ADD COLUMN jabatan VARCHAR(100)');
    console.log('✅ Kolom jabatan ditambahkan');
  }
  
  if (!kolomYangAda.includes('departemen')) {
    await db.query('ALTER TABLE pengajuan ADD COLUMN departemen VARCHAR(100)');
    console.log('✅ Kolom departemen ditambahkan');
  }
}

/**
 * Buat user admin default
 */
async function buatUserAdminDefault(db) {
  const [users] = await db.query('SELECT * FROM users WHERE username = ?', ['admin']);
  if (users.length === 0) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await db.query(
      'INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)',
      ['admin', passwordHash, 'Administrator', 'admin']
    );
    console.log('✅ User admin default dibuat (admin/admin123)');
  }
}

module.exports = {
  inisialisasiTabel
};
