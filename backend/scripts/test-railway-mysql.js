#!/usr/bin/env node

/**
 * Script untuk test koneksi MySQL Railway
 * 
 * Cara pakai:
 * 1. Pastikan .env.railway.local sudah diisi dengan kredensial Railway
 * 2. Run: node backend/scripts/test-railway-mysql.js
 */

const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

// Coba baca dari beberapa lokasi .env
const envPaths = [
  path.join(__dirname, '../.env.railway.local'),
  path.join(__dirname, '../.env'),
  path.join(__dirname, '../../.env')
];

let envLoaded = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log(`✅ Using env file: ${envPath}\n`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.log('⚠️  No .env file found, using environment variables\n');
}

async function testConnection() {
  console.log('🔍 Testing Railway MySQL Connection...\n');
  
  // Tampilkan kredensial (hide password)
  console.log('📋 Kredensial yang digunakan:');
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Port: ${process.env.DB_PORT}`);
  console.log(`   User: ${process.env.DB_USER}`);
  console.log(`   Password: ${process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-4) : 'NOT SET'}`);
  console.log(`   Database: ${process.env.DB_NAME}\n`);

  let connection;
  
  try {
    // Test 1: Koneksi ke server
    console.log('📡 Test 1: Connecting to MySQL server...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    console.log('✅ Connected to MySQL server!\n');

    // Test 2: Cek database
    console.log('📡 Test 2: Checking database...');
    const [databases] = await connection.query('SHOW DATABASES');
    console.log('✅ Available databases:');
    databases.forEach(db => {
      const dbName = db.Database || db.SCHEMA_NAME;
      console.log(`   - ${dbName}`);
    });
    console.log('');

    // Test 3: Gunakan database
    console.log('📡 Test 3: Using database...');
    await connection.query(`USE ${process.env.DB_NAME}`);
    console.log(`✅ Using database: ${process.env.DB_NAME}\n`);

    // Test 4: Cek tables
    console.log('📡 Test 4: Checking tables...');
    const [tables] = await connection.query('SHOW TABLES');
    if (tables.length > 0) {
      console.log('✅ Existing tables:');
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`   - ${tableName}`);
      });
    } else {
      console.log('⚠️  No tables found. Database needs initialization.');
    }
    console.log('');

    // Test 5: Cek users table (jika ada)
    try {
      const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
      console.log(`✅ Users table: ${users[0].count} records\n`);
    } catch (err) {
      console.log('⚠️  Users table not found or error:', err.message, '\n');
    }

    console.log('🎉 All tests passed! Railway MySQL connection is working.\n');
    console.log('💡 Next steps:');
    console.log('   1. Copy kredensial ke Railway Dashboard → Backend → Variables');
    console.log('   2. Set MYSQL_URL atau individual credentials');
    console.log('   3. Deploy backend dan cek logs');
    console.log('   4. Database akan auto-initialize saat pertama kali jalan\n');

  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Pastikan kredensial di .env.railway.local benar');
    console.error('   2. Cek Railway Dashboard → MySQL → Variables');
    console.error('   3. Pastikan MySQL service sudah running');
    console.error('   4. Jika akses dari lokal, aktifkan Public Networking di Railway');
    console.error('   5. Atau gunakan: railway connect mysql\n');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testConnection();
