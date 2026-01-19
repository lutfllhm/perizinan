require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  let connection;
  
  try {
    console.log('🔍 Testing MySQL connection...');
    console.log('📍 Host:', process.env.DB_HOST || 'localhost');
    console.log('📍 User:', process.env.DB_USER || 'root');
    console.log('📍 Database:', process.env.DB_NAME || 'iware_perizinan');
    console.log('');

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'iware_perizinan'
    });

    console.log('✅ MySQL connected successfully!');

    // Test query
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log('✅ Test query successful:', rows[0].result);

    // Check tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📊 Tables in database:', tables.length);
    tables.forEach(table => {
      console.log('  -', Object.values(table)[0]);
    });

    // Check users
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log('👥 Total users:', users[0].count);

    // Check pengajuan
    const [pengajuan] = await connection.query('SELECT COUNT(*) as count FROM pengajuan');
    console.log('📝 Total pengajuan:', pengajuan[0].count);

    console.log('\n✅ All checks passed!');

  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Pastikan MySQL service sudah running');
    console.error('2. Cek credentials di file .env');
    console.error('3. Pastikan database sudah dibuat: node scripts/init-database.js');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connection closed');
    }
  }
}

testConnection();
