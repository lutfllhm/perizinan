const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'iware_perizinan',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL connected successfully!');
    console.log(`📍 Database: ${process.env.DB_NAME || 'iware_perizinan'}`);
    connection.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection error:', err.message);
  });

module.exports = pool;
