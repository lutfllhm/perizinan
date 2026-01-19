const crypto = require('crypto');

// Generate random JWT secret
const secret = crypto.randomBytes(32).toString('hex');

console.log('========================================');
console.log('JWT Secret Generator');
console.log('========================================');
console.log('\nGenerated JWT Secret:');
console.log(secret);
console.log('\n✅ Copy secret di atas ke file .env:');
console.log(`JWT_SECRET=${secret}`);
console.log('\n========================================');
