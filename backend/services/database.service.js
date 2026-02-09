// Service untuk koneksi dan operasi database
const mysql = require('mysql2/promise');

let db;

/**
 * Koneksi ke database MySQL
 */
async function koneksiDatabase() {
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
    console.log('✅ Database terhubung');
    return db;
  } catch (error) {
    console.error('❌ Koneksi database gagal:', error.message);
    return null;
  }
}

/**
 * Dapatkan instance database
 */
function dapatkanDatabase() {
  return db;
}

module.exports = {
  koneksiDatabase,
  dapatkanDatabase
};
