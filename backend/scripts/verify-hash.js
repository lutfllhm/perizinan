const bcrypt = require('bcryptjs');

async function verifyHash() {
  // Hash dari Railway
  const hash = '$2a$10$RDbujolN7RxraLfPU7SJ0e6FOyzQOjisTZ7Kfsu5caMGBpPrxt6BW';
  
  console.log('🔐 Testing hash:', hash);
  console.log('');
  
  // Test berbagai password
  const passwords = [
    'admin123',
    'admin',
    'Admin123',
    'password',
    '123456',
    'iware123',
    'perizinan123'
  ];
  
  console.log('Testing passwords...');
  console.log('');
  
  for (const pwd of passwords) {
    try {
      const match = await bcrypt.compare(pwd, hash);
      console.log(`${match ? '✅' : '❌'} "${pwd}" - ${match ? 'MATCH!' : 'no match'}`);
      
      if (match) {
        console.log('');
        console.log('🎉 PASSWORD FOUND!');
        console.log('Password:', pwd);
        return;
      }
    } catch (error) {
      console.log(`⚠️  "${pwd}" - error:`, error.message);
    }
  }
  
  console.log('');
  console.log('❌ No matching password found from common passwords');
  console.log('');
  console.log('💡 Generating NEW hash for "admin123":');
  console.log('');
  
  const newHash = await bcrypt.hash('admin123', 10);
  console.log('New Hash:', newHash);
  console.log('');
  console.log('📋 Run this in Railway MySQL Query:');
  console.log('');
  console.log(`UPDATE users SET password = '${newHash}' WHERE username = 'admin';`);
  console.log('');
  console.log('Or use this URL in browser:');
  console.log('https://perizinan-production.up.railway.app/api/simple-reset/reset-now');
}

verifyHash();
