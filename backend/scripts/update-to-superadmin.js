const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateToSuperadmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'iware_perizinan'
  });

  try {
    console.log('🔄 Mengubah sistem ke Superadmin Only...\n');

    // Ubah struktur tabel users
    await connection.execute(`
      ALTER TABLE users 
      MODIFY role ENUM('superadmin') NOT NULL DEFAULT 'superadmin'
    `);
    console.log('✅ Struktur tabel users diupdate');

    // Update user yang ada menjadi superadmin
    await connection.execute(`
      UPDATE users 
      SET role = 'superadmin', 
          username = 'superadmin',
          nama = 'Super Administrator'
      WHERE id = 1
    `);
    console.log('✅ User diupdate menjadi superadmin');
    
    // Hapus user lain jika ada
    await connection.execute('DELETE FROM users WHERE id != 1');
    console.log('✅ User lain dihapus (hanya superadmin)');

    // Verifikasi
    const [rows] = await connection.execute('SELECT username, nama, role FROM users');
    console.log('\n📊 Data users saat ini:');
    rows.forEach(r => {
      console.log(`   - ${r.username} (${r.role}) - ${r.nama}`);
    });

    console.log('\n✅ Sistem berhasil diubah ke Superadmin Only!');
    console.log('🔑 Login: superadmin / admin123');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

updateToSuperadmin()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
