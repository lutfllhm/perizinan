const bcrypt = require('bcryptjs');

async function testCurrentHash() {
  // Hash dari SQL file
  const hashFromSQL = '$2a$10$Z6CmGwt9cEkJrsyPH.Pt4.CN2qVjXGKWg5PlJL.J.Q3HRQlFO1P.K';
  
  console.log('🔐 Testing hash from SQL file:');
  console.log(hashFromSQL);
  console.log('');
  
  // Test berbagai password
  const passwords = [
    'admin123',
    'admin',
    'Admin123',
    'password',
    '123456',
    'iware123',
    'perizinan123',
    'Lutfillah',
    'lutfillah',
    'masduqi'
  ];
  
  console.log('Testing passwords...');
  console.log('');
  
  for (const pwd of passwords) {
    try {
      const match = await bcrypt.compare(pwd, hashFromSQL);
      console.log(`${match ? '✅ MATCH!' : '❌'} "${pwd}"`);
      
      if (match) {
        console.log('');
        console.log('🎉 PASSWORD FOUND!');
        console.log('Password:', pwd);
        console.log('');
        console.log('Login dengan:');
        console.log('Username: admin');
        console.log('Password:', pwd);
        return;
      }
    } catch (error) {
      console.log(`⚠️  "${pwd}" - error:`, error.message);
    }
  }
  
  console.log('');
  console.log('❌ No matching password found');
  console.log('');
  console.log('💡 Solution: Reset password via Railway');
  console.log('Open this URL in browser:');
  console.log('https://perizinan-production.up.railway.app/api/simple-reset/reset-now');
}

testCurrentHash();
