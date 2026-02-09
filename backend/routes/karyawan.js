// Route untuk manajemen data karyawan
const express = require('express');
const router = express.Router();
const db = require('../config/mysql');
const { auth } = require('../middleware/auth');

/**
 * GET /api/karyawan
 * Ambil semua data karyawan
 */
router.get('/', auth, async (req, res) => {
  try {
    const { kantor, status = 'aktif' } = req.query;
    
    let query = 'SELECT * FROM karyawan WHERE status = ?';
    const params = [status];
    
    if (kantor) {
      query += ' AND kantor = ?';
      params.push(kantor);
    }
    
    query += ' ORDER BY kantor, nama';
    
    const [baris] = await db.query(query, params);
    res.json(baris);
  } catch (error) {
    console.error('❌ Error ambil karyawan:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data karyawan',
      error: error.message 
    });
  }
});

/**
 * GET /api/karyawan/:id
 * Ambil data karyawan berdasarkan ID
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const [baris] = await db.query(
      'SELECT * FROM karyawan WHERE id = ?',
      [req.params.id]
    );

    if (baris.length === 0) {
      return res.status(404).json({ message: 'Karyawan tidak ditemukan' });
    }

    res.json(baris[0]);
  } catch (error) {
    console.error('❌ Error ambil karyawan by ID:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data karyawan',
      error: error.message 
    });
  }
});

/**
 * GET /api/karyawan/:id/quota
 * Ambil informasi quota karyawan (cuti, pulang cepat, datang terlambat)
 */
router.get('/:id/quota', auth, async (req, res) => {
  try {
    const karyawanId = req.params.id;
    const bulan = new Date().getMonth() + 1;
    const tahun = new Date().getFullYear();

    // Ambil data karyawan
    const [karyawan] = await db.query(
      'SELECT sisa_cuti, tahun_cuti FROM karyawan WHERE id = ?',
      [karyawanId]
    );

    if (karyawan.length === 0) {
      return res.status(404).json({ message: 'Karyawan tidak ditemukan' });
    }

    // Ambil atau buat quota bulanan
    let [quota] = await db.query(
      'SELECT * FROM quota_bulanan WHERE karyawan_id = ? AND bulan = ? AND tahun = ?',
      [karyawanId, bulan, tahun]
    );

    if (quota.length === 0) {
      await db.query(
        'INSERT INTO quota_bulanan (karyawan_id, bulan, tahun) VALUES (?, ?, ?)',
        [karyawanId, bulan, tahun]
      );
      quota = [{ pulang_cepat: 0, datang_terlambat: 0 }];
    }

    res.json({
      sisa_cuti: karyawan[0].sisa_cuti,
      tahun_cuti: karyawan[0].tahun_cuti,
      pulang_cepat: quota[0].pulang_cepat,
      datang_terlambat: quota[0].datang_terlambat,
      bulan_ini: `${bulan}/${tahun}`
    });
  } catch (error) {
    console.error('❌ Error ambil quota:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data quota',
      error: error.message 
    });
  }
});

/**
 * POST /api/karyawan
 * Tambah karyawan baru (HRD only)
 */
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'hrd') {
      return res.status(403).json({ 
        message: 'Anda tidak memiliki akses untuk menambah karyawan' 
      });
    }

    const { kantor, nama, jabatan, departemen, no_telp, jatah_cuti = 12 } = req.body;

    if (!kantor || !nama || !jabatan || !departemen) {
      return res.status(400).json({ 
        message: 'Kantor, nama, jabatan, dan departemen wajib diisi' 
      });
    }

    const [hasil] = await db.query(
      `INSERT INTO karyawan (kantor, nama, jabatan, departemen, no_telp, jatah_cuti, sisa_cuti, tahun_cuti) 
       VALUES (?, ?, ?, ?, ?, ?, ?, YEAR(CURDATE()))`,
      [kantor, nama, jabatan, departemen, no_telp, jatah_cuti, jatah_cuti]
    );

    console.log('✅ Karyawan ditambahkan:', hasil.insertId);

    res.status(201).json({
      message: 'Karyawan berhasil ditambahkan',
      id: hasil.insertId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        message: 'Karyawan dengan nama yang sama sudah ada di kantor ini' 
      });
    }
    console.error('❌ Error tambah karyawan:', error);
    res.status(500).json({ 
      message: 'Gagal menambahkan karyawan',
      error: error.message 
    });
  }
});

/**
 * PUT /api/karyawan/:id
 * Update data karyawan (HRD only)
 */
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'hrd') {
      return res.status(403).json({ 
        message: 'Anda tidak memiliki akses untuk mengubah data karyawan' 
      });
    }

    const { kantor, nama, jabatan, departemen, no_telp, jatah_cuti, sisa_cuti, status } = req.body;

    await db.query(
      `UPDATE karyawan 
       SET kantor = ?, nama = ?, jabatan = ?, departemen = ?, no_telp = ?, 
           jatah_cuti = ?, sisa_cuti = ?, status = ?
       WHERE id = ?`,
      [kantor, nama, jabatan, departemen, no_telp, jatah_cuti, sisa_cuti, status, req.params.id]
    );

    console.log('✅ Karyawan diperbarui:', req.params.id);

    res.json({ message: 'Data karyawan berhasil diperbarui' });
  } catch (error) {
    console.error('❌ Error perbarui karyawan:', error);
    res.status(500).json({ 
      message: 'Gagal memperbarui data karyawan',
      error: error.message 
    });
  }
});

/**
 * POST /api/karyawan/:id/reset-cuti
 * Reset cuti tahunan karyawan (HRD only)
 */
router.post('/:id/reset-cuti', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'hrd') {
      return res.status(403).json({ 
        message: 'Anda tidak memiliki akses untuk reset cuti' 
      });
    }

    const { jatah_cuti = 12 } = req.body;

    await db.query(
      `UPDATE karyawan 
       SET sisa_cuti = ?, jatah_cuti = ?, tahun_cuti = YEAR(CURDATE())
       WHERE id = ?`,
      [jatah_cuti, jatah_cuti, req.params.id]
    );

    console.log('✅ Cuti direset untuk karyawan:', req.params.id);

    res.json({ message: 'Cuti berhasil direset' });
  } catch (error) {
    console.error('❌ Error reset cuti:', error);
    res.status(500).json({ 
      message: 'Gagal mereset cuti',
      error: error.message 
    });
  }
});

/**
 * DELETE /api/karyawan/:id
 * Hapus karyawan (HRD only)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'hrd') {
      return res.status(403).json({ 
        message: 'Anda tidak memiliki akses untuk menghapus karyawan' 
      });
    }

    await db.query('DELETE FROM karyawan WHERE id = ?', [req.params.id]);

    console.log('✅ Karyawan dihapus:', req.params.id);

    res.json({ message: 'Karyawan berhasil dihapus' });
  } catch (error) {
    console.error('❌ Error hapus karyawan:', error);
    res.status(500).json({ 
      message: 'Gagal menghapus karyawan',
      error: error.message 
    });
  }
});

module.exports = router;
