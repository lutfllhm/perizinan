import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { authAPI, pengajuanAPI } from '../utils/api';
import { 
  FiHome, FiUsers, FiUserPlus, FiLogOut, FiMenu, FiX, FiTrash2, FiSettings,
  FiFileText, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiUser
} from 'react-icons/fi';
import { useIsMobile } from '../hooks/useMediaQuery';
import BottomNavigation from '../components/BottomNavigation';
import MobileCard, { MobileCardRow, MobileCardBadge, MobileCardActions } from '../components/MobileCard';
import TouchButton from '../components/TouchButton';

const AdminDashboard = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const navigate = useNavigate();
  const nama = localStorage.getItem('nama');

  // Auto-hide sidebar on mobile
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logout berhasil');
    navigate('/');
  };

  const bottomNavItems = [
    { path: '/admin', icon: FiHome, label: 'Home', exact: true },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/register-hrd', icon: FiUserPlus, label: 'Tambah' },
    { path: '/admin/profile', icon: FiSettings, label: 'Profil' },
  ];

  const Sidebar = () => {
    const location = window.location.pathname;
    
    const menuItems = [
      { path: '/admin', icon: FiHome, label: 'Dashboard', exact: true },
      { path: '/admin/users', icon: FiUsers, label: 'Kelola User' },
      { path: '/admin/register-hrd', icon: FiUserPlus, label: 'Tambah HRD' },
      { path: '/admin/profile', icon: FiSettings, label: 'Manajemen Akun' },
    ];

    const isActive = (path, exact = false) => {
      if (exact) return location === path;
      return location.startsWith(path);
    };

    // Don't render sidebar on mobile, use drawer instead
    if (isMobile && !sidebarOpen) return null;

    return (
      <>
        {/* Backdrop for mobile */}
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30"
          />
        )}

        {/* Sidebar */}
        <motion.div
          initial={{ x: isMobile ? -300 : 0 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className={`${
            isMobile ? 'w-72' : sidebarOpen ? 'w-72' : 'w-20'
          } bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen fixed left-0 top-0 transition-all duration-300 z-40 shadow-2xl`}
        >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700">
            {(sidebarOpen || !isMobile) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3"
              >
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-xl">
                  <FiUsers className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Admin Panel</h2>
                  <p className="text-xs text-gray-400">Sistem Perizinan</p>
                </div>
              </motion.div>
            )}
            {!isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            )}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors ml-auto"
              >
                <FiX size={24} />
              </button>
            )}
          </div>

          {/* User Info */}
          {(sidebarOpen || !isMobile) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl border border-purple-500/30"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-full">
                  <FiUser className="text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{nama}</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              
              return (
                <Link key={item.path} to={item.path} onClick={() => isMobile && setSidebarOpen(false)}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/50'
                        : 'hover:bg-gray-800 hover:translate-x-1'
                    }`}
                  >
                    <Icon size={20} className={active ? 'text-white' : 'text-gray-400'} />
                    {(sidebarOpen || !isMobile) && (
                      <span className={`font-medium ${active ? 'text-white' : 'text-gray-300'}`}>
                        {item.label}
                      </span>
                    )}
                    {active && (sidebarOpen || !isMobile) && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}

            {/* Divider */}
            <div className="py-2">
              <div className="border-t border-gray-700"></div>
            </div>

            {/* Logout Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-600 hover:translate-x-1 transition-all duration-200 group"
            >
              <FiLogOut size={20} className="text-gray-400 group-hover:text-white" />
              {(sidebarOpen || !isMobile) && <span className="font-medium text-gray-300 group-hover:text-white">Logout</span>}
            </motion.button>
          </nav>

          {/* Footer */}
          {(sidebarOpen || !isMobile) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-4 left-4 right-4"
            >
              <div className="p-3 bg-gray-800/50 rounded-xl border border-gray-700">
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
      </>
    );
  };

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Sidebar />
      <div className={`flex-1 ${!isMobile && sidebarOpen ? 'ml-72' : !isMobile ? 'ml-20' : 'ml-0'} transition-all duration-300 ${isMobile ? 'pb-20' : ''}`}>
        <div className="p-4 md:p-8">
          {/* Mobile Header */}
          {isMobile && (
            <div className="flex items-center justify-between mb-4 bg-white rounded-xl p-4 shadow-md">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiMenu size={24} />
              </button>
              <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
              >
                <FiLogOut size={24} />
              </button>
            </div>
          )}

          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/register-hrd" element={<RegisterHRD />} />
            <Route path="/profile" element={<ManajemenAkun />} />
          </Routes>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      {isMobile && <BottomNavigation items={bottomNavItems} />}
    </div>
  );
};

const AdminHome = () => {
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
      toast.error('Gagal memuat statistik');
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
        className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Dashboard Admin</h2>
            <p className="text-blue-100">Kelola dan monitor seluruh aktivitas sistem</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
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
            <FiUsers className="text-primary-600" />
          </span>
          Aksi Cepat
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/users">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer"
            >
              <FiUsers className="text-2xl text-primary-600 mb-2" />
              <h4 className="font-semibold text-gray-800">Kelola User</h4>
              <p className="text-sm text-gray-600">Lihat dan kelola semua user</p>
            </motion.div>
          </Link>
          <Link to="/admin/register-hrd">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer"
            >
              <FiUserPlus className="text-2xl text-green-600 mb-2" />
              <h4 className="font-semibold text-gray-800">Tambah HRD</h4>
              <p className="text-sm text-gray-600">Daftarkan HRD baru</p>
            </motion.div>
          </Link>
          <Link to="/admin/profile">
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

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-100"
        >
          <div className="flex items-start">
            <div className="bg-blue-500 p-3 rounded-xl mr-4">
              <FiAlertCircle className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Informasi Sistem</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Sistem Perizinan Cuti/Lembur IWARE
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Kelola user HRD dan monitor aktivitas
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Akses penuh ke semua fitur administrasi
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-purple-100"
        >
          <div className="flex items-start">
            <div className="bg-purple-500 p-3 rounded-xl mr-4">
              <FiCheckCircle className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Status Sistem</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Server Status</span>
                  <span className="flex items-center text-green-600 font-semibold">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Database</span>
                  <span className="flex items-center text-green-600 font-semibold">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Last Update</span>
                  <span className="text-gray-600 font-semibold">
                    {new Date().toLocaleTimeString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const isMobile = useIsMobile();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getUsers();
      setUsers(response.data.users || response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.response?.data?.message || 'Gagal memuat data user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus user ini?')) return;

    try {
      await authAPI.deleteUser(id);
      toast.success('User berhasil dihapus');
      fetchUsers();
    } catch (error) {
      toast.error('Gagal menghapus user');
    }
  };

  if (loading) return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Memuat data...</p>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Kelola User</h2>
        <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
          {users.length} user
        </span>
      </div>

      {/* Desktop Table View */}
      {!isMobile && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dibuat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                          >
                            <FiTrash2 />
                            <span>Hapus</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Tidak ada data user
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile Card View */}
      {isMobile && (
        <div className="space-y-3">
          {users && users.length > 0 ? (
            users.map((user) => (
              <MobileCard key={user.id}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{user.nama}</h3>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                  </div>
                  <MobileCardBadge variant={user.role === 'admin' ? 'info' : 'default'}>
                    {user.role}
                  </MobileCardBadge>
                </div>

                <MobileCardRow 
                  label="ID" 
                  value={`#${user.id}`} 
                />
                <MobileCardRow 
                  label="Dibuat" 
                  value={new Date(user.created_at).toLocaleDateString('id-ID')} 
                />

                {user.role !== 'admin' && (
                  <MobileCardActions>
                    <TouchButton
                      variant="danger"
                      size="sm"
                      fullWidth
                      icon={FiTrash2}
                      onClick={() => handleDelete(user.id)}
                    >
                      Hapus User
                    </TouchButton>
                  </MobileCardActions>
                )}
              </MobileCard>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Tidak ada data user</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RegisterHRD = () => {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nama: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.registerHRD(formData);
      toast.success('HRD berhasil didaftarkan');
      setFormData({ username: '', password: '', nama: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mendaftarkan HRD');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">Tambah HRD Baru</h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-base"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-base"
              placeholder="Masukkan password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full px-4 py-3 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-base"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          {isMobile ? (
            <TouchButton
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
              icon={FiUserPlus}
            >
              {loading ? 'Memproses...' : 'Daftarkan HRD'}
            </TouchButton>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Daftarkan HRD'}
            </motion.button>
          )}
        </form>
      </motion.div>
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

export default AdminDashboard;
