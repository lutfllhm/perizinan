const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = process.argv[2] || 'admin123';
  
  console.log('🔐 Generating password hash...');
  console.log('Password:', password);
  console.log('');
  
  const hash = await bcrypt.hash(password, 10);
  
  console.log('✅ Hash generated:');
  console.log(hash);
  console.log('');
  console.log('📋 SQL Query to update admin password:');
  console.log('');
  console.log(`UPDATE users SET password = '${hash}' WHERE username = 'admin';`);
  console.log('');
  console.log('Or create new admin:');
  console.log('');
  console.log(`INSERT INTO users (username, password, nama, role) VALUES ('admin', '${hash}', 'Administrator', 'admin');`);
}

generateHash();
