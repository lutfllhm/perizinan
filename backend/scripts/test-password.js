const bcrypt = require('bcryptjs');

async function testPassword() {
  // Hash dari database Railway (dari screenshot)
  const hashFromDB = '$2a$10$SsqIAwy54hGj2pjzuYxKo3Qkd00$6pH0H0';
  
  // Test berbagai password
  const passwords = [
    'admin',
    'admin123',
    'Admin123',
    'password',
    '123456',
    'iware123'
  ];
  
  console.log('🔐 Testing passwords against database hash...');
  console.log('Hash from DB:', hashFromDB);
  console.log('');
  
  for (const pwd of passwords) {
    try {
      const match = await bcrypt.compare(pwd, hashFromDB);
      if (match) {
        console.log(`✅ MATCH FOUND! Password: "${pwd}"`);
        return;
      } else {
        console.log(`❌ "${pwd}" - no match`);
      }
    } catch (error) {
      console.log(`⚠️  "${pwd}" - error:`, error.message);
    }
  }
  
  console.log('');
  console.log('❌ No matching password found');
  console.log('');
  console.log('📋 Generate new hash for "admin123":');
  const newHash = await bcrypt.hash('admin123', 10);
  console.log(newHash);
  console.log('');
  console.log('Run this SQL in Railway:');
  console.log(`UPDATE users SET password = '${newHash}' WHERE username = 'admin';`);
}

testPassword();
