import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { authAPI, pengajuanAPI } from '../utils/api';
import { 
  FiHome, FiUsers, FiUserPlus, FiLogOut, FiMenu, FiX, FiTrash2, FiSettings,
  FiFileText, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiUser
} from 'react-icons/fi';
import { 
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useIsMobile } from '../hooks/useMediaQuery';
import MobileCard, { MobileCardRow, MobileCardBadge, MobileCardActions } from '../components/MobileCard';
import TouchButton from '../components/TouchButton';
import PhotoBackground from '../components/layout/PhotoBackground';
import DashboardShell from '../components/layout/DashboardShell';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const nama = localStorage.getItem('nama') || sessionStorage.getItem('nama');
  const username = localStorage.getItem('username') || sessionStorage.getItem('username');
  const role = (localStorage.getItem('role') || sessionStorage.getItem('role') || '').trim().toLowerCase();
  const isSuperadmin = role === 'superadmin';
  const [pendingCount, setPendingCount] = useState(0);
  const prevPendingRef = useRef(null);
  const pollRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success('Logout berhasil');
    navigate('/');
  };

  useEffect(() => {
    let mounted = true;

    const tick = async (silent = false) => {
      try {
        const res = await pengajuanAPI.getStats();
        const pending = Number(res?.data?.pending || 0);
        if (!mounted) return;

        setPendingCount(pending);

        const prev = prevPendingRef.current;
        if (prev === null) {
          prevPendingRef.current = pending;
          return;
        }

        if (!silent && pending > prev) {
          const diff = pending - prev;
          toast.info(`${diff} pengajuan baru masuk.`, { autoClose: 2500 });
        }

        prevPendingRef.current = pending;
      } catch (e) {
        // ignore polling errors
      }
    };

    tick(true);
    pollRef.current = window.setInterval(() => {
      if (document.hidden) return;
      tick(false);
    }, 25000);

    return () => {
      mounted = false;
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, []);

  return (
    <PhotoBackground>
      <DashboardShell
        logoSrc="/img/logo.png"
        brandTitle="IWARE"
        brandSubtitle={isSuperadmin ? 'Superadmin Console' : 'Admin Panel'}
        accent={isSuperadmin ? 'fuchsia' : 'violet'}
        roleLabel={isSuperadmin ? 'Superadmin' : 'Admin/Pengelola'}
        user={{ name: nama, username }}
        onLogout={handleLogout}
        searchPlaceholder="Cari di dashboard…"
        onSearchChange={() => {}}
        notificationCount={pendingCount}
        onNotificationsClick={() => toast.info('Buka HRD Panel untuk melihat daftar pengajuan.', { autoClose: 2500 })}
        navItems={[
          { path: '/admin', icon: FiHome, label: 'Dashboard', exact: true },
          ...(isSuperadmin ? [{ path: '/admin/users', icon: FiUsers, label: 'Kelola User' }] : []),
          ...(isSuperadmin ? [{ path: '/admin/register-hrd', icon: FiUserPlus, label: 'Tambah HRD' }] : []),
          { path: '/admin/profile', icon: FiSettings, label: 'Manajemen Akun' },
        ]}
        bottomNavItems={[
          { path: '/admin', icon: FiHome, label: 'Home', exact: true },
          ...(isSuperadmin ? [{ path: '/admin/users', icon: FiUsers, label: 'Users' }] : []),
          ...(isSuperadmin ? [{ path: '/admin/register-hrd', icon: FiUserPlus, label: 'Tambah' }] : []),
          { path: '/admin/profile', icon: FiSettings, label: 'Profil' },
        ]}
      >
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route
              path="/users"
              element={isSuperadmin ? <UserManagement /> : <Navigate to="/admin" replace />}
            />
            <Route
              path="/register-hrd"
              element={isSuperadmin ? <RegisterHRD /> : <Navigate to="/admin" replace />}
            />
            <Route path="/profile" element={<ManajemenAkun />} />
          </Routes>
      </DashboardShell>
    </PhotoBackground>
  );
};

const AdminHome = () => {
  const isMobile = useIsMobile();
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

  const statCards = useMemo(
    () => [
      { label: 'Total Pengajuan', value: stats?.total || 0, icon: FiFileText, tint: 'from-indigo-500/25 to-violet-500/10' },
      { label: 'Pending', value: stats?.pending || 0, icon: FiClock, tint: 'from-amber-500/25 to-orange-500/10' },
      { label: 'Approved', value: stats?.approved || 0, icon: FiCheckCircle, tint: 'from-emerald-500/25 to-teal-500/10' },
      { label: 'Rejected', value: stats?.rejected || 0, icon: FiXCircle, tint: 'from-rose-500/25 to-red-500/10' },
    ],
    [stats]
  );

  return (
    <div className="space-y-8">
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-400"></div>
        </div>
      )}
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-6 md:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-white">Dashboard Admin</h2>
            <p className="text-slate-300">Kelola dan monitor seluruh aktivitas sistem</p>
          </div>
          <div className="hidden md:block">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs text-slate-400">Tanggal</p>
              <p className="text-sm font-semibold text-white">{new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + i * 0.04, duration: 0.35 }}
              whileHover={isMobile ? {} : { y: -4 }}
            >
              <Card className="p-5">
                <div className={`rounded-2xl border border-white/10 bg-gradient-to-br ${c.tint} p-3 flex items-center justify-between`}>
                  <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="text-white" />
                  </div>
                  <div className="text-xs text-slate-300">Overview</div>
                </div>
                <div className="mt-4 text-xs text-slate-400">{c.label}</div>
                <div className="mt-2 text-3xl font-semibold text-white">{c.value}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
              <FiUsers className="text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Quick actions</div>
              <div className="text-xs text-slate-400">Navigate faster</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { to: '/admin/users', icon: FiUsers, title: 'Kelola User', desc: 'Lihat dan kelola semua user' },
              { to: '/admin/register-hrd', icon: FiUserPlus, title: 'Tambah HRD', desc: 'Daftarkan HRD baru' },
              { to: '/admin/profile', icon: FiSettings, title: 'Pengaturan', desc: 'Kelola akun Anda' },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <Link key={a.to} to={a.to}>
                  <div className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] transition p-4">
                    <Icon className="text-white/90" />
                    <div className="mt-3 text-sm font-semibold text-white">{a.title}</div>
                    <div className="mt-1 text-xs text-slate-400">{a.desc}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <Card className="p-6">
            <div className="text-sm font-semibold text-white mb-4">Pengajuan per Bulan</div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.byMonth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="bulan" stroke="rgba(148,163,184,0.7)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="rgba(148,163,184,0.7)" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'rgba(2,6,23,0.9)', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <Legend />
                  <Bar dataKey="jumlah" fill="#8b5cf6" name="Jumlah" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
        >
          <Card className="p-6">
            <div className="text-sm font-semibold text-white mb-4">Jenis Perizinan</div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.byType || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="jenis_perizinan" stroke="rgba(148,163,184,0.7)" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={70} />
                  <YAxis stroke="rgba(148,163,184,0.7)" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'rgba(2,6,23,0.9)', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <Legend />
                  <Bar dataKey="jumlah" fill="#22c55e" name="Jumlah" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
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
      <p className="mt-4 text-slate-300">Memuat data...</p>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-white">Kelola User</h2>
        <span className="text-sm text-slate-200 bg-white/10 px-3 py-1 rounded-full border border-white/15">
          {users.length} user
        </span>
      </div>

      {/* Desktop Table View */}
      {!isMobile && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-950/40 border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Dibuat</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-200">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-200">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-200">{user.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          user.role === 'admin'
                            ? 'bg-violet-500/15 text-violet-200 border-violet-400/20'
                            : user.role === 'superadmin'
                            ? 'bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/20'
                            : 'bg-sky-500/15 text-sky-200 border-sky-400/20'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-rose-500/15 text-rose-200 border border-rose-400/20 rounded-lg hover:bg-rose-500/20 text-sm transition-colors"
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
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                      Tidak ada data user
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Mobile Card View */}
      {isMobile && (
        <div className="space-y-3">
          {users && users.length > 0 ? (
            users.map((user) => (
              <MobileCard key={user.id}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg">{user.nama}</h3>
                    <p className="text-sm text-slate-300">@{user.username}</p>
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
            <div className="text-center py-12 text-slate-400">
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Tambah HRD Baru</h2>
          <p className="text-sm text-slate-300 mt-1">Buat akun HRD untuk memproses pengajuan dan mengelola data karyawan.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Username
            </label>
            <Input
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Masukkan username"
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Password
            </label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Masukkan password"
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Nama Lengkap
            </label>
            <Input
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Masukkan nama lengkap"
              className="w-full"
              required
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
              className="w-full py-3 rounded-xl font-semibold transition disabled:opacity-50 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 hover:brightness-110 shadow-[0_20px_50px_rgba(99,102,241,0.22)]"
            >
              {loading ? 'Memproses...' : 'Daftarkan HRD'}
            </motion.button>
          )}
          </form>
        </Card>
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
      <h2 className="text-2xl font-bold text-white">Manajemen Akun</h2>

      {/* Tab Navigation */}
      <Card className="overflow-hidden">
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'profile'
                ? 'bg-violet-600 text-white'
                : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
            }`}
          >
            Profil Saya
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'password'
                ? 'bg-violet-600 text-white'
                : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
            }`}
          >
            Ganti Password
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Tab Profil */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6">Informasi Profil</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    disabled
                    value={profileData.username}
                    className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/[0.06] text-slate-300 cursor-not-allowed"
                  />
                  <p className="text-sm text-slate-400 mt-1">Username tidak dapat diubah</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    disabled
                    value={profileData.role.toUpperCase()}
                    className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/[0.06] text-slate-300 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.nama}
                    onChange={(e) => setProfileData({ ...profileData, nama: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/15 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400/40 transition outline-none"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition disabled:opacity-50"
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
              <h3 className="text-xl font-bold text-white mb-6">Ganti Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Password Lama
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.passwordLama}
                    onChange={(e) => setPasswordData({ ...passwordData, passwordLama: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/15 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400/40 transition outline-none"
                    placeholder="Masukkan password lama"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.passwordBaru}
                    onChange={(e) => setPasswordData({ ...passwordData, passwordBaru: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/15 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400/40 transition outline-none"
                    placeholder="Masukkan password baru (minimal 6 karakter)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.konfirmasiPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, konfirmasiPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/15 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400/40 transition outline-none"
                    placeholder="Konfirmasi password baru"
                  />
                </div>

                <div className="bg-amber-500/10 border border-amber-400/20 rounded-lg p-4">
                  <p className="text-sm text-amber-100">
                    <strong>Perhatian:</strong> Setelah mengubah password, Anda akan tetap login dengan sesi saat ini. 
                    Gunakan password baru untuk login berikutnya.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition disabled:opacity-50"
                >
                  {loading ? 'Mengubah Password...' : 'Ubah Password'}
                </motion.button>
              </form>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
