// Route untuk manajemen pengajuan perizinan
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
    const suffiksUnik = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, suffiksUnik + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const tipeYangDiizinkan = /jpeg|jpg|png|pdf/;
    const ekstensi = tipeYangDiizinkan.test(path.extname(file.originalname).toLowerCase());
    const mimetype = tipeYangDiizinkan.test(file.mimetype);

    if (mimetype && ekstensi) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya file gambar (JPEG, PNG) atau PDF yang diperbolehkan'));
    }
  }
});

/**
 * GET /api/pengajuan/stats/dashboard
 * Ambil statistik untuk dashboard (admin/hrd only)
 */
router.get('/stats/dashboard', auth, async (req, res) => {
  try {
    // Cek role user
    if (req.user.role !== 'admin' && req.user.role !== 'hrd') {
      return res.status(403).json({ 
        message: 'Anda tidak memiliki akses ke statistik' 
      });
    }

    // Total pengajuan
    const [hasilTotal] = await db.query(
      'SELECT COUNT(*) as total FROM pengajuan'
    );

    // Pengajuan berdasarkan status
    const [hasilStatus] = await db.query(
      `SELECT 
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
       FROM pengajuan`
    );

    // Pengajuan per bulan (6 bulan terakhir)
    const [hasilBulanan] = await db.query(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as bulan,
        COUNT(*) as jumlah
       FROM pengajuan
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY bulan ASC`
    );

    // Pengajuan berdasarkan jenis
    const [hasilJenis] = await db.query(
      `SELECT 
        jenis_perizinan,
        COUNT(*) as jumlah
       FROM pengajuan
       GROUP BY jenis_perizinan`
    );

    res.json({
      total: hasilTotal[0].total,
      pending: hasilStatus[0].pending || 0,
      approved: hasilStatus[0].approved || 0,
      rejected: hasilStatus[0].rejected || 0,
      byMonth: hasilBulanan,
      byType: hasilJenis
    });

  } catch (error) {
    console.error('❌ Error ambil statistik:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil statistik',
      error: error.message 
    });
  }
});

/**
 * GET /api/pengajuan/report
 * Ambil report dengan filter (admin/hrd only)
 */
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

    const [baris] = await db.query(query, params);

    res.json(baris);

  } catch (error) {
    console.error('❌ Error ambil report:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil report',
      error: error.message 
    });
  }
});

/**
 * GET /api/pengajuan
 * Ambil semua pengajuan
 */
router.get('/', auth, async (req, res) => {
  try {
    const [baris] = await db.query(
      'SELECT * FROM pengajuan ORDER BY created_at DESC'
    );

    res.json(baris);
  } catch (error) {
    console.error('❌ Error ambil pengajuan:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data pengajuan',
      error: error.message 
    });
  }
});

/**
 * GET /api/pengajuan/:id
 * Ambil pengajuan berdasarkan ID
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const [baris] = await db.query(
      'SELECT * FROM pengajuan WHERE id = ?',
      [req.params.id]
    );

    if (baris.length === 0) {
      return res.status(404).json({ message: 'Pengajuan tidak ditemukan' });
    }

    res.json(baris[0]);
  } catch (error) {
    console.error('❌ Error ambil pengajuan by ID:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data pengajuan',
      error: error.message 
    });
  }
});

/**
 * POST /api/pengajuan
 * Buat pengajuan baru
 */
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

    const [hasil] = await db.query(
      `INSERT INTO pengajuan 
       (karyawan_id, kantor, nama, jabatan, departemen, no_telp, jenis_perizinan, tanggal_mulai, tanggal_selesai, bukti_foto, catatan, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [karyawan_id || null, kantor || null, nama, jabatan || null, departemen || null, no_telp, jenis_perizinan, tanggal_mulai, tanggal_selesai, bukti_foto, catatan || '']
    );

    console.log('✅ Pengajuan dibuat:', hasil.insertId);

    res.status(201).json({
      message: 'Pengajuan berhasil dibuat',
      id: hasil.insertId
    });

  } catch (error) {
    console.error('❌ Error buat pengajuan:', error);
    res.status(500).json({ 
      message: 'Gagal membuat pengajuan',
      error: error.message 
    });
  }
});

/**
 * PUT /api/pengajuan/:id
 * Update status pengajuan (admin/hrd only)
 */
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

    console.log('✅ Status diperbarui:', req.params.id, status);

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

/**
 * PATCH /api/pengajuan/:id/status
 * Update status pengajuan (admin/hrd only) - Alternative method
 */
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

    console.log('✅ Status diperbarui:', req.params.id, status);

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

/**
 * DELETE /api/pengajuan/:id
 * Hapus pengajuan (admin/hrd only)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    // Cek role user - HRD juga bisa menghapus
    if (req.user.role !== 'admin' && req.user.role !== 'hrd') {
      return res.status(403).json({ 
        message: 'Anda tidak memiliki akses untuk menghapus pengajuan' 
      });
    }

    await db.query('DELETE FROM pengajuan WHERE id = ?', [req.params.id]);

    console.log('✅ Pengajuan dihapus:', req.params.id);

    res.json({
      message: 'Pengajuan berhasil dihapus'
    });

  } catch (error) {
    console.error('❌ Error hapus pengajuan:', error);
    res.status(500).json({ 
      message: 'Gagal menghapus pengajuan',
      error: error.message 
    });
  }
});

module.exports = router;
