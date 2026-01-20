require('dotenv').config();
const mysql = require('mysql2/promise');

async function testRailwayConnection() {
  let connection;
  
  try {
    console.log('🚀 Testing Railway MySQL Connection...\n');
    
    const config = {
      host: process.env.MYSQLHOST || 'localhost',
      port: process.env.MYSQLPORT || 3306,
      user: process.env.MYSQLUSER || 'root',
      password: process.env.MYSQLPASSWORD || '',
      database: process.env.MYSQLDATABASE || 'railway',
      connectTimeout: 60000
    };
    
    console.log('📋 Configuration:');
    console.log(`   Host: ${config.host}`);
    console.log(`   Port: ${config.port}`);
    console.log(`   User: ${config.user}`);
    console.log(`   Password: ${config.password ? '***' + config.password.slice(-4) : 'not set'}`);
    console.log(`   Database: ${config.database}\n`);

    console.log('🔌 Connecting to Railway MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connection successful!\n');

    // Test query
    console.log('📊 Testing query...');
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log('✅ Query successful:', rows[0].result);

    // Check database
    console.log('\n📁 Checking databases...');
    const [databases] = await connection.query('SHOW DATABASES');
    console.log('✅ Available databases:', databases.map(db => db.Database).join(', '));

    // Check tables
    console.log('\n📋 Checking tables in current database...');
    const [tables] = await connection.query('SHOW TABLES');
    if (tables.length > 0) {
      console.log('✅ Tables found:');
      tables.forEach(table => {
        console.log('   -', Object.values(table)[0]);
      });
      
      // Check data in tables
      console.log('\n📊 Checking data...');
      try {
        const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
        console.log(`   Users: ${users[0].count}`);
      } catch (e) {
        console.log('   Users table: not found or empty');
      }
      
      try {
        const [pengajuan] = await connection.query('SELECT COUNT(*) as count FROM pengajuan');
        console.log(`   Pengajuan: ${pengajuan[0].count}`);
      } catch (e) {
        console.log('   Pengajuan table: not found or empty');
      }
    } else {
      console.log('⚠️  No tables found.');
      console.log('💡 Run this command to initialize database:');
      console.log('   node scripts/init-railway-db.js');
    }

    console.log('\n✅ All tests passed! Railway MySQL is ready to use.');

  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check if MySQL service is running in Railway Dashboard');
    console.error('   2. Verify environment variables in .env.railway:');
    console.error('      - MYSQLHOST (should use RAILWAY_PRIVATE_DOMAIN)');
    console.error('      - MYSQLPORT (default: 3306)');
    console.error('      - MYSQLUSER (default: root)');
    console.error('      - MYSQLPASSWORD');
    console.error('      - MYSQLDATABASE (default: railway)');
    console.error('   3. Make sure you copied .env.railway to .env for local testing');
    console.error('   4. In Railway, ensure MySQL service is linked to backend service');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connection closed');
    }
  }
}

testRailwayConnection();
