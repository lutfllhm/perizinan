import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar.jsx';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const featuresRef = useRef(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Mouse move effect
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Scroll effect
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Intersection Observer for features
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFeaturesVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentFeaturesRef = featuresRef.current;
    if (currentFeaturesRef) {
      observer.observe(currentFeaturesRef);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (currentFeaturesRef) {
        observer.unobserve(currentFeaturesRef);
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-fixed transition-transform duration-1000"
        style={{ 
          backgroundImage: 'url(/img/bg.jpeg)',
          backgroundAttachment: 'fixed',
          transform: `scale(${1 + scrollY * 0.0001})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95" />
        
        {/* Animated Gradient Orbs */}
        <div 
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            top: '20%',
            left: `${20 + mousePosition.x * 0.02}%`,
            transition: 'left 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            bottom: '20%',
            right: `${20 + mousePosition.y * 0.02}%`,
            transition: 'right 0.3s ease-out',
            animationDelay: '1s'
          }}
        />
      </div>

      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 pt-16">
        <div className="relative max-w-5xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div 
              className="inline-flex items-center px-3 py-2 sm:px-4 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full text-blue-300 text-xs sm:text-sm font-medium mb-6 sm:mb-8 hover:bg-blue-500/30 hover:scale-105 transition-all duration-300 cursor-pointer"
              style={{
                animation: 'float 3s ease-in-out infinite'
              }}
            >
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
              Sistem Perizinan Digital
            </div>
            
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2"
              style={{
                animation: 'fadeInUp 1s ease-out'
              }}
            >
              Sistem Perizinan
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-gradient">
                Cuti & Lembur
              </span>
            </h1>
            
            <p 
              className="text-base sm:text-lg md:text-xl text-slate-200 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
              style={{
                animation: 'fadeInUp 1s ease-out 0.2s both'
              }}
            >
              Ajukan dan kelola izin cuti serta lembur dengan mudah, cepat, dan transparan
            </p>

            {/* CTA Buttons */}
            <div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4"
              style={{
                animation: 'fadeInUp 1s ease-out 0.4s both'
              }}
            >
              <Link to="/pengajuan-form" className="w-full sm:w-auto">
                <button className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center justify-center">
                    Ajukan Perizinan
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <button className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-2xl font-semibold hover:bg-white/20 hover:border-white/40 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                  <span className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  <span className="relative z-10">Login Staff</span>
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div 
              className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto px-4"
              style={{
                animation: 'fadeInUp 1s ease-out 0.6s both'
              }}
            >
              <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/15 hover:border-white/30 hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer">
                <div className="text-xl sm:text-2xl mb-2 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">⚡</div>
                <div className="text-lg sm:text-2xl font-bold text-white mb-1">Cepat</div>
                <div className="text-xs sm:text-sm text-slate-300">Proses Instan</div>
              </div>
              <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/15 hover:border-white/30 hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer" style={{ animationDelay: '0.1s' }}>
                <div className="text-xl sm:text-2xl mb-2 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">📱</div>
                <div className="text-lg sm:text-2xl font-bold text-white mb-1">Mudah</div>
                <div className="text-xs sm:text-sm text-slate-300">User Friendly</div>
              </div>
              <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/15 hover:border-white/30 hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer col-span-2 md:col-span-1" style={{ animationDelay: '0.2s' }}>
                <div className="text-xl sm:text-2xl mb-2 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">🔔</div>
                <div className="text-lg sm:text-2xl font-bold text-white mb-1">Real-Time</div>
                <div className="text-xs sm:text-sm text-slate-300">Notifikasi Langsung</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative z-10 py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-black/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
              Fitur <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-gradient">Unggulan</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl mx-auto px-4">
              Semua yang Anda butuhkan untuk mengelola perizinan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-0">
            {[
              { icon: '📝', title: 'Pengajuan Cuti', desc: 'Ajukan cuti tahunan, sakit, atau izin khusus dengan mudah. Sistem akan otomatis menghitung sisa kuota cuti Anda.', gradient: 'from-blue-500 to-cyan-500', delay: '0s' },
              { icon: '⏰', title: 'Pengajuan Lembur', desc: 'Catat jam lembur Anda dengan akurat. Sistem akan menghitung kompensasi sesuai dengan kebijakan perusahaan.', gradient: 'from-purple-500 to-pink-500', delay: '0.1s' },
              { icon: '✅', title: 'Tracking Status', desc: 'Pantau status pengajuan Anda secara real-time. Dapatkan notifikasi instant saat ada update.', gradient: 'from-green-500 to-emerald-500', delay: '0.2s' },
              { icon: '📊', title: 'Riwayat Lengkap', desc: 'Akses riwayat pengajuan Anda kapan saja. Semua data tersimpan dengan aman dan terorganisir.', gradient: 'from-orange-500 to-red-500', delay: '0.3s' }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`group bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-white/30 hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ 
                  transitionDelay: featuresVisible ? feature.delay : '0s'
                }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-2xl`}>
                  <span className="group-hover:scale-125 transition-transform duration-300">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-200 leading-relaxed group-hover:text-white transition-colors duration-300">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-12 hover:bg-white/15 hover:border-white/30 hover:scale-105 transition-all duration-500">
            <div className="text-5xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 inline-block">🚀</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
              Siap Mengajukan Perizinan?
            </h2>
            <p className="text-xl text-slate-200 mb-8 group-hover:text-white transition-colors duration-300">
              Proses cepat dan mudah, hanya butuh beberapa menit
            </p>
            <Link to="/pengajuan-form">
              <button className="group/btn relative px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center justify-center">
                  Mulai Sekarang
                  <svg className="w-5 h-5 ml-2 group-hover/btn:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="group">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4 group-hover:scale-105 transition-transform duration-300 inline-block">
                IWARE
              </h3>
              <p className="text-slate-300 leading-relaxed group-hover:text-white transition-colors duration-300">
                Sistem perizinan digital untuk manajemen cuti dan lembur yang efisien dan transparan.
              </p>
            </div>

            <div className="group">
              <h4 className="text-lg font-semibold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">Fitur</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer">→ Pengajuan Cuti</li>
                <li className="hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer">→ Pengajuan Lembur</li>
                <li className="hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer">→ Tracking Status</li>
                <li className="hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer">→ Riwayat Perizinan</li>
              </ul>
            </div>

            <div className="group">
              <h4 className="text-lg font-semibold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">Kontak</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer">
                  <span className="block text-sm">📧 Email</span>
                  <span className="text-sm">support@iware.id</span>
                </li>
                <li className="hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer">
                  <span className="block text-sm">📞 Telepon</span>
                  <span className="text-sm">+62 21 1234 5678</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-slate-400">
            <p className="hover:text-white transition-colors duration-300">&copy; 2026 IWARE. Sistem Perizinan Digital.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
