const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

console.log('🧪 TEST SERVER STARTING...');
console.log('📍 Port:', PORT);
console.log('📍 CWD:', process.cwd());
console.log('📍 __dirname:', __dirname);

// List files in current directory
const fs = require('fs');
const path = require('path');

console.log('\n📂 Files in current directory:');
try {
  const files = fs.readdirSync('.');
  files.forEach(file => console.log('  -', file));
} catch (e) {
  console.log('❌ Error reading directory:', e.message);
}

console.log('\n📂 Files in routes directory:');
try {
  const routesPath = path.join(__dirname, 'routes');
  const files = fs.readdirSync(routesPath);
  files.forEach(file => console.log('  -', file));
} catch (e) {
  console.log('❌ Error reading routes directory:', e.message);
}

// Test CORS
app.use(require('cors')({ origin: '*' }));
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Test route works!',
    cwd: process.cwd(),
    dirname: __dirname
  });
});

// Try to load auth route
console.log('\n🔄 Attempting to load auth route...');
try {
  const authRoute = require('./routes/auth');
  app.use('/api/auth', authRoute);
  console.log('✅ Auth route loaded successfully!');
} catch (e) {
  console.log('❌ Failed to load auth route:', e.message);
  console.log('❌ Stack:', e.stack);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.url,
    method: req.method
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n✅ Test server running on port', PORT);
  console.log('🔗 Try: http://localhost:' + PORT + '/test');
  console.log('🔗 Try: http://localhost:' + PORT + '/api/auth/login');
});
