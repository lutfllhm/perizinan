const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/mysql');
const { auth } = require('../middleware/auth');

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya file gambar (JPEG, PNG) atau PDF yang diperbolehkan'));
    }
  }
});

// Get statistics for dashboard (admin/hrd only) - HARUS SEBELUM /:id
router.get('/stats/dashboard', auth, async (req, res) => {
  try {
    // Cek role user
    if (req.user.role !== 'admin' && req.user.role !== 'hrd') {
      return res.status(403).json({ 
        message: 'Anda tidak memiliki akses ke statistik' 
      });
    }

    // Total pengajuan
    const [totalResult] = await db.query(
      'SELECT COUNT(*) as total FROM pengajuan'
    );

    // Pengajuan berdasarkan status
    const [statusResult] = await db.query(
      `SELECT 
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
       FROM pengajuan`
    );

    // Pengajuan per bulan (6 bulan terakhir)
    const [monthlyResult] = await db.query(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as bulan,
        COUNT(*) as jumlah
       FROM pengajuan
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY bulan ASC`
    );

    // Pengajuan berdasarkan jenis
    const [typeResult] = await db.query(
      `SELECT 
        jenis_perizinan,
        COUNT(*) as jumlah
       FROM pengajuan
       GROUP BY jenis_perizinan`
    );

    res.json({
      total: totalResult[0].total,
      pending: statusResult[0].pending || 0,
      approved: statusResult[0].approved || 0,
      rejected: statusResult[0].rejected || 0,
      byMonth: monthlyResult,
      byType: typeResult
    });

  } catch (error) {
    console.error('❌ Error get stats:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil statistik',
      error: error.message 
    });
  }
});

// Get report with filters (admin/hrd only) - HARUS SEBELUM /:id
router.get('/report', auth, async (req, res) => {
  try {
    // Cek role user
    if (req.user.role !== 'admin' && req.user.role !== 'hrd') {
      return res.status(403).json({ 
        message: 'Anda tidak memiliki akses ke report' 
      });
    }

    const { startDate, endDate, status, jenis_perizinan } = req.query;

    let query = 'SELECT * FROM pengajuan WHERE 1=1';
    const params = [];

    if (startDate) {
      query += ' AND DATE(created_at) >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND DATE(created_at) <= ?';
      params.push(endDate);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (jenis_perizinan) {
      query += ' AND jenis_perizinan = ?';
      params.push(jenis_perizinan);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, params);

    res.json(rows);

  } catch (error) {
    console.error('❌ Error get report:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil report',
      error: error.message 
    });
  }
});

// Get all pengajuan
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM pengajuan ORDER BY created_at DESC'
    );

    res.json(rows);
  } catch (error) {
    console.error('❌ Error get pengajuan:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data pengajuan',
      error: error.message 
    });
  }
});

// Get pengajuan by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM pengajuan WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Pengajuan tidak ditemukan' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error get pengajuan by ID:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data pengajuan',
      error: error.message 
    });
  }
});

// Create pengajuan
router.post('/', upload.single('bukti_foto'), async (req, res) => {
  try {
    const { karyawan_id, kantor, nama, jabatan, departemen, no_telp, jenis_perizinan, tanggal_mulai, tanggal_selesai, catatan } = req.body;

    // Validasi input
    if (!nama || !no_telp || !jenis_perizinan || !tanggal_mulai || !tanggal_selesai) {
      return res.status(400).json({ 
        message: 'Semua field wajib diisi' 
      });
    }

    // Validasi dinas luar harus ada foto
    if (jenis_perizinan === 'dinas_luar' && !req.file) {
      return res.status(400).json({ 
        message: 'Dinas luar wajib melampirkan bukti foto' 
      });
    }

    const bukti_foto = req.file ? req.file.filename : null;
    const bulan = new Date().getMonth() + 1;
    const tahun = new Date().getFullYear();

    // Validasi quota untuk pulang_cepat dan datang_terlambat
    if (karyawan_id && (jenis_perizinan === 'pulang_cepat' || jenis_perizinan === 'datang_terlambat')) {
      // Get or create quota bulanan
      let [quota] = await db.query(
        'SELECT * FROM quota_bulanan WHERE karyawan_id = ? AND bulan = ? AND tahun = ?',
        [karyawan_id, bulan, tahun]
      );

      if (quota.length === 0) {
        await db.query(
          'INSERT INTO quota_bulanan (karyawan_id, bulan, tahun) VALUES (?, ?, ?)',
          [karyawan_id, bulan, tahun]
        );
        quota = [{ pulang_cepat: 0, datang_terlambat: 0 }];
      }

      const currentQuota = quota[0];
      
      if (jenis_perizinan === 'pulang_cepat' && currentQuota.pulang_cepat >= 3) {
        return res.status(400).json({ 
          message: 'Quota pulang cepat bulan ini sudah habis (maksimal 3x)' 
        });
      }

      if (jenis_perizinan === 'datang_terlambat' && currentQuota.datang_terlambat >= 3) {
        return res.status(400).json({ 
          message: 'Quota datang terlambat bulan ini sudah habis (maksimal 3x)' 
        });
      }
    }

    // Validasi cuti jika ada karyawan_id
    if (karyawan_id && jenis_perizinan === 'cuti') {
      const [karyawan] = await db.query(
        'SELECT sisa_cuti FROM karyawan WHERE id = ?',
        [karyawan_id]
      );

      if (karyawan.length > 0 && karyawan[0].sisa_cuti <= 0) {
        return res.status(400).json({ 
          message: 'Sisa cuti Anda sudah habis' 
        });
      }
    }

    const [result] = await db.query(
      `INSERT INTO pengajuan 
       (karyawan_id, kantor, nama, jabatan, departemen, no_telp, jenis_perizinan, tanggal_mulai, tanggal_selesai, bukti_foto, catatan, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [karyawan_id || null, kantor || null, nama, jabatan || null, departemen || null, no_telp, jenis_perizinan, tanggal_mulai, tanggal_selesai, bukti_foto, catatan || '']
    );

    console.log('✅ Pengajuan created:', result.insertId);

    res.status(201).json({
      message: 'Pengajuan berhasil dibuat',
      id: result.insertId
    });

  } catch (error) {
    console.error('❌ Error create pengajuan:', error);
    res.status(500).json({ 
      message: 'Gagal membuat pengajuan',
      error: error.message 
    });
  }
});

// Update status pengajuan (admin/hrd only) - PUT method untuk frontend
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, catatan } = req.body;

    // Validasi status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        message: 'Status tidak valid' 
      });
    }

    // Cek role user
    if (req.user.role !== 'admin' && req.user.role !== 'hrd') {
      return res.status(403).json({ 
        message: 'Anda tidak memiliki akses untuk mengubah status' 
      });
    }

    // Ambil data pengajuan
    const [pengajuan] = await db.query(
      'SELECT * FROM pengajuan WHERE id = ?',
      [req.params.id]
    );

    if (pengajuan.length === 0) {
      return res.status(404).json({ 
        message: 'Pengajuan tidak ditemukan' 
      });
    }

    const item = pengajuan[0];
    const bulan = new Date().getMonth() + 1;
    const tahun = new Date().getFullYear();

    // Jika approved, update quota dan cuti
    if (status === 'approved' && item.karyawan_id) {
      // Update quota untuk pulang_cepat dan datang_terlambat
      if (item.jenis_perizinan === 'pulang_cepat' || item.jenis_perizinan === 'datang_terlambat') {
        const field = item.jenis_perizinan;
        
        // Pastikan quota bulanan ada
        await db.query(
          `INSERT INTO quota_bulanan (karyawan_id, bulan, tahun, ${field}) 
           VALUES (?, ?, ?, 1)
           ON DUPLICATE KEY UPDATE ${field} = ${field} + 1`,
          [item.karyawan_id, bulan, tahun]
        );
      }

      // Update sisa cuti
      if (item.jenis_perizinan === 'cuti') {
        await db.query(
          'UPDATE karyawan SET sisa_cuti = sisa_cuti - 1 WHERE id = ? AND sisa_cuti > 0',
          [item.karyawan_id]
        );
      }
    }

    // Update status
    await db.query(
      'UPDATE pengajuan SET status = ?, catatan = ? WHERE id = ?',
      [status, catatan || '', req.params.id]
    );

    console.log('✅ Status updated:', req.params.id, status);

    res.json({
      message: 'Status pengajuan berhasil diupdate'
    });

  } catch (error) {
    console.error('❌ Error update status:', error);
    res.status(500).json({ 
      message: 'Gagal mengupdate status',
      error: error.message 
    });
  }
});

// Update status pengajuan (admin/hrd only) - PATCH method (alternative)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, catatan } = req.body;

    // Validasi status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        message: 'Status tidak valid' 
      });
    }

    // Cek role user
    if (req.user.role !== 'admin' && req.user.role !== 'hrd') {
      return res.status(403).json({ 
        message: 'Anda tidak memiliki akses untuk mengubah status' 
      });
    }

    // Ambil data pengajuan
    const [pengajuan] = await db.query(
      'SELECT * FROM pengajuan WHERE id = ?',
      [req.params.id]
    );

    if (pengajuan.length === 0) {
      return res.status(404).json({ 
        message: 'Pengajuan tidak ditemukan' 
      });
    }

    // Update status
    await db.query(
      'UPDATE pengajuan SET status = ?, catatan = ? WHERE id = ?',
      [status, catatan || '', req.params.id]
    );

    console.log('✅ Status updated:', req.params.id, status);

    res.json({
      message: 'Status pengajuan berhasil diupdate'
    });

  } catch (error) {
    console.error('❌ Error update status:', error);
    res.status(500).json({ 
      message: 'Gagal mengupdate status',
      error: error.message 
    });
  }
});

// Delete pengajuan (admin/hrd only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Cek role user - HRD juga bisa menghapus
    if (req.user.role !== 'admin' && req.user.role !== 'hrd') {
      return res.status(403).json({ 
        message: 'Anda tidak memiliki akses untuk menghapus pengajuan' 
      });
    }

    await db.query('DELETE FROM pengajuan WHERE id = ?', [req.params.id]);

    console.log('✅ Pengajuan deleted:', req.params.id);

    res.json({
      message: 'Pengajuan berhasil dihapus'
    });

  } catch (error) {
    console.error('❌ Error delete pengajuan:', error);
    res.status(500).json({ 
      message: 'Gagal menghapus pengajuan',
      error: error.message 
    });
  }
});

module.exports = router;
