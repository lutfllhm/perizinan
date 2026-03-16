const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createSuperadmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'iware_perizinan'
  });

  try {
    console.log('🔄 Membuat Superadmin...\n');

    // Hash password
    const password = 'jasad666';
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔐 Password di-hash:', password);

    // Hapus semua user yang ada
    await connection.execute('DELETE FROM users');
    console.log('✅ User lama dihapus');

    // Buat superadmin baru
    await connection.execute(`
      INSERT INTO users (username, password, email, nama, role) 
      VALUES (?, ?, ?, ?, ?)
    `, ['superadmin', hashedPassword, 'admin@iware.com', 'Super Administrator', 'superadmin']);
    
    console.log('✅ Superadmin berhasil dibuat');

    // Verifikasi
    const [rows] = await connection.execute('SELECT username, nama, role, email FROM users');
    console.log('\n📊 Data users:');
    rows.forEach(r => {
      console.log(`   - ${r.username} (${r.role})`);
      console.log(`     Nama: ${r.nama}`);
      console.log(`     Email: ${r.email}`);
    });

    console.log('\n✅ Setup selesai!');
    console.log('═══════════════════════════════');
    console.log('🔑 Login Credentials:');
    console.log('   Username: superadmin');
    console.log('   Password: jasad666');
    console.log('═══════════════════════════════');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

createSuperadmin()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
