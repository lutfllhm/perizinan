import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, FiClock, FiPackage, FiTruck, FiCheckCircle, 
  FiAlertCircle, FiMapPin, FiUser, FiPhone, FiDollarSign,
  FiFilter, FiSearch, FiDownload, FiRefreshCw
} from 'react-icons/fi';

// ============================================
// MODERN SCHEDULE DESIGN - ULTRA PREMIUM
// ============================================

const ModernScheduleDesign = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'timeline'

  // Dummy data dengan lebih banyak detail
  const dummySchedules = [
    {
      id: 1,
      no_so: 'SO-2026-001',
      pelanggan: 'PT. Maju Jaya Sentosa',
      alamat: 'Jl. Sudirman No. 123, Jakarta Selatan',
      contact: '+62 812-3456-7890',
      tgl_transaksi: '2026-01-30T08:00:00',
      tgl_schedule: '2026-01-31T10:00:00',
      waktu_mulai: '10:00',
      waktu_selesai: '12:00',
      status: 'MENUNGGU',
      priority: 'HIGH',
      items: 15,
      total: 15000000,
      driver: 'Budi Santoso',
      vehicle: 'B 1234 XYZ',
      notes: 'Pengiriman harus tepat waktu, barang fragile'
    },
    {
      id: 2,
      no_so: 'SO-2026-002',
      pelanggan: 'CV. Berkah Sentosa Abadi',
      alamat: 'Jl. Gatot Subroto No. 456, Jakarta Pusat',
      contact: '+62 813-9876-5432',
      tgl_transaksi: '2026-01-30T09:30:00',
      tgl_schedule: '2026-01-31T13:00:00',
      waktu_mulai: '13:00',
      waktu_selesai: '15:00',
      status: 'PROSES',
      priority: 'MEDIUM',
      items: 8,
      total: 8500000,
      driver: 'Ahmad Wijaya',
      vehicle: 'B 5678 ABC',
      notes: 'Konfirmasi sebelum pengiriman'
    },
    {
      id: 3,
      no_so: 'SO-2026-003',
      pelanggan: 'Toko Sejahtera Makmur',
      alamat: 'Jl. Thamrin No. 789, Jakarta Pusat',
      contact: '+62 821-1111-2222',
      tgl_transaksi: '2026-01-29T14:00:00',
      tgl_schedule: '2026-01-30T16:00:00',
      waktu_mulai: '16:00',
      waktu_selesai: '18:00',
      status: 'SELESAI',
      priority: 'LOW',
      items: 20,
      total: 22000000,
      driver: 'Siti Nurhaliza',
      vehicle: 'B 9012 DEF',
      notes: 'Pengiriman berhasil, customer puas'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setSchedules(dummySchedules);
      setLoading(false);
    }, 1500);
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      MENUNGGU: {
        color: 'from-red-500 to-red-600',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        icon: FiAlertCircle,
        label: 'Menunggu Proses'
      },
      PROSES: {
        color: 'from-yellow-500 to-orange-500',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        icon: FiClock,
        label: 'Sedang Diproses'
      },
      SELESAI: {
        color: 'from-green-500 to-emerald-500',
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        text: 'text-green-400',
        icon: FiCheckCircle,
        label: 'Selesai'
      }
    };
    return configs[status] || configs.MENUNGGU;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      HIGH: { color: 'text-red-400', label: '🔥 High Priority' },
      MEDIUM: { color: 'text-yellow-400', label: '⚡ Medium Priority' },
      LOW: { color: 'text-blue-400', label: '📋 Low Priority' }
    };
    return configs[priority] || configs.MEDIUM;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchFilter = filter === 'SEMUA' || schedule.status === filter;
    const matchSearch = schedule.no_so.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       schedule.pelanggan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700"
          >
            <div className="animate-pulse space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-8 bg-slate-700 rounded-lg w-48"></div>
                  <div className="h-4 bg-slate-700 rounded w-64"></div>
                </div>
                <div className="h-12 w-32 bg-slate-700 rounded-full"></div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-24 bg-slate-700 rounded-xl"></div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // ============================================
  // EMPTY STATE
  // ============================================
  if (filteredSchedules.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-12 rounded-3xl border border-slate-700">
              <FiCalendar className="text-8xl text-slate-600" />
            </div>
          </div>
        </motion.div>
        <h3 className="text-3xl font-bold text-white mb-4">
          Tidak ada schedule yang ditemukan
        </h3>
        <p className="text-slate-400 text-lg mb-8">
          Silakan ubah filter atau tambah schedule baru
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all"
        >
          + Tambah Schedule Baru
        </motion.button>
      </motion.div>
    );
  }

  // ============================================
  // MAIN CONTENT - CARD VIEW
  // ============================================
  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-xl" />
          <input
            type="text"
            placeholder="Cari SO atau Pelanggan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {['SEMUA', 'MENUNGGU', 'PROSES', 'SELESAI'].map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filter === status
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {status}
            </motion.button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl transition-all"
            title="Refresh"
          >
            <FiRefreshCw className="text-xl" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl transition-all"
            title="Export"
          >
            <FiDownload className="text-xl" />
          </motion.button>
        </div>
      </div>

      {/* Schedule Cards */}
      <AnimatePresence mode="popLayout">
        {filteredSchedules.map((schedule, index) => {
          const statusConfig = getStatusConfig(schedule.status);
          const priorityConfig = getPriorityConfig(schedule.priority);
          const StatusIcon = statusConfig.icon;

          return (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.1 }}
              layout
              className="group relative"
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${statusConfig.color} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
              
              {/* Card */}
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 hover:border-slate-600 transition-all duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                        {schedule.no_so}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${priorityConfig.color}`}>
                        {priorityConfig.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <FiUser className="text-lg" />
                      <span className="text-lg font-semibold">{schedule.pelanggan}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <FiMapPin />
                      <span>{schedule.alamat}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`${statusConfig.bg} ${statusConfig.border} border-2 rounded-2xl px-6 py-3`}>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusIcon className={`text-2xl ${statusConfig.text}`} />
                      <span className={`text-lg font-bold ${statusConfig.text}`}>
                        {schedule.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 text-center">{statusConfig.label}</p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Tanggal Transaksi */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
                      <FiCalendar />
                      <span className="font-semibold">Tgl Transaksi</span>
                    </div>
                    <div className="text-white font-bold">
                      {new Date(schedule.tgl_transaksi).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short'
                      })}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {new Date(schedule.tgl_transaksi).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </motion.div>

                  {/* Tanggal Schedule */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex items-center gap-2 text-blue-400 text-xs mb-2">
                      <FiTruck />
                      <span className="font-semibold">Tgl Schedule</span>
                    </div>
                    <div className="text-white font-bold">
                      {new Date(schedule.tgl_schedule).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short'
                      })}
                    </div>
                    <div className="text-blue-300 text-xs font-semibold">
                      {schedule.waktu_mulai} - {schedule.waktu_selesai}
                    </div>
                  </motion.div>

                  {/* Items */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
                      <FiPackage />
                      <span className="font-semibold">Total Items</span>
                    </div>
                    <div className="text-white font-bold text-2xl">
                      {schedule.items}
                    </div>
                    <div className="text-slate-400 text-xs">items</div>
                  </motion.div>

                  {/* Total */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-4 border border-green-500/30 hover:border-green-500/50 transition-all"
                  >
                    <div className="flex items-center gap-2 text-green-400 text-xs mb-2">
                      <FiDollarSign />
                      <span className="font-semibold">Total Nilai</span>
                    </div>
                    <div className="text-white font-bold text-lg">
                      {formatCurrency(schedule.total)}
                    </div>
                  </motion.div>
                </div>

                {/* Driver & Vehicle Info */}
                <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-slate-700/50 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <FiUser className="text-white text-xl" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Driver</div>
                      <div className="text-white font-semibold">{schedule.driver}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1 text-right">Kendaraan</div>
                      <div className="text-white font-semibold">{schedule.vehicle}</div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                      <FiTruck className="text-white text-xl" />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {schedule.notes && (
                  <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                    <div className="flex items-start gap-2">
                      <FiAlertCircle className="text-yellow-400 text-lg mt-0.5" />
                      <div>
                        <div className="text-yellow-400 text-xs font-semibold mb-1">Catatan:</div>
                        <div className="text-slate-300 text-sm">{schedule.notes}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all"
                  >
                    Lihat Detail
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all"
                  >
                    <FiPhone className="text-xl" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all"
                  >
                    <FiMapPin className="text-xl" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ModernScheduleDesign;
