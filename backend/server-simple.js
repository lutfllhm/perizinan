const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Starting server...');
console.log('📍 Environment:', process.env.NODE_ENV || 'development');
console.log('📍 Port:', PORT);

// CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server berjalan dengan baik',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    database: 'MySQL'
  });
});

// Load routes
console.log('📝 Loading routes...');
app.use('/api/auth', require('./routes/auth'));
console.log('✅ /api/auth loaded');

app.use('/api/pengajuan', require('./routes/pengajuan'));
console.log('✅ /api/pengajuan loaded');

app.use('/api/karyawan', require('./routes/karyawan'));
console.log('✅ /api/karyawan loaded');

app.use('/api/admin-reset', require('./routes/reset-admin'));
console.log('✅ /api/admin-reset loaded');

app.use('/api/simple-reset', require('./routes/simple-reset'));
console.log('✅ /api/simple-reset loaded');

console.log('✅ All routes loaded');

// 404 handler
app.use((req, res) => {
  console.log('❌ 404:', req.method, req.url);
  res.status(404).json({
    status: 'ERROR',
    message: 'Route not found',
    path: req.url,
    method: req.method,
    availableRoutes: [
      'POST /api/auth/login',
      'GET /api/health',
      'GET /api/karyawan',
      'GET /api/pengajuan'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    status: 'ERROR', 
    message: err.message 
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('='.repeat(50));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`✅ Server ready`);
  console.log('='.repeat(50));
  console.log('');
  console.log('Available routes:');
  console.log('  POST   /api/auth/login');
  console.log('  GET    /api/health');
  console.log('  GET    /api/karyawan');
  console.log('  GET    /api/pengajuan');
  console.log('');
});
