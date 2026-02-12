import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { pengajuanAPI, authAPI, API_URL, karyawanAPI } from '../utils/api';
import { 
  FiHome, FiFileText, FiBarChart2, FiLogOut, FiMenu, FiX,
  FiClock, FiCheckCircle, FiXCircle, FiEye, FiTrash2, FiSettings, FiUser, FiSend, FiEdit, FiPlus, FiRefreshCw, FiSearch
} from 'react-icons/fi';
import { 
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import LazyImage from '../components/LazyImage';
import ImageModal from '../components/ImageModal';
import { SkeletonTable } from '../components/SkeletonLoader';

const HRDDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const nama = localStorage.getItem('nama');

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logout berhasil');
    navigate('/');
  };

  const Sidebar = () => {
    const location = window.location.pathname;
    
    const menuItems = [
      { path: '/hrd', icon: FiHome, label: 'Dashboard', exact: true },
      { path: '/hrd/pengajuan', icon: FiFileText, label: 'Daftar Pengajuan' },
      { path: '/hrd/karyawan', icon: FiUser, label: 'Daftar Karyawan' },
      { path: '/hrd/quota', icon: FiClock, label: 'Quota Karyawan' },
      { path: '/hrd/report', icon: FiBarChart2, label: 'Report' },
      { path: '/hrd/profile', icon: FiSettings, label: 'Manajemen Akun' },
    ];

    const isActive = (path, exact = false) => {
      if (exact) return location === path;
      return location.startsWith(path);
    };

    return (
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`${
          sidebarOpen ? 'w-72' : 'w-20'
        } bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 text-white min-h-screen fixed left-0 top-0 transition-all duration-300 z-40 shadow-2xl overflow-y-auto dark-scrollbar`}
      >
        <div className="p-4 pb-24">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-600 flex-shrink-0">{sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3"
              >
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-xl">
                  <FiFileText className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">HRD Panel</h2>
                  <p className="text-xs text-gray-400">Sistem Perizinan</p>
                </div>
              </motion.div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
            >
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* User Info */}
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl border border-blue-500/30 flex-shrink-0"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-full">
                  <FiUser className="text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{nama}</p>
                  <p className="text-xs text-gray-400">HRD Staff</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Menu - Flex grow to push logout to bottom */}
          <nav className="space-y-2 flex-1">{menuItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/50'
                        : 'hover:bg-gray-700 hover:translate-x-1'
                    }`}
                  >
                    <Icon size={20} className={active ? 'text-white' : 'text-gray-400'} />
                    {sidebarOpen && (
                      <span className={`font-medium ${active ? 'text-white' : 'text-gray-300'}`}>
                        {item.label}
                      </span>
                    )}
                    {active && sidebarOpen && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="py-3 flex-shrink-0">
            <div className="border-t border-gray-600"></div>
          </div>

          {/* Logout Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-600 hover:translate-x-1 transition-all duration-200 group flex-shrink-0"
          >
            <FiLogOut size={20} className="text-gray-400 group-hover:text-white" />
            {sidebarOpen && <span className="font-medium text-gray-300 group-hover:text-white">Logout</span>}
          </motion.button>

          {/* Footer */}
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 pb-4 flex-shrink-0"
            >
              <div className="p-3 bg-gray-700/50 rounded-xl border border-gray-600">
                <p className="text-xs text-gray-400 text-center">
                  © 2024 IWARE
                </p>
                <p className="text-xs text-gray-500 text-center mt-1">
                  v1.0.0
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Sidebar />
      <div className={`flex-1 ${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300`}>
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pengajuan" element={<DaftarPengajuan />} />
            <Route path="/karyawan" element={<DaftarKaryawan />} />
            <Route path="/quota" element={<QuotaKaryawan />} />
            <Route path="/report" element={<Report />} />
            <Route path="/profile" element={<ManajemenAkun />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await pengajuanAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default empty stats instead of showing error
      setStats({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        byMonth: [],
        byType: []
      });
      toast.error('Gagal memuat statistik: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header dengan Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-2xl p-8 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Dashboard HRD</h2>
            <p className="text-blue-100">Kelola dan monitor pengajuan perizinan</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-blue-100">Tanggal Hari Ini</p>
              <p className="text-xl font-bold">{new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards dengan Icon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <FiFileText className="text-3xl text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                TOTAL
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Pengajuan</h3>
            <p className="text-4xl font-bold text-gray-800">{stats?.total || 0}</p>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="text-green-500 font-semibold mr-1">↑ 100%</span>
              dari semua data
            </div>
          </div>
          <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <FiClock className="text-3xl text-yellow-600" />
              </div>
              <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                PENDING
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Menunggu Persetujuan</h3>
            <p className="text-4xl font-bold text-gray-800">{stats?.pending || 0}</p>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="text-yellow-500 font-semibold mr-1">⏳</span>
              perlu ditinjau
            </div>
          </div>
          <div className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <FiCheckCircle className="text-3xl text-green-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                APPROVED
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Disetujui</h3>
            <p className="text-4xl font-bold text-gray-800">{stats?.approved || 0}</p>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="text-green-500 font-semibold mr-1">✓</span>
              telah disetujui
            </div>
          </div>
          <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-xl">
                <FiXCircle className="text-3xl text-red-600" />
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                REJECTED
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Ditolak</h3>
            <p className="text-4xl font-bold text-gray-800">{stats?.rejected || 0}</p>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="text-red-500 font-semibold mr-1">✗</span>
              tidak disetujui
            </div>
          </div>
          <div className="h-2 bg-gradient-to-r from-red-400 to-red-600"></div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="bg-primary-100 p-2 rounded-lg mr-3">
            <FiFileText className="text-primary-600" />
          </span>
          Aksi Cepat
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/hrd/pengajuan">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer"
            >
              <FiFileText className="text-2xl text-primary-600 mb-2" />
              <h4 className="font-semibold text-gray-800">Daftar Pengajuan</h4>
              <p className="text-sm text-gray-600">Lihat semua pengajuan</p>
            </motion.div>
          </Link>
          <Link to="/hrd/report">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer"
            >
              <FiBarChart2 className="text-2xl text-green-600 mb-2" />
              <h4 className="font-semibold text-gray-800">Report</h4>
              <p className="text-sm text-gray-600">Lihat laporan lengkap</p>
            </motion.div>
          </Link>
          <Link to="/hrd/profile">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer"
            >
              <FiSettings className="text-2xl text-purple-600 mb-2" />
              <h4 className="font-semibold text-gray-800">Pengaturan</h4>
              <p className="text-sm text-gray-600">Kelola akun Anda</p>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Pengajuan per Bulan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.byMonth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="jumlah" fill="#3b82f6" name="Jumlah Pengajuan" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Jenis Perizinan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.byType || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jenis_perizinan" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="jumlah" fill="#10b981" name="Jumlah" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

const DaftarPengajuan = () => {
  const [pengajuan, setPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quotaInfo, setQuotaInfo] = useState(null);
  const [loadingQuota, setLoadingQuota] = useState(false);

  useEffect(() => {
    fetchPengajuan();
  }, []);

  // Fetch quota when modal opens
  useEffect(() => {
    if (showDetailModal && selectedItem && selectedItem.karyawan_id) {
      fetchQuotaInfo(selectedItem.karyawan_id);
    }
  }, [showDetailModal, selectedItem]);

  const fetchPengajuan = async () => {
    try {
      const response = await pengajuanAPI.getAll();
      setPengajuan(response.data);
    } catch (error) {
      toast.error('Gagal memuat data pengajuan');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuotaInfo = async (karyawanId) => {
    setLoadingQuota(true);
    try {
      const response = await karyawanAPI.getQuota(karyawanId);
      setQuotaInfo(response.data);
    } catch (error) {
      console.error('Error fetching quota:', error);
      setQuotaInfo(null);
    } finally {
      setLoadingQuota(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await pengajuanAPI.updateStatus(id, { status, catatan: '' });
      toast.success('Status berhasil diupdate');
      fetchPengajuan();
      setSelectedItem(null);
    } catch (error) {
      toast.error('Gagal update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus pengajuan ini?')) return;

    try {
      await pengajuanAPI.delete(id);
      toast.success('Pengajuan berhasil dihapus');
      fetchPengajuan();
    } catch (error) {
      toast.error('Gagal menghapus pengajuan');
    }
  };

  // Fungsi untuk membuka WhatsApp dengan pesan otomatis
  const handleSendWhatsApp = async (item) => {
    const pegawaiNumber = item.no_telp.replace(/^0/, '62'); // Convert 08xxx ke 628xxx
    
    // Fetch quota info jika ada karyawan_id
    let quotaText = '';
    if (item.karyawan_id) {
      try {
        const response = await karyawanAPI.getQuota(item.karyawan_id);
        const quota = response.data;
        
        // Tambahkan info quota sesuai jenis perizinan
        if (item.jenis_perizinan === 'tidak_masuk_cuti') {
          quotaText = `\n📊 *Sisa Quota Anda:*\n┗━ 🏖️ Sisa Cuti: *${quota.sisa_cuti} hari* (dari ${quota.jatah_cuti} hari)\n`;
        } else if (item.jenis_perizinan === 'pulang_setengah_hari') {
          const sisa = 3 - quota.pulang_cepat;
          quotaText = `\n📊 *Sisa Quota Anda:*\n┗━ 🏃 Pulang Setengah Hari: *${sisa}x tersisa* (bulan ini)\n`;
        } else if (item.jenis_perizinan === 'datang_terlambat') {
          const sisa = 3 - quota.datang_terlambat;
          quotaText = `\n📊 *Sisa Quota Anda:*\n┗━ ⏰ Datang Terlambat: *${sisa}x tersisa* (bulan ini)\n`;
        }
      } catch (error) {
        console.error('Error fetching quota:', error);
      }
    }
    
    // Buat pesan berdasarkan status
    let message = '';
    
    if (item.status === 'approved') {
      message = `╔═══════════════════════╗
║  ✅ *PENGAJUAN DISETUJUI*  ║
╚═══════════════════════╝

🎉 *Selamat!* 🎉

Kepada Yth.
*${item.nama}* 👤

Dengan hormat,
Kami informasikan bahwa pengajuan perizinan Anda telah *DISETUJUI* ✅ oleh HRD.

┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 *DETAIL PENGAJUAN*
┣━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 📌 Jenis: *${item.jenis_perizinan.toUpperCase()}*
┃ 📅 Tanggal Mulai: ${new Date(item.tanggal_mulai).toLocaleDateString('id-ID', { dateStyle: 'long' })}
┃ 📅 Tanggal Selesai: ${new Date(item.tanggal_selesai).toLocaleDateString('id-ID', { dateStyle: 'long' })}
┃ ✅ Status: *DISETUJUI*
┗━━━━━━━━━━━━━━━━━━━━━━━┛
${quotaText}${item.catatan ? `\n💬 *Catatan HRD:*\n${item.catatan}\n` : ''}
🙏 Terima kasih atas perhatian dan kerjasamanya.

Hormat kami,
*HRD IWARE* 🏢

━━━━━━━━━━━━━━━━━━━━━
_Sistem Perizinan IWARE_`;
    } else if (item.status === 'rejected') {
      message = `╔═══════════════════════╗
║  ❌ *PENGAJUAN DITOLAK*  ║
╚═══════════════════════╝

Kepada Yth.
*${item.nama}* 👤

Dengan hormat,
Kami informasikan bahwa pengajuan perizinan Anda *TIDAK DAPAT DISETUJUI* ❌

┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 *DETAIL PENGAJUAN*
┣━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 📌 Jenis: *${item.jenis_perizinan.toUpperCase()}*
┃ 📅 Tanggal Mulai: ${new Date(item.tanggal_mulai).toLocaleDateString('id-ID', { dateStyle: 'long' })}
┃ 📅 Tanggal Selesai: ${new Date(item.tanggal_selesai).toLocaleDateString('id-ID', { dateStyle: 'long' })}
┃ ❌ Status: *DITOLAK*
┗━━━━━━━━━━━━━━━━━━━━━━━┛
${quotaText}${item.catatan ? `\n⚠️ *Alasan Penolakan:*\n${item.catatan}\n` : ''}
💡 Anda dapat mengajukan kembali dengan melengkapi persyaratan yang diperlukan.

🙏 Terima kasih atas pengertiannya.

Hormat kami,
*HRD IWARE* 🏢

━━━━━━━━━━━━━━━━━━━━━
_Sistem Perizinan IWARE_`;
    } else {
      message = `╔═══════════════════════╗
║  📢 *NOTIFIKASI PERIZINAN*  ║
╚═══════════════════════╝

Kepada Yth.
*${item.nama}* 👤

Dengan hormat,
Status pengajuan perizinan Anda telah diperbarui 🔄

┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 *DETAIL PENGAJUAN*
┣━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 📌 Jenis: *${item.jenis_perizinan.toUpperCase()}*
┃ 📅 Tanggal Mulai: ${new Date(item.tanggal_mulai).toLocaleDateString('id-ID', { dateStyle: 'long' })}
┃ 📅 Tanggal Selesai: ${new Date(item.tanggal_selesai).toLocaleDateString('id-ID', { dateStyle: 'long' })}
┃ 🔄 Status: *${item.status.toUpperCase()}*
┗━━━━━━━━━━━━━━━━━━━━━━━┛
${quotaText}${item.catatan ? `\n💬 *Catatan:*\n${item.catatan}\n` : ''}
📱 Silakan cek aplikasi untuk informasi lebih lanjut.

🙏 Terima kasih.

Hormat kami,
*HRD IWARE* 🏢

━━━━━━━━━━━━━━━━━━━━━
_Sistem Perizinan IWARE_`;
    }
    
    // Encode pesan untuk URL
    const encodedMessage = encodeURIComponent(message);
    
    // Buka WhatsApp Web/App
    const whatsappUrl = `https://wa.me/${pegawaiNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShowDetail = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleShowImage = (imageSrc, imageAlt) => {
    setSelectedImage({ src: imageSrc, alt: imageAlt });
    setShowImageModal(true);
  };

  if (loading) return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Daftar Pengajuan</h2>
      <SkeletonTable rows={8} />
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold text-gray-800">Daftar Pengajuan</h2>
        <div className="text-sm text-gray-600">
          Total: <span className="font-bold text-primary-600">{pengajuan.length}</span> pengajuan
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">No. Telp</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Jenis</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {pengajuan.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.no_telp}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-semibold"
                      >
                        {item.jenis_perizinan}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(item.tanggal_mulai).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          item.status === 'approved' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' :
                          item.status === 'rejected' ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800' :
                          'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800'
                        }`}
                      >
                        {item.status}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleShowDetail(item)}
                          className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                          title="Lihat Detail"
                        >
                          <FiEye />
                          <span>Detail</span>
                        </motion.button>
                        {item.status === 'pending' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleUpdateStatus(item.id, 'approved')}
                              className="px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                            >
                              Setuju
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleUpdateStatus(item.id, 'rejected')}
                              className="px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                            >
                              Tolak
                            </motion.button>
                          </>
                        )}
                        {(item.status === 'approved' || item.status === 'rejected') && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSendWhatsApp(item)}
                            className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                            title="Kirim via WhatsApp"
                          >
                            <FiSend />
                            <span>Kirim WA</span>
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                          title="Hapus Pengajuan"
                        >
                          <FiTrash2 />
                          <span>Hapus</span>
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal Detail Pengajuan */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">Detail Pengajuan</h3>
                  <p className="text-blue-100 text-sm mt-1">ID: #{selectedItem.id}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <FiX size={24} />
                </motion.button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200"
                >
                  <label className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Status</label>
                  <p className="mt-2">
                    <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold ${
                      selectedItem.status === 'approved' ? 'bg-green-500 text-white' :
                      selectedItem.status === 'rejected' ? 'bg-red-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {selectedItem.status.toUpperCase()}
                    </span>
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200"
                >
                  <label className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Jenis Perizinan</label>
                  <p className="text-lg font-bold text-gray-800 mt-2 capitalize">{selectedItem.jenis_perizinan}</p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nama Lengkap</label>
                  <p className="text-lg font-semibold text-gray-800 mt-1">{selectedItem.nama}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">No. Telepon/WhatsApp</label>
                  <p className="text-lg font-semibold text-gray-800 mt-1">{selectedItem.no_telp}</p>
                </div>

                {/* Info Quota Karyawan */}
                {quotaInfo && !loadingQuota && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200"
                  >
                    <label className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3 block">
                      📊 Info Quota Karyawan
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-gray-600 mb-1">Sisa Cuti</p>
                        <p className={`text-2xl font-bold ${
                          quotaInfo.sisa_cuti > 5 ? 'text-green-600' : 
                          quotaInfo.sisa_cuti > 0 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {quotaInfo.sisa_cuti} hari
                        </p>
                        <p className="text-xs text-gray-500 mt-1">dari {quotaInfo.jatah_cuti} hari</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-gray-600 mb-1">Pulang Cepat</p>
                        <p className={`text-2xl font-bold ${
                          quotaInfo.pulang_cepat < 3 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {quotaInfo.pulang_cepat}/3x
                        </p>
                        <p className="text-xs text-gray-500 mt-1">bulan ini</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-gray-600 mb-1">Datang Terlambat</p>
                        <p className={`text-2xl font-bold ${
                          quotaInfo.datang_terlambat < 3 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {quotaInfo.datang_terlambat}/3x
                        </p>
                        <p className="text-xs text-gray-500 mt-1">bulan ini</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {loadingQuota && (
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <p className="text-sm text-gray-600">Memuat info quota...</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <label className="text-xs font-semibold text-green-600 uppercase tracking-wide">Tanggal & Jam Mulai</label>
                    <p className="text-sm font-semibold text-gray-800 mt-1">
                      {new Date(selectedItem.tanggal_mulai).toLocaleString('id-ID', {
                        dateStyle: 'full',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                    <label className="text-xs font-semibold text-red-600 uppercase tracking-wide">Tanggal & Jam Selesai</label>
                    <p className="text-sm font-semibold text-gray-800 mt-1">
                      {new Date(selectedItem.tanggal_selesai).toLocaleString('id-ID', {
                        dateStyle: 'full',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                </div>

                {selectedItem.bukti_foto && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Bukti Foto</label>
                    <div className="relative rounded-xl overflow-hidden border-4 border-gray-200 hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-2xl">
                      <LazyImage
                        src={`${API_URL}/uploads/${selectedItem.bukti_foto}`}
                        alt="Bukti Foto"
                        className="w-full h-80"
                        thumbnail={true}
                        onClick={() => handleShowImage(`${API_URL}/uploads/${selectedItem.bukti_foto}`, 'Bukti Foto')}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center italic">💡 Klik gambar untuk memperbesar dan zoom</p>
                  </motion.div>
                )}

                {selectedItem.catatan && (
                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <label className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">Catatan</label>
                    <p className="text-gray-800 mt-1">{selectedItem.catatan}</p>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tanggal Pengajuan</label>
                  <p className="text-sm text-gray-800 mt-1">
                    {new Date(selectedItem.created_at).toLocaleString('id-ID', {
                      dateStyle: 'full',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
              </motion.div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                {selectedItem.status === 'pending' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleUpdateStatus(selectedItem.id, 'approved');
                        setShowDetailModal(false);
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg font-semibold transition-all"
                    >
                      ✓ Setujui
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleUpdateStatus(selectedItem.id, 'rejected');
                        setShowDetailModal(false);
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-lg font-semibold transition-all"
                    >
                      ✗ Tolak
                    </motion.button>
                  </>
                )}
                {(selectedItem.status === 'approved' || selectedItem.status === 'rejected') && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendWhatsApp(selectedItem)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg font-semibold transition-all flex items-center justify-center space-x-2"
                  >
                    <FiSend />
                    <span>📱 Kirim via WhatsApp</span>
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDetailModal(false)}
                  className={`${selectedItem.status === 'pending' ? 'w-full' : 'flex-1'} px-6 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 font-semibold transition-all`}
                >
                  Tutup
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <ImageModal
          src={selectedImage.src}
          alt={selectedImage.alt}
          onClose={() => {
            setShowImageModal(false);
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
};

const Report = () => {
  const [report, setReport] = useState([]);
  const [filters, setFilters] = useState({ bulan: '', tahun: new Date().getFullYear() });

  const fetchReport = async () => {
    try {
      const response = await pengajuanAPI.getReport(filters);
      setReport(response.data);
    } catch (error) {
      toast.error('Gagal memuat report');
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Report Pengajuan</h2>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
            <select
              value={filters.bulan}
              onChange={(e) => setFilters({ ...filters, bulan: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Semua Bulan</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
            <input
              type="number"
              value={filters.tahun}
              onChange={(e) => setFilters({ ...filters, tahun: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {report.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">{item.nama}</td>
                  <td className="px-6 py-4">{item.jenis_perizinan}</td>
                  <td className="px-6 py-4">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      item.status === 'approved' ? 'bg-green-100 text-green-800' :
                      item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ManajemenAkun = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: localStorage.getItem('username') || '',
    nama: localStorage.getItem('nama') || '',
    role: localStorage.getItem('role') || ''
  });
  const [passwordData, setPasswordData] = useState({
    passwordLama: '',
    passwordBaru: '',
    konfirmasiPassword: ''
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.updateProfile({
        nama: profileData.nama
      });
      localStorage.setItem('nama', profileData.nama);
      toast.success('Profil berhasil diperbarui');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.passwordBaru !== passwordData.konfirmasiPassword) {
      toast.error('Password baru dan konfirmasi password tidak cocok');
      return;
    }

    if (passwordData.passwordBaru.length < 6) {
      toast.error('Password baru minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      await authAPI.changePassword({
        passwordLama: passwordData.passwordLama,
        passwordBaru: passwordData.passwordBaru
      });
      toast.success('Password berhasil diubah');
      setPasswordData({
        passwordLama: '',
        passwordBaru: '',
        konfirmasiPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengubah password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Manajemen Akun</h2>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'profile'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Profil Saya
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'password'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Ganti Password
          </button>
        </div>

        <div className="p-8">
          {/* Tab Profil */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Informasi Profil</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    disabled
                    value={profileData.username}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-sm text-gray-500 mt-1">Username tidak dapat diubah</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    disabled
                    value={profileData.role.toUpperCase()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.nama}
                    onChange={(e) => setProfileData({ ...profileData, nama: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* Tab Ganti Password */}
          {activeTab === 'password' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Ganti Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Lama
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.passwordLama}
                    onChange={(e) => setPasswordData({ ...passwordData, passwordLama: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="Masukkan password lama"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.passwordBaru}
                    onChange={(e) => setPasswordData({ ...passwordData, passwordBaru: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="Masukkan password baru (minimal 6 karakter)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.konfirmasiPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, konfirmasiPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="Konfirmasi password baru"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Perhatian:</strong> Setelah mengubah password, Anda akan tetap login dengan sesi saat ini. 
                    Gunakan password baru untuk login berikutnya.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                >
                  {loading ? 'Mengubah Password...' : 'Ubah Password'}
                </motion.button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const DaftarKaryawan = () => {
  const [karyawan, setKaryawan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterKantor, setFilterKantor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedKaryawan, setSelectedKaryawan] = useState(null);
  const [formData, setFormData] = useState({
    kantor: '',
    nama: '',
    jabatan: '',
    departemen: '',
    no_telp: '',
    jatah_cuti: 12,
    sisa_cuti: 12,
    status: 'aktif'
  });

  const daftarKantor = [
    'RBM-IWARE SURABAYA',
    'SBA-WMP',
    'RBM-IWARE JAKARTA',
    'ILUMINDO',
    'RBM - LABEL',
    'ALGOO',
    'RBM - IWARE BALI',
    'RBM-IWARE JOGJA'
  ];

  useEffect(() => {
    fetchKaryawan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKantor]);

  const fetchKaryawan = async () => {
    try {
      const params = filterKantor ? { kantor: filterKantor } : {};
      const response = await karyawanAPI.getAll(params);
      setKaryawan(response.data);
    } catch (error) {
      toast.error('Gagal memuat data karyawan');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, karyawanData = null) => {
    setModalMode(mode);
    if (mode === 'edit' && karyawanData) {
      setSelectedKaryawan(karyawanData);
      setFormData({
        kantor: karyawanData.kantor,
        nama: karyawanData.nama,
        jabatan: karyawanData.jabatan,
        departemen: karyawanData.departemen,
        no_telp: karyawanData.no_telp || '',
        jatah_cuti: karyawanData.jatah_cuti,
        sisa_cuti: karyawanData.sisa_cuti,
        status: karyawanData.status
      });
    } else {
      setFormData({
        kantor: '',
        nama: '',
        jabatan: '',
        departemen: '',
        no_telp: '',
        jatah_cuti: 12,
        sisa_cuti: 12,
        status: 'aktif'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedKaryawan(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi data
    if (!formData.kantor || !formData.nama || !formData.jabatan || !formData.departemen) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    try {
      if (modalMode === 'add') {
        await karyawanAPI.create(formData);
        toast.success('Karyawan berhasil ditambahkan');
      } else {
        await karyawanAPI.update(selectedKaryawan.id, formData);
        toast.success('Data karyawan berhasil diperbarui');
      }
      handleCloseModal();
      fetchKaryawan();
    } catch (error) {
      console.error('Error submit:', error);
      toast.error(error.response?.data?.message || 'Gagal menyimpan data karyawan');
    }
  };

  const handleResetCuti = async (id) => {
    if (!window.confirm('Yakin ingin mereset cuti karyawan ini ke 12 hari?')) return;

    try {
      await karyawanAPI.resetCuti(id, { jatah_cuti: 12 });
      toast.success('Cuti berhasil direset');
      fetchKaryawan();
    } catch (error) {
      toast.error('Gagal mereset cuti');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus karyawan ini?')) return;

    try {
      await karyawanAPI.delete(id);
      toast.success('Karyawan berhasil dihapus');
      fetchKaryawan();
    } catch (error) {
      toast.error('Gagal menghapus karyawan');
    }
  };

  // Filter karyawan berdasarkan kantor dan search
  const filteredKaryawan = karyawan.filter(item => {
    const matchKantor = !filterKantor || item.kantor === filterKantor;
    const matchSearch = !searchTerm || 
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.departemen.toLowerCase().includes(searchTerm.toLowerCase());
    return matchKantor && matchSearch;
  });

  if (loading) return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Daftar Karyawan</h2>
      <SkeletonTable rows={8} />
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Daftar Karyawan</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total: <span className="font-bold text-primary-600">{filteredKaryawan.length}</span> karyawan
            {searchTerm && ` (dari ${karyawan.length} total)`}
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenModal('add')}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            <FiPlus />
            <span className="hidden sm:inline">Tambah</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Filter dan Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, jabatan, atau departemen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <select
          value={filterKantor}
          onChange={(e) => setFilterKantor(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Semua Kantor</option>
          {daftarKantor.map(kantor => (
            <option key={kantor} value={kantor}>{kantor}</option>
          ))}
        </select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Kantor</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Nama</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Jabatan</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Departemen</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Sisa Cuti</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredKaryawan.length > 0 ? (
                  filteredKaryawan.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">{item.kantor}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.nama}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.jabatan}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.departemen}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.sisa_cuti > 5 ? 'bg-green-100 text-green-800' :
                        item.sisa_cuti > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.sisa_cuti}/{item.jatah_cuti} hari
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleOpenModal('edit', item)}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          title="Edit"
                        >
                          <FiEdit size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleResetCuti(item.id)}
                          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                          title="Reset Cuti"
                        >
                          <FiRefreshCw size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          title="Hapus"
                        >
                          <FiTrash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      {searchTerm || filterKantor ? 'Tidak ada karyawan yang sesuai dengan filter' : 'Belum ada data karyawan'}
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal Add/Edit Karyawan */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">
                  {modalMode === 'add' ? 'Tambah Karyawan' : 'Edit Karyawan'}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <FiX size={24} />
                </motion.button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kantor *</label>
                <select
                  required
                  value={formData.kantor}
                  onChange={(e) => setFormData({ ...formData, kantor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">-- Pilih Kantor --</option>
                  {daftarKantor.map(kantor => (
                    <option key={kantor} value={kantor}>{kantor}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama *</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan *</label>
                  <input
                    type="text"
                    required
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departemen *</label>
                  <input
                    type="text"
                    required
                    value={formData.departemen}
                    onChange={(e) => setFormData({ ...formData, departemen: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">No. Telp</label>
                <input
                  type="tel"
                  value={formData.no_telp}
                  onChange={(e) => setFormData({ ...formData, no_telp: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jatah Cuti</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.jatah_cuti}
                    onChange={(e) => setFormData({ ...formData, jatah_cuti: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sisa Cuti</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sisa_cuti}
                    onChange={(e) => setFormData({ ...formData, sisa_cuti: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Non-Aktif</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  {modalMode === 'add' ? 'Tambah' : 'Simpan'}
                </motion.button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Komponen Quota Karyawan - Lihat semua sisa cuti & izin karyawan
const QuotaKaryawan = () => {
  const [karyawanList, setKaryawanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bulan, setBulan] = useState(0);
  const [tahun, setTahun] = useState(0);
  const [filterKantor, setFilterKantor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchKaryawanQuota();
  }, []);

  const fetchKaryawanQuota = async () => {
    setLoading(true);
    try {
      const response = await karyawanAPI.getAllWithQuota();
      setKaryawanList(response.data.karyawan);
      setBulan(response.data.bulan);
      setTahun(response.data.tahun);
    } catch (error) {
      console.error('Error fetching karyawan quota:', error);
      toast.error('Gagal memuat data quota karyawan');
    } finally {
      setLoading(false);
    }
  };

  // Filter karyawan
  const filteredKaryawan = karyawanList.filter(k => {
    const matchKantor = !filterKantor || k.kantor === filterKantor;
    const matchSearch = !searchTerm || 
      k.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.departemen.toLowerCase().includes(searchTerm.toLowerCase());
    return matchKantor && matchSearch;
  });

  // Get unique kantor list
  const kantorList = [...new Set(karyawanList.map(k => k.kantor))];

  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quota Karyawan</h1>
        <p className="text-gray-600">
          Lihat sisa cuti dan izin semua karyawan - Bulan {namaBulan[bulan - 1]} {tahun}
        </p>
      </motion.div>

      {/* Filter & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Kantor
            </label>
            <select
              value={filterKantor}
              onChange={(e) => setFilterKantor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Kantor</option>
              {kantorList.map(kantor => (
                <option key={kantor} value={kantor}>{kantor}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari Karyawan
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama, jabatan, atau departemen..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Menampilkan {filteredKaryawan.length} dari {karyawanList.length} karyawan
          </p>
          <button
            onClick={fetchKaryawanQuota}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FiRefreshCw />
            <span>Refresh</span>
          </button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {loading ? (
          <SkeletonTable rows={10} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Kantor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nama</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Jabatan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Departemen</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Sisa Cuti</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Pulang Cepat</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Datang Terlambat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredKaryawan.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      Tidak ada data karyawan
                    </td>
                  </tr>
                ) : (
                  filteredKaryawan.map((karyawan, index) => (
                    <tr key={karyawan.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{karyawan.kantor}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{karyawan.nama}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{karyawan.jabatan}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{karyawan.departemen}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          karyawan.sisa_cuti > 5 
                            ? 'bg-green-100 text-green-800' 
                            : karyawan.sisa_cuti > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {karyawan.sisa_cuti} hari
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          karyawan.pulang_cepat < 3 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {karyawan.pulang_cepat}/3x
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          karyawan.datang_terlambat < 3 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {karyawan.datang_terlambat}/3x
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Keterangan:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-700 mb-2">Sisa Cuti:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• <span className="text-green-600 font-semibold">&gt; 5 hari</span> - Aman</li>
              <li>• <span className="text-yellow-600 font-semibold">1-5 hari</span> - Perhatian</li>
              <li>• <span className="text-red-600 font-semibold">0 hari</span> - Habis</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-2">Pulang Cepat:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• Maksimal <span className="font-semibold">3x per bulan</span></li>
              <li>• <span className="text-green-600 font-semibold">&lt; 3x</span> - Masih bisa</li>
              <li>• <span className="text-red-600 font-semibold">3x</span> - Quota habis</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-2">Datang Terlambat:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• Maksimal <span className="font-semibold">3x per bulan</span></li>
              <li>• <span className="text-green-600 font-semibold">&lt; 3x</span> - Masih bisa</li>
              <li>• <span className="text-red-600 font-semibold">3x</span> - Quota habis</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HRDDashboard;
