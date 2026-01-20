const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'iware_perizinan',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL connected successfully!');
    console.log(`📍 Host: ${process.env.MYSQLHOST || process.env.DB_HOST || 'localhost'}`);
    console.log(`📍 Database: ${process.env.MYSQLDATABASE || process.env.DB_NAME || 'iware_perizinan'}`);
    connection.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection error:', err.message);
    console.error('💡 Check your database configuration');
  });

module.exports = pool;
