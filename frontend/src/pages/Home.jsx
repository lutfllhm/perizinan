import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import FloatingParticles from '../components/FloatingParticles.jsx';
import ScrollProgress from '../components/ScrollProgress.jsx';
import AnimatedCounter from '../components/AnimatedCounter.jsx';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const featuresRef = useRef(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Delay visibility for smooth initial render
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Intersection Observer for features
    const featuresObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFeaturesVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Intersection Observer for stats
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    const currentFeaturesRef = featuresRef.current;
    const currentStatsRef = statsRef.current;
    
    if (currentFeaturesRef) {
      featuresObserver.observe(currentFeaturesRef);
    }
    
    if (currentStatsRef) {
      statsObserver.observe(currentStatsRef);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
      if (currentFeaturesRef) {
        featuresObserver.unobserve(currentFeaturesRef);
      }
      if (currentStatsRef) {
        statsObserver.unobserve(currentStatsRef);
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Scroll Progress */}
      <ScrollProgress />
      
      {/* Subtle Floating Particles */}
      {!isMobile && <FloatingParticles count={15} />}
          
          {/* Professional Background - Lighter */}
          <div 
            className="fixed inset-0 z-0 bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(/img/bg.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Light overlay untuk readability */}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-gray-900/40 to-slate-900/50" />
            
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>

      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Hero Section - Professional */}
      <section className="relative z-10 min-h-screen flex items-center px-4 sm:px-6 pt-24">
        <div className="relative max-w-6xl mx-auto">
          <div className={`grid gap-10 lg:gap-16 lg:grid-cols-2 items-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Left: Text & CTA */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mb-4"
              >
                <p className="inline-flex items-center rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs sm:text-sm text-slate-200 backdrop-blur-sm">
                  <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Sistem perizinan karyawan berbasis web
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-4 leading-tight">
                  Sistem Perizinan
                  <span className="block text-4xl sm:text-5xl md:text-6xl font-bold text-red-500">
                    Cuti & Lembur
                  </span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-xl leading-relaxed">
                  Kelola pengajuan cuti dan lembur secara terukur, transparan, dan terdokumentasi dengan baik.
                  Dirancang untuk memenuhi standar operasional perusahaan modern.
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Link to="/pengajuan-form" className="w-full sm:w-auto">
                  <button className={`w-full sm:w-auto px-8 py-3.5 bg-red-600 text-white rounded-lg font-medium text-base transition-all duration-200 shadow-sm ${!isMobile ? 'hover:bg-red-700 hover:shadow-md' : ''}`}>
                    Ajukan Perizinan
                  </button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <button className={`w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/25 text-white rounded-lg font-medium text-base transition-all duration-200 ${!isMobile ? 'hover:bg-white/5 hover:border-white/40' : ''}`}>
                    Login Staff
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* Right: Highlight Card & Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="lg:justify-self-end"
            >
              <div className="rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md p-6 sm:p-8 shadow-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-4">
                  Ringkasan Kinerja
                </p>

                <div 
                  ref={statsRef}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                >
                  {[
                    { label: 'Pengajuan / bulan', value: 1200, suffix: '+', desc: 'Rata-rata permohonan yang diproses' },
                    { label: 'Waktu proses', value: 5, suffix: ' mnt', desc: 'Rata-rata dari pengajuan ke persetujuan' },
                    { label: 'Pengurangan manual', value: 80, suffix: '%', desc: 'Penurunan pekerjaan administratif' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 30 }}
                      animate={statsVisible ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                      className="text-left"
                    >
                      <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">
                        {stat.label}
                      </div>
                      <div className="text-2xl sm:text-3xl font-semibold text-white mb-1">
                        <AnimatedCounter value={stat.value} duration={1.4} suffix={stat.suffix} />
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {stat.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 border-t border-white/10 pt-4 flex items-center gap-3 text-xs text-slate-400">
                  <div className="flex -space-x-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-400/40">
                      HR
                    </span>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-semibold border border-sky-400/40">
                      GA
                    </span>
                  </div>
                  <span>
                    Digunakan oleh tim HR & General Affair untuk monitoring perizinan harian.
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Clean & Professional */}
      <section ref={featuresRef} className="relative z-10 py-20 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Fitur Utama
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
              Kelola perizinan karyawan dengan lebih efisien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Pengajuan Cuti', desc: 'Ajukan dan kelola cuti dengan sistem otomatis penghitungan kuota', delay: 0 },
              { title: 'Pengajuan Lembur', desc: 'Catat jam lembur dan hitung kompensasi secara akurat', delay: 0.1 },
              { title: 'Tracking Real-time', desc: 'Pantau status pengajuan dan terima notifikasi instant', delay: 0.2 },
              { title: 'Riwayat Lengkap', desc: 'Akses semua data perizinan yang tersimpan dengan aman', delay: 0.3 }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: feature.delay, duration: 0.5 }}
              >
                <div className={`bg-white/5 border border-white/10 rounded-lg p-6 h-full transition-all duration-300 ${!isMobile ? 'hover:bg-white/[0.08] hover:border-white/20 hover:shadow-lg hover:shadow-white/5' : ''}`}>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* Why Choose Us Section */}
      <section className="relative z-10 py-20 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Mengapa Memilih Kami
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
              Solusi terpercaya untuk manajemen perizinan perusahaan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Efisiensi Tinggi', 
                desc: 'Proses pengajuan yang cepat dan otomatis menghemat waktu hingga 70%'
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Keamanan Terjamin', 
                desc: 'Data terenkripsi dengan standar keamanan tingkat enterprise'
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Laporan Lengkap', 
                desc: 'Dashboard analytics untuk monitoring dan pelaporan yang komprehensif'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className={`text-center transition-all duration-300 ${!isMobile ? 'hover:-translate-y-2' : ''}`}>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/10 border border-red-600/20 rounded-xl text-red-500 mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* How It Works Section */}
      <section className="relative z-10 py-20 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Cara Kerja
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
              Proses sederhana dalam 4 langkah mudah
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection Line */}
            {!isMobile && (
              <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600/20 via-red-600/40 to-red-600/20 hidden md:block"></div>
            )}
            
            {[
              { step: '01', title: 'Daftar/Login', desc: 'Akses sistem dengan akun perusahaan Anda' },
              { step: '02', title: 'Ajukan Perizinan', desc: 'Isi form pengajuan cuti atau lembur' },
              { step: '03', title: 'Menunggu Approval', desc: 'Atasan akan mereview pengajuan Anda' },
              { step: '04', title: 'Selesai', desc: 'Terima notifikasi hasil persetujuan' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-full text-white font-bold text-2xl mb-4 shadow-lg shadow-red-600/30 relative z-10">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* CTA Section - Minimal */}
      <section className="relative z-10 py-20 sm:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Mulai Kelola Perizinan Anda
          </h2>
          <p className="text-base sm:text-lg text-slate-400 mb-8">
            Sistem digital yang memudahkan proses pengajuan dan persetujuan
          </p>
          <Link to="/pengajuan-form">
            <button className={`px-10 py-4 bg-red-600 text-white rounded-lg font-medium text-base transition-colors duration-200 ${!isMobile ? 'hover:bg-red-700' : ''}`}>
              Ajukan Sekarang
            </button>
          </Link>
        </div>
      </section>

      {/* Footer - Professional */}
      <footer className="relative z-10 py-10 sm:py-12 px-4 bg-slate-900/50 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/img/lg.png" alt="IWARE Logo" className="h-8 w-auto" onError={(e) => {
                  e.target.style.display = 'none';
                }} />
                <h3 className="text-xl font-semibold text-white">IWARE</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Sistem perizinan digital untuk manajemen cuti dan lembur yang efisien dan transparan.
              </p>
            </div>

            {/* Fitur */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Fitur</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li className="hover:text-white transition-colors duration-200 cursor-pointer">Pengajuan Cuti</li>
                <li className="hover:text-white transition-colors duration-200 cursor-pointer">Pengajuan Lembur</li>
                <li className="hover:text-white transition-colors duration-200 cursor-pointer">Tracking Status</li>
                <li className="hover:text-white transition-colors duration-200 cursor-pointer">Riwayat Perizinan</li>
              </ul>
            </div>

            {/* Perusahaan */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Perusahaan</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li className="hover:text-white transition-colors duration-200 cursor-pointer">Tentang Kami</li>
                <li className="hover:text-white transition-colors duration-200 cursor-pointer">Kebijakan Privasi</li>
                <li className="hover:text-white transition-colors duration-200 cursor-pointer">Syarat & Ketentuan</li>
                <li className="hover:text-white transition-colors duration-200 cursor-pointer">FAQ</li>
              </ul>
            </div>

            {/* Kontak */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Kontak</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>
                  <span className="block text-xs text-slate-500 mb-1">Email</span>
                  <a href="mailto:support@iware.id" className="hover:text-white transition-colors duration-200">support@iware.id</a>
                </li>
                <li>
                  <span className="block text-xs text-slate-500 mb-1">Telepon</span>
                  <a href="tel:+622112345678" className="hover:text-white transition-colors duration-200">+62 21 1234 5678</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-slate-500">
              &copy; 2026 IWARE. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-xs sm:text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
