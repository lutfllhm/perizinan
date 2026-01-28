import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: 'url(/img/bg.jpeg)',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95" />
      </div>

      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="relative max-w-5xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
              Sistem Perizinan Digital
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Sistem Perizinan
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Cuti & Lembur</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-12 max-w-2xl mx-auto leading-relaxed">
              Ajukan dan kelola izin cuti serta lembur dengan mudah, cepat, dan transparan
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/pengajuan-form">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300">
                  <span className="relative z-10 flex items-center">
                    Ajukan Perizinan
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </Link>
              <Link to="/login">
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-2xl font-semibold hover:bg-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300">
                  Login Staff
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-white/30 transition-all duration-300">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-2xl font-bold text-white mb-1">Cepat</div>
                <div className="text-sm text-slate-300">Proses Instan</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-white/30 transition-all duration-300">
                <div className="text-2xl mb-2">📱</div>
                <div className="text-2xl font-bold text-white mb-1">Mudah</div>
                <div className="text-sm text-slate-300">User Friendly</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-white/30 transition-all duration-300 col-span-2 md:col-span-1">
                <div className="text-2xl mb-2">🔔</div>
                <div className="text-2xl font-bold text-white mb-1">Real-Time</div>
                <div className="text-sm text-slate-300">Notifikasi Langsung</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4 bg-black/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Fitur <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Unggulan</span>
            </h2>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola perizinan
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-white/30 transition-all duration-500">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl mb-6">
                📝
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Pengajuan Cuti</h3>
              <p className="text-slate-200 leading-relaxed">
                Ajukan cuti tahunan, sakit, atau izin khusus dengan mudah. Sistem akan otomatis menghitung sisa kuota cuti Anda.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-white/30 transition-all duration-500">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl mb-6">
                ⏰
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Pengajuan Lembur</h3>
              <p className="text-slate-200 leading-relaxed">
                Catat jam lembur Anda dengan akurat. Sistem akan menghitung kompensasi sesuai dengan kebijakan perusahaan.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-white/30 transition-all duration-500">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl mb-6">
                ✅
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Tracking Status</h3>
              <p className="text-slate-200 leading-relaxed">
                Pantau status pengajuan Anda secara real-time. Dapatkan notifikasi instant saat ada update.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-white/30 transition-all duration-500">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-2xl mb-6">
                📊
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Riwayat Lengkap</h3>
              <p className="text-slate-200 leading-relaxed">
                Akses riwayat pengajuan Anda kapan saja. Semua data tersimpan dengan aman dan terorganisir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-12">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Siap Mengajukan Perizinan?
            </h2>
            <p className="text-xl text-slate-200 mb-8">
              Proses cepat dan mudah, hanya butuh beberapa menit
            </p>
            <Link to="/pengajuan-form">
              <button className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300">
                <span className="relative z-10 flex items-center justify-center">
                  Mulai Sekarang
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 bg-black/40 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                IWARE
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Sistem perizinan digital untuk manajemen cuti dan lembur yang efisien dan transparan.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Fitur</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="hover:text-white transition-colors cursor-pointer">Pengajuan Cuti</li>
                <li className="hover:text-white transition-colors cursor-pointer">Pengajuan Lembur</li>
                <li className="hover:text-white transition-colors cursor-pointer">Tracking Status</li>
                <li className="hover:text-white transition-colors cursor-pointer">Riwayat Perizinan</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Kontak</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="hover:text-white transition-colors cursor-pointer">
                  <span className="block text-sm">Email</span>
                  <span className="text-sm">support@iware.id</span>
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  <span className="block text-sm">Telepon</span>
                  <span className="text-sm">+62 21 1234 5678</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-slate-400">
            <p>&copy; 2026 IWARE. Sistem Perizinan Digital.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
