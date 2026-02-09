// Server utama aplikasi perizinan
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import services
const { koneksiDatabase, dapatkanDatabase } = require('./services/database.service');
const { inisialisasiTabel } = require('./services/inisialisasi.service');

// Import routes
const routeAuth = require('./routes/auth');
const routeKaryawan = require('./routes/karyawan');
const routePengajuan = require('./routes/pengajuan');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 SERVER DIMULAI...');
console.log('📍 Port:', PORT);

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve file statis dari folder uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    pesan: 'Server berjalan dengan baik',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', routeAuth);
app.use('/api/karyawan', routeKaryawan);
app.use('/api/pengajuan', routePengajuan);

// Handler 404
app.use((req, res) => {
  console.log('❌ 404:', req.method, req.url);
  res.status(404).json({
    error: 'Tidak Ditemukan',
    path: req.url,
    method: req.method,
    routeTersedia: [
      'POST /api/auth/login',
      'GET /api/health',
      'GET /api/karyawan',
      'GET /api/pengajuan',
      'POST /api/pengajuan'
    ]
  });
});

// Handler error
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: err.message });
});

// Mulai server
koneksiDatabase().then(async (db) => {
  if (db) {
    await inisialisasiTabel(db);
  }
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('='.repeat(50));
    console.log(`🚀 Server berjalan di port ${PORT}`);
    console.log(`✅ Server siap`);
    console.log('='.repeat(50));
    console.log('');
    console.log('Route yang tersedia:');
    console.log('  POST   /api/auth/login');
    console.log('  GET    /api/health');
    console.log('  GET    /api/karyawan');
    console.log('  GET    /api/pengajuan');
    console.log('  POST   /api/pengajuan');
    console.log('');
  });
});
