import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import PhotoBackground from '../components/layout/PhotoBackground';
import DashboardShell from '../components/layout/DashboardShell';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const HRDDashboard = () => {
  const navigate = useNavigate();
  const nama = localStorage.getItem('nama') || sessionStorage.getItem('nama');
  const username = localStorage.getItem('username') || sessionStorage.getItem('username');
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

    // initial fetch (silent, no toast)
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
        brandSubtitle="HRD Panel"
        accent="cyan"
        roleLabel="HRD"
        user={{ name: nama, username }}
        onLogout={handleLogout}
        searchPlaceholder="Cari di dashboard…"
        onSearchChange={() => {}}
        notificationCount={pendingCount}
        onNotificationsClick={() => navigate('/hrd/pengajuan')}
        navItems={[
          { path: '/hrd', icon: FiHome, label: 'Dashboard', exact: true },
          { path: '/hrd/pengajuan', icon: FiFileText, label: 'Daftar Pengajuan' },
          { path: '/hrd/karyawan', icon: FiUser, label: 'Daftar Karyawan' },
          { path: '/hrd/quota', icon: FiClock, label: 'Quota Karyawan' },
          { path: '/hrd/report', icon: FiBarChart2, label: 'Report' },
          { path: '/hrd/profile', icon: FiSettings, label: 'Manajemen Akun' },
        ]}
        bottomNavItems={[
          { path: '/hrd', icon: FiHome, label: 'Home', exact: true },
          { path: '/hrd/pengajuan', icon: FiFileText, label: 'Pengajuan' },
          { path: '/hrd/karyawan', icon: FiUser, label: 'Karyawan' },
          { path: '/hrd/profile', icon: FiSettings, label: 'Profil' },
        ]}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pengajuan" element={<DaftarPengajuan />} />
          <Route path="/karyawan" element={<DaftarKaryawan />} />
          <Route path="/quota" element={<QuotaKaryawan />} />
          <Route path="/report" element={<Report />} />
          <Route path="/profile" element={<ManajemenAkun />} />
        </Routes>
      </DashboardShell>
    </PhotoBackground>
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

  const statCards = useMemo(
    () => [
      { label: 'Total Pengajuan', value: stats?.total || 0, icon: FiFileText, tint: 'from-sky-500/25 to-cyan-500/10' },
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
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
            <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-white">Dashboard HRD</h2>
            <p className="text-slate-300">Kelola dan monitor pengajuan perizinan</p>
          </div>
          <div className="hidden md:block">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs text-slate-400">Tanggal</p>
              <p className="text-sm font-semibold text-white">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + i * 0.04, duration: 0.35 }}
            >
              <Card className="p-5">
                <div className={`rounded-2xl border border-white/10 bg-gradient-to-br ${c.tint} p-3 flex items-center justify-between`}>
                  <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="text-white" />
                  </div>
                  <div className="text-xs text-slate-200">Overview</div>
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
              <FiFileText className="text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Aksi cepat</div>
              <div className="text-xs text-slate-400">Akses menu utama dengan sekali klik</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link to="/hrd/pengajuan">
              <div className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] transition p-4">
                <FiFileText className="text-white/90" />
                <div className="mt-3 text-sm font-semibold text-white">Daftar Pengajuan</div>
                <div className="mt-1 text-xs text-slate-400">Lihat semua pengajuan</div>
              </div>
            </Link>
            <Link to="/hrd/report">
              <div className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] transition p-4">
                <FiBarChart2 className="text-white/90" />
                <div className="mt-3 text-sm font-semibold text-white">Report</div>
                <div className="mt-1 text-xs text-slate-400">Laporan lengkap</div>
              </div>
            </Link>
            <Link to="/hrd/profile">
              <div className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] transition p-4">
                <FiSettings className="text-white/90" />
                <div className="mt-3 text-sm font-semibold text-white">Pengaturan</div>
                <div className="mt-1 text-xs text-slate-400">Kelola akun Anda</div>
              </div>
            </Link>
          </div>
        </Card>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
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
                  <Bar dataKey="jumlah" fill="#0ea5e9" name="Jumlah Pengajuan" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
          <Card className="p-6">
            <div className="text-sm font-semibold text-white mb-4">Jenis Perizinan</div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.byType || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis
                    dataKey="jenis_perizinan"
                    stroke="rgba(148,163,184,0.7)"
                    tick={{ fontSize: 10 }}
                    angle={-30}
                    textAnchor="end"
                    height={70}
                  />
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
      message = `╔═══════════════════════════╗
║  PENGAJUAN DISETUJUI  ║
╚═══════════════════════════╝

Kepada Yth.
*${item.nama}*

Dengan hormat,
Kami informasikan bahwa pengajuan perizinan Anda telah *DISETUJUI* oleh HRD.

┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  DETAIL PENGAJUAN
┣━━━━━━━━━━━━━━━━━━━━━━━┫
┃ Jenis: *${item.jenis_perizinan.toUpperCase()}*
┃ Tanggal Mulai: ${new Date(item.tanggal_mulai).toLocaleDateString('id-ID', { dateStyle: 'long' })}
┃ Tanggal Selesai: ${new Date(item.tanggal_selesai).toLocaleDateString('id-ID', { dateStyle: 'long' })}
┃ Status: *DISETUJUI*
┗━━━━━━━━━━━━━━━━━━━━━━━┛
${quotaText}${item.catatan ? `\n*Catatan HRD:*\n${item.catatan}\n` : ''}
Terima kasih atas perhatian dan kerjasamanya.

Hormat kami,
*HRD IWARE*

━━━━━━━━━━━━━━━━━━━━━
_Sistem Perizinan IWARE_`;
    } else if (item.status === 'rejected') {
      message = `╔═══════════════════════════╗
║  PENGAJUAN DITOLAK  ║
╚═══════════════════════════╝

Kepada Yth.
*${item.nama}*

Dengan hormat,
Kami informasikan bahwa pengajuan perizinan Anda *TIDAK DAPAT DISETUJUI*.

┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  DETAIL PENGAJUAN
┣━━━━━━━━━━━━━━━━━━━━━━━┫
┃ Jenis: *${item.jenis_perizinan.toUpperCase()}*
┃ Tanggal Mulai: ${new Date(item.tanggal_mulai).toLocaleDateString('id-ID', { dateStyle: 'long' })}
┃ Tanggal Selesai: ${new Date(item.tanggal_selesai).toLocaleDateString('id-ID', { dateStyle: 'long' })}
┃ Status: *DITOLAK*
┗━━━━━━━━━━━━━━━━━━━━━━━┛
${quotaText}${item.catatan ? `\n*Alasan Penolakan:*\n${item.catatan}\n` : ''}
Anda dapat mengajukan kembali dengan melengkapi persyaratan yang diperlukan.

Terima kasih atas pengertiannya.

Hormat kami,
*HRD IWARE*

━━━━━━━━━━━━━━━━━━━━━
_Sistem Perizinan IWARE_`;
    } else {
      message = `╔═══════════════════════════╗
║  NOTIFIKASI PERIZINAN  ║
╚═══════════════════════════╝

Kepada Yth.
*${item.nama}*

Dengan hormat,
Status pengajuan perizinan Anda telah diperbarui.

┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  DETAIL PENGAJUAN
┣━━━━━━━━━━━━━━━━━━━━━━━┫
┃ Jenis: *${item.jenis_perizinan.toUpperCase()}*
┃ Tanggal Mulai: ${new Date(item.tanggal_mulai).toLocaleDateString('id-ID', { dateStyle: 'long' })}
┃ Tanggal Selesai: ${new Date(item.tanggal_selesai).toLocaleDateString('id-ID', { dateStyle: 'long' })}
┃ Status: *${item.status.toUpperCase()}*
┗━━━━━━━━━━━━━━━━━━━━━━━┛
${quotaText}${item.catatan ? `\n*Catatan:*\n${item.catatan}\n` : ''}
Silakan cek aplikasi untuk informasi lebih lanjut.

Terima kasih.

Hormat kami,
*HRD IWARE*

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
      <h2 className="text-2xl font-bold text-white">Daftar Pengajuan</h2>
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
        <h2 className="text-2xl font-bold text-white">Daftar Pengajuan</h2>
        <div className="text-sm text-slate-300">
          Total: <span className="font-bold text-cyan-400">{pengajuan.length}</span> pengajuan
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-xs sm:text-sm">
            <thead className="bg-slate-950/70 backdrop-blur border-b border-white/10 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-300 uppercase tracking-wider w-[22%]">Nama</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-300 uppercase tracking-wider w-[16%]">No. Telp</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-300 uppercase tracking-wider w-[20%]">Jenis</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-300 uppercase tracking-wider w-[14%]">Tanggal</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-300 uppercase tracking-wider w-[14%]">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-300 uppercase tracking-wider w-[14%]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <AnimatePresence>
                {pengajuan.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/[0.05] transition-colors duration-200 odd:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3 align-top font-semibold text-slate-100 whitespace-normal break-words">
                      {item.nama}
                    </td>
                    <td className="px-4 py-3 align-top text-slate-300 whitespace-nowrap">
                      {item.no_telp}
                    </td>
                    <td className="px-4 py-3 align-top whitespace-normal break-words">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 bg-sky-500/15 text-sky-200 border border-sky-400/20 rounded-full text-xs font-semibold"
                      >
                        {item.jenis_perizinan}
                      </motion.span>
                    </td>
                    <td className="px-4 py-3 align-top whitespace-nowrap text-slate-300">
                      {new Date(item.tanggal_mulai).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-4 py-3 align-top whitespace-nowrap">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          item.status === 'approved'
                            ? 'bg-emerald-500/15 text-emerald-200 border-emerald-400/20'
                            : item.status === 'rejected'
                            ? 'bg-rose-500/15 text-rose-200 border-rose-400/20'
                            : 'bg-amber-500/15 text-amber-200 border-amber-400/20'
                        }`}
                      >
                        {item.status}
                      </motion.span>
                    </td>
                    <td className="px-4 py-3 align-top whitespace-nowrap">
                      <div className="flex flex-wrap gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleShowDetail(item)}
                          className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-white"
                          title="Lihat Detail"
                        >
                          <FiEye size={16} />
                        </motion.button>
                        {item.status === 'pending' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleUpdateStatus(item.id, 'approved')}
                              className="p-2 rounded-lg border border-emerald-400/20 bg-emerald-500/15 hover:bg-emerald-500/20 transition text-emerald-100"
                              title="Setujui"
                            >
                              <FiCheckCircle size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleUpdateStatus(item.id, 'rejected')}
                              className="p-2 rounded-lg border border-rose-400/20 bg-rose-500/15 hover:bg-rose-500/20 transition text-rose-100"
                              title="Tolak"
                            >
                              <FiXCircle size={16} />
                            </motion.button>
                          </>
                        )}
                        {(item.status === 'approved' || item.status === 'rejected') && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSendWhatsApp(item)}
                            className="p-2 rounded-lg border border-emerald-400/20 bg-emerald-500/15 hover:bg-emerald-500/20 transition text-emerald-100"
                            title="Kirim Notifikasi WhatsApp"
                          >
                            <FiSend size={16} />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-white"
                          title="Hapus"
                        >
                          <FiTrash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        </Card>
      </motion.div>

      {/* Modal Detail Pengajuan */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/10 bg-slate-950/80 backdrop-blur-2xl"
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
                  className="bg-white/[0.06] p-4 rounded-xl border border-white/10"
                >
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Status</label>
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
                  className="bg-white/[0.06] p-4 rounded-xl border border-white/10"
                >
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Jenis Perizinan</label>
                  <p className="text-lg font-bold text-white mt-2 capitalize">{selectedItem.jenis_perizinan}</p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="bg-white/[0.06] p-4 rounded-xl border border-white/10">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Nama Lengkap</label>
                  <p className="text-lg font-semibold text-white mt-1">{selectedItem.nama}</p>
                </div>

                <div className="bg-white/[0.06] p-4 rounded-xl border border-white/10">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">No. Telepon/WhatsApp</label>
                  <p className="text-lg font-semibold text-white mt-1">{selectedItem.no_telp}</p>
                </div>

                {/* Info Quota Karyawan */}
                {quotaInfo && !loadingQuota && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white/[0.06] p-4 rounded-xl border border-white/10"
                  >
                    <label className="text-xs font-semibold text-cyan-200 uppercase tracking-wide mb-3 block">
                      📊 Info Quota Karyawan
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <p className="text-xs text-slate-300 mb-1">Sisa Cuti</p>
                        <p className={`text-2xl font-bold ${
                          quotaInfo.sisa_cuti > 5 ? 'text-green-600' : 
                          quotaInfo.sisa_cuti > 0 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {quotaInfo.sisa_cuti} hari
                        </p>
                        <p className="text-xs text-slate-400 mt-1">dari {quotaInfo.jatah_cuti} hari</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <p className="text-xs text-slate-300 mb-1">Pulang Cepat</p>
                        <p className={`text-2xl font-bold ${
                          quotaInfo.pulang_cepat < 3 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {quotaInfo.pulang_cepat}/3x
                        </p>
                        <p className="text-xs text-slate-400 mt-1">bulan ini</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <p className="text-xs text-slate-300 mb-1">Datang Terlambat</p>
                        <p className={`text-2xl font-bold ${
                          quotaInfo.datang_terlambat < 3 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {quotaInfo.datang_terlambat}/3x
                        </p>
                        <p className="text-xs text-slate-400 mt-1">bulan ini</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {loadingQuota && (
                  <div className="bg-white/[0.06] p-4 rounded-xl text-center border border-white/10">
                    <p className="text-sm text-slate-300">Memuat info quota...</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-400/20">
                    <label className="text-xs font-semibold text-emerald-200 uppercase tracking-wide">Tanggal & Jam Mulai</label>
                    <p className="text-sm font-semibold text-white mt-1">
                      {new Date(selectedItem.tanggal_mulai).toLocaleString('id-ID', {
                        dateStyle: 'full',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                  <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-400/20">
                    <label className="text-xs font-semibold text-rose-200 uppercase tracking-wide">Tanggal & Jam Selesai</label>
                    <p className="text-sm font-semibold text-white mt-1">
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
                    <label className="text-sm font-semibold text-slate-200 mb-3 block">Bukti Foto</label>
                    <div className="relative rounded-xl overflow-hidden border-4 border-gray-200 hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-2xl">
                      <LazyImage
                        src={`${API_URL}/uploads/${selectedItem.bukti_foto}`}
                        alt="Bukti Foto"
                        className="w-full h-80"
                        thumbnail={true}
                        onClick={() => handleShowImage(`${API_URL}/uploads/${selectedItem.bukti_foto}`, 'Bukti Foto')}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-center italic">Klik gambar untuk memperbesar dan zoom</p>
                  </motion.div>
                )}

                {selectedItem.catatan && (
                  <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-400/20">
                    <label className="text-xs font-semibold text-amber-200 uppercase tracking-wide">Catatan</label>
                    <p className="text-white mt-1">{selectedItem.catatan}</p>
                  </div>
                )}

                <div className="bg-white/[0.06] p-4 rounded-xl border border-white/10">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Tanggal Pengajuan</label>
                  <p className="text-sm text-slate-200 mt-1">
                    {new Date(selectedItem.created_at).toLocaleString('id-ID', {
                      dateStyle: 'full',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
              </motion.div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
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
                    <span>Kirim Notifikasi</span>
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDetailModal(false)}
                  className={`${selectedItem.status === 'pending' ? 'w-full' : 'flex-1'} px-6 py-3 rounded-xl font-semibold transition-all border border-white/15 bg-white/10 text-white hover:bg-white/15`}
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
      <h2 className="text-2xl font-bold text-white">Report Pengajuan</h2>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Bulan</label>
            <select
              value={filters.bulan}
              onChange={(e) => setFilters({ ...filters, bulan: e.target.value })}
              className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400/40"
            >
              <option value="">Semua Bulan</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Tahun</label>
            <Input
              type="number"
              value={filters.tahun}
              onChange={(e) => setFilters({ ...filters, tahun: e.target.value })}
              className="w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-950/40 border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Jenis</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {report.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.04] transition-colors">
                  <td className="px-6 py-4 text-slate-200">{item.nama}</td>
                  <td className="px-6 py-4 text-slate-200">{item.jenis_perizinan}</td>
                  <td className="px-6 py-4 text-slate-300">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      item.status === 'approved' ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/20' :
                      item.status === 'rejected' ? 'bg-rose-500/15 text-rose-200 border border-rose-400/20' :
                      'bg-amber-500/15 text-amber-200 border border-amber-400/20'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
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
                ? 'bg-cyan-500/20 text-white'
                : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
            }`}
          >
            Profil Saya
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'password'
                ? 'bg-cyan-500/20 text-white'
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
                  <Input
                    type="text"
                    disabled
                    value={profileData.username}
                    className="w-full opacity-80"
                  />
                  <p className="text-sm text-slate-400 mt-1">Username tidak dapat diubah</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Role
                  </label>
                  <Input
                    type="text"
                    disabled
                    value={profileData.role.toUpperCase()}
                    className="w-full opacity-80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Nama Lengkap
                  </label>
                  <Input
                    required
                    value={profileData.nama}
                    onChange={(e) => setProfileData({ ...profileData, nama: e.target.value })}
                    placeholder="Masukkan nama lengkap"
                    className="w-full"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold transition disabled:opacity-50 bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 hover:brightness-110 shadow-[0_20px_50px_rgba(34,211,238,0.18)] text-white"
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
                  <Input
                    type="password"
                    required
                    value={passwordData.passwordLama}
                    onChange={(e) => setPasswordData({ ...passwordData, passwordLama: e.target.value })}
                    placeholder="Masukkan password lama"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Password Baru
                  </label>
                  <Input
                    type="password"
                    required
                    value={passwordData.passwordBaru}
                    onChange={(e) => setPasswordData({ ...passwordData, passwordBaru: e.target.value })}
                    placeholder="Masukkan password baru (minimal 6 karakter)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Konfirmasi Password Baru
                  </label>
                  <Input
                    type="password"
                    required
                    value={passwordData.konfirmasiPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, konfirmasiPassword: e.target.value })}
                    placeholder="Konfirmasi password baru"
                  />
                </div>

                <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl p-4">
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
                  className="w-full py-3 rounded-xl font-semibold transition disabled:opacity-50 bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 hover:brightness-110 shadow-[0_20px_50px_rgba(34,211,238,0.18)] text-white"
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
      setLoading(true);
      const params = filterKantor ? { kantor: filterKantor } : {};
      const response = await karyawanAPI.getAll(params);
      console.log('Response karyawan:', response.data);
      setKaryawan(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetch karyawan:', error);
      toast.error(error.response?.data?.message || 'Gagal memuat data karyawan');
      setKaryawan([]);
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
      await fetchKaryawan();
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
      await fetchKaryawan();
    } catch (error) {
      console.error('Error reset cuti:', error);
      toast.error(error.response?.data?.message || 'Gagal mereset cuti');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus karyawan ini?')) return;

    try {
      await karyawanAPI.delete(id);
      toast.success('Karyawan berhasil dihapus');
      await fetchKaryawan();
    } catch (error) {
      console.error('Error delete karyawan:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus karyawan');
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
      <h2 className="text-2xl font-bold text-white">Daftar Karyawan</h2>
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
          <h2 className="text-2xl font-bold text-white">Daftar Karyawan</h2>
          <p className="text-sm text-slate-300 mt-1">
            Total: <span className="font-bold text-cyan-400">{filteredKaryawan.length}</span> karyawan
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
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, jabatan, atau departemen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400/40"
            />
          </div>
        </div>
        <select
          value={filterKantor}
          onChange={(e) => setFilterKantor(e.target.value)}
          className="h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400/40"
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
        className=""
      >
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-950/40 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Kantor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Jabatan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Departemen</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Sisa Cuti</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-white/10">
                <AnimatePresence>
                {filteredKaryawan.length > 0 ? (
                  filteredKaryawan.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/[0.04] transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm text-slate-300">{item.kantor}</td>
                    <td className="px-6 py-4 font-medium text-slate-100">{item.nama}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{item.jabatan}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{item.departemen}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                        item.sisa_cuti > 5 ? 'bg-emerald-500/15 text-emerald-200 border-emerald-400/20' :
                        item.sisa_cuti > 0 ? 'bg-amber-500/15 text-amber-200 border-amber-400/20' :
                        'bg-rose-500/15 text-rose-200 border-rose-400/20'
                      }`}>
                        {item.sisa_cuti}/{item.jatah_cuti} hari
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                        item.status === 'aktif'
                          ? 'bg-emerald-500/15 text-emerald-200 border-emerald-400/20'
                          : 'bg-white/5 text-slate-200 border-white/10'
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
                          className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-white"
                          title="Edit"
                        >
                          <FiEdit size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleResetCuti(item.id)}
                          className="p-2 rounded-lg border border-emerald-400/20 bg-emerald-500/15 hover:bg-emerald-500/20 transition text-emerald-100"
                          title="Reset Cuti"
                        >
                          <FiRefreshCw size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg border border-rose-400/20 bg-rose-500/15 hover:bg-rose-500/20 transition text-rose-100"
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
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                      {searchTerm || filterKantor ? 'Tidak ada karyawan yang sesuai dengan filter' : 'Belum ada data karyawan'}
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Modal Add/Edit Karyawan */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10 bg-slate-950/80 backdrop-blur-2xl"
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
                <label className="block text-sm font-medium text-slate-200 mb-2">Kantor *</label>
                <select
                  required
                  value={formData.kantor}
                  onChange={(e) => setFormData({ ...formData, kantor: e.target.value })}
                  className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400/40"
                >
                  <option value="">-- Pilih Kantor --</option>
                  {daftarKantor.map(kantor => (
                    <option key={kantor} value={kantor}>{kantor}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Nama *</label>
                <Input required value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Jabatan *</label>
                  <Input required value={formData.jabatan} onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Departemen *</label>
                  <Input required value={formData.departemen} onChange={(e) => setFormData({ ...formData, departemen: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">No. Telp</label>
                <Input type="tel" value={formData.no_telp} onChange={(e) => setFormData({ ...formData, no_telp: e.target.value })} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Jatah Cuti</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.jatah_cuti}
                    onChange={(e) => setFormData({ ...formData, jatah_cuti: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Sisa Cuti</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.sisa_cuti}
                    onChange={(e) => setFormData({ ...formData, sisa_cuti: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400/40"
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
                  className="flex-1 py-3 rounded-xl font-semibold transition bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 hover:brightness-110 text-white shadow-[0_20px_50px_rgba(34,211,238,0.18)]"
                >
                  {modalMode === 'add' ? 'Tambah' : 'Simpan'}
                </motion.button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 rounded-xl font-semibold transition border border-white/15 bg-white/10 text-white hover:bg-white/15"
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
        <h1 className="text-3xl font-bold text-white mb-2">Quota Karyawan</h1>
        <p className="text-slate-300">
          Lihat sisa cuti dan izin semua karyawan - Bulan {namaBulan[bulan - 1]} {tahun}
        </p>
      </motion.div>

      {/* Filter & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Filter Kantor
            </label>
            <select
              value={filterKantor}
              onChange={(e) => setFilterKantor(e.target.value)}
              className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400/40"
            >
              <option value="">Semua Kantor</option>
              {kantorList.map(kantor => (
                <option key={kantor} value={kantor}>{kantor}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Cari Karyawan
            </label>
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama, jabatan, atau departemen..."
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-300">
            Menampilkan {filteredKaryawan.length} dari {karyawanList.length} karyawan
          </p>
          <button
            onClick={fetchKaryawanQuota}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-white/15 bg-white/10 text-white hover:bg-white/15 transition"
          >
            <FiRefreshCw />
            <span>Refresh</span>
          </button>
        </div>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className=""
      >
        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-4">
              <SkeletonTable rows={10} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed text-xs sm:text-sm">
                <thead className="bg-slate-950/70 backdrop-blur border-b border-white/10 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-300 uppercase tracking-wider w-[6%]">No</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-300 uppercase tracking-wider w-[20%]">Kantor</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-300 uppercase tracking-wider w-[16%]">Nama</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-300 uppercase tracking-wider w-[16%]">Jabatan</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-300 uppercase tracking-wider w-[16%]">Departemen</th>
                    <th className="px-4 py-3 text-center text-[11px] font-semibold text-slate-300 uppercase tracking-wider w-[9%]">Sisa Cuti</th>
                    <th className="px-4 py-3 text-center text-[11px] font-semibold text-slate-300 uppercase tracking-wider w-[9%]">Pulang Cepat</th>
                    <th className="px-4 py-3 text-center text-[11px] font-semibold text-slate-300 uppercase tracking-wider w-[8%]">Datang Terlambat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredKaryawan.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-slate-400">
                        Tidak ada data karyawan
                      </td>
                    </tr>
                  ) : (
                    filteredKaryawan.map((karyawan, index) => (
                      <tr key={karyawan.id} className="hover:bg-white/[0.05] transition odd:bg-white/[0.02]">
                        <td className="px-4 py-3 align-top text-slate-200">{index + 1}</td>
                        <td className="px-4 py-3 align-top text-slate-200 whitespace-normal break-words">{karyawan.kantor}</td>
                        <td className="px-4 py-3 align-top font-semibold text-slate-100 whitespace-normal break-words">{karyawan.nama}</td>
                        <td className="px-4 py-3 align-top text-slate-300 whitespace-normal break-words">{karyawan.jabatan}</td>
                        <td className="px-4 py-3 align-top text-slate-300 whitespace-normal break-words">{karyawan.departemen}</td>
                        <td className="px-4 py-3 align-top text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                              karyawan.sisa_cuti > 5
                                ? 'bg-emerald-500/15 text-emerald-200 border-emerald-400/20'
                                : karyawan.sisa_cuti > 0
                                ? 'bg-amber-500/15 text-amber-200 border-amber-400/20'
                                : 'bg-rose-500/15 text-rose-200 border-rose-400/20'
                            }`}
                          >
                            {karyawan.sisa_cuti} hari
                          </span>
                        </td>
                        <td className="px-4 py-3 align-top text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                              karyawan.pulang_cepat < 3
                                ? 'bg-emerald-500/15 text-emerald-200 border-emerald-400/20'
                                : 'bg-rose-500/15 text-rose-200 border-rose-400/20'
                            }`}
                          >
                            {karyawan.pulang_cepat}/3x
                          </span>
                        </td>
                        <td className="px-4 py-3 align-top text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                              karyawan.datang_terlambat < 3
                                ? 'bg-emerald-500/15 text-emerald-200 border-emerald-400/20'
                                : 'bg-rose-500/15 text-rose-200 border-rose-400/20'
                            }`}
                          >
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
        </Card>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Keterangan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="font-semibold text-slate-200 mb-2">Sisa Cuti</p>
              <ul className="space-y-1 text-slate-300">
                <li>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-emerald-400/20 bg-emerald-500/15 text-emerald-200 text-xs font-semibold">
                    &gt; 5 hari
                  </span>{' '}
                  Aman
                </li>
                <li>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-amber-400/20 bg-amber-500/15 text-amber-200 text-xs font-semibold">
                    1–5 hari
                  </span>{' '}
                  Perhatian
                </li>
                <li>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-rose-400/20 bg-rose-500/15 text-rose-200 text-xs font-semibold">
                    0 hari
                  </span>{' '}
                  Habis
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="font-semibold text-slate-200 mb-2">Pulang Cepat</p>
              <ul className="space-y-1 text-slate-300">
                <li>Maksimal <span className="font-semibold text-white">3x</span> per bulan</li>
                <li>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-emerald-400/20 bg-emerald-500/15 text-emerald-200 text-xs font-semibold">
                    &lt; 3x
                  </span>{' '}
                  Masih bisa
                </li>
                <li>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-rose-400/20 bg-rose-500/15 text-rose-200 text-xs font-semibold">
                    3x
                  </span>{' '}
                  Quota habis
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="font-semibold text-slate-200 mb-2">Datang Terlambat</p>
              <ul className="space-y-1 text-slate-300">
                <li>Maksimal <span className="font-semibold text-white">3x</span> per bulan</li>
                <li>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-emerald-400/20 bg-emerald-500/15 text-emerald-200 text-xs font-semibold">
                    &lt; 3x
                  </span>{' '}
                  Masih bisa
                </li>
                <li>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-rose-400/20 bg-rose-500/15 text-rose-200 text-xs font-semibold">
                    3x
                  </span>{' '}
                  Quota habis
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default HRDDashboard;
