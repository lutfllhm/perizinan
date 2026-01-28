require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function resetAdminPassword() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST || 'localhost',
      user: process.env.MYSQLUSER || 'root',
      password: process.env.MYSQLPASSWORD || '',
      database: process.env.MYSQLDATABASE || 'iware_perizinan',
      port: process.env.MYSQLPORT || 3306
    });

    console.log('✅ Connected to database');

    // New password
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log('🔐 Hashing password...');
    console.log('New password:', newPassword);
    console.log('Hashed:', hashedPassword);

    // Update admin password
    const [result] = await connection.query(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashedPassword, 'admin']
    );

    if (result.affectedRows > 0) {
      console.log('✅ Admin password reset successfully!');
      console.log('');
      console.log('=================================');
      console.log('Login credentials:');
      console.log('Username: admin');
      console.log('Password: admin123');
      console.log('=================================');
    } else {
      console.log('❌ Admin user not found');
      
      // Create admin if not exists
      console.log('🔄 Creating admin user...');
      await connection.query(
        'INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)',
        ['admin', hashedPassword, 'Administrator', 'admin']
      );
      console.log('✅ Admin user created successfully!');
      console.log('');
      console.log('=================================');
      console.log('Login credentials:');
      console.log('Username: admin');
      console.log('Password: admin123');
      console.log('=================================');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState
    });
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

resetAdminPassword();
