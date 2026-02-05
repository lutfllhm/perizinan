require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function initDatabase() {
  let connection;
  
  try {
    console.log('🔄 Connecting to MySQL...');
    
    // Connect tanpa database dulu
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('✅ Connected to MySQL');

    // Buat database jika belum ada
    const dbName = process.env.DB_NAME || 'iware_perizinan';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Database '${dbName}' ready`);

    // Gunakan database
    await connection.query(`USE ${dbName}`);

    // Buat tabel users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        nama VARCHAR(100) NOT NULL,
        role ENUM('admin', 'hrd') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table users created');

    // Buat tabel pengajuan
    await connection.query(`
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
    console.log('✅ Table pengajuan created');

    // Cek apakah sudah ada user admin
    const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', ['admin']);

    if (rows.length === 0) {
      console.log('🔄 Creating default users...');

      // Hash passwords
      const adminPassword = await bcrypt.hash('admin123', 10);
      const hrdPassword = await bcrypt.hash('hrd123', 10);

      // Insert admin
      await connection.query(
        'INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)',
        ['admin', adminPassword, 'Administrator', 'admin']
      );
      console.log('✅ Admin user created (username: admin, password: admin123)');

      // Insert hrd
      await connection.query(
        'INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)',
        ['hrd', hrdPassword, 'HRD Staff', 'hrd']
      );
      console.log('✅ HRD user created (username: hrd, password: hrd123)');

    } else {
      console.log('✅ Users already exist');
    }

    console.log('\n✅ Database initialization complete!');
    console.log('\n📝 Default credentials:');
    console.log('   Admin - username: admin, password: admin123');
    console.log('   HRD   - username: hrd, password: hrd123');
    console.log('\n🚀 You can now start the server: npm start');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

initDatabase();
