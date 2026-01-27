import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Floating particles component
  const FloatingParticles = () => {
    const particles = Array.from({ length: 15 }, (_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-pulse pointer-events-none"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }}
      />
    ));
    return <div className="absolute inset-0 overflow-hidden pointer-events-none">{particles}</div>;
  };

  // Interactive cursor follower
  const CursorFollower = () => (
    <div
      className="fixed w-4 h-4 bg-blue-400/20 rounded-full pointer-events-none z-40 transition-all duration-100 ease-out hidden md:block"
      style={{
        left: mousePosition.x - 8,
        top: mousePosition.y - 8,
        transform: `scale(${scrollY > 100 ? 0.5 : 1})`
      }}
    />
  );

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <CursorFollower />
      
      {/* Background Image with Parallax */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center transition-transform duration-75"
        style={{ 
          backgroundImage: 'url(/img/bg.jpeg)',
          transform: `translateY(${scrollY * 0.3}px)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/85 to-gray-900/90" />
        <FloatingParticles />
      </div>

      {/* Navbar */}
      <div className="relative z-30">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="relative z-20 min-h-screen flex items-center px-4 pt-20">
        <div className="max-w-7xl mx-auto w-full text-center">
          <div className={`inline-block px-6 py-3 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-300 rounded-full text-sm font-bold mb-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            ✨ Platform Perizinan Modern IWARE
          </div>

          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="inline-block hover:scale-110 transition-transform duration-300">Sistem</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-cyan-400 hover:to-blue-400 transition-all duration-500 inline-block hover:scale-110">
              Perizinan
            </span>
            <br />
            <span className="text-3xl md:text-5xl text-gray-300 inline-block hover:scale-110 transition-transform duration-300">Cuti & Lembur</span>
          </h1>

          <p className={`text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Kelola pengajuan cuti dan lembur dengan mudah, cepat, dan efisien melalui platform digital terdepan
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-10 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Link to="/pengajuan-form" className="relative z-10">
              <button className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <span className="relative z-10">Ajukan Sekarang →</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
            <Link to="/login" className="relative z-10">
              <button className="group relative w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold hover:bg-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <span className="relative z-10">Login Staff</span>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">500+</div>
              <div className="text-sm text-gray-400">Pengajuan</div>
            </div>
            <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">98%</div>
              <div className="text-sm text-gray-400">Kepuasan</div>
            </div>
            <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">24/7</div>
              <div className="text-sm text-gray-400">Akses</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Company Section */}
      <section className="relative z-20 py-20 px-4 bg-gradient-to-br from-black/30 to-black/10">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '900ms'}}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">IWARE</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              IWARE adalah perusahaan teknologi terdepan yang berfokus pada pengembangan solusi digital 
              untuk manajemen sumber daya manusia. Dengan pengalaman lebih dari 10 tahun, kami telah 
              membantu ratusan perusahaan mengoptimalkan proses HR mereka.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Company Stats */}
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{transitionDelay: '1000ms'}}>
              <div className="grid grid-cols-2 gap-6">
                <div className="group bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl p-6 rounded-2xl border border-blue-400/30 hover:border-blue-400/60 hover:scale-105 transition-all duration-300">
                  <div className="text-3xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300">10+</div>
                  <div className="text-gray-300 text-sm">Tahun Pengalaman</div>
                </div>
                <div className="group bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl p-6 rounded-2xl border border-green-400/30 hover:border-green-400/60 hover:scale-105 transition-all duration-300">
                  <div className="text-3xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300">200+</div>
                  <div className="text-gray-300 text-sm">Perusahaan Client</div>
                </div>
                <div className="group bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl p-6 rounded-2xl border border-purple-400/30 hover:border-purple-400/60 hover:scale-105 transition-all duration-300">
                  <div className="text-3xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300">50K+</div>
                  <div className="text-gray-300 text-sm">Pengguna Aktif</div>
                </div>
                <div className="group bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl p-6 rounded-2xl border border-orange-400/30 hover:border-orange-400/60 hover:scale-105 transition-all duration-300">
                  <div className="text-3xl font-bold text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300">99.9%</div>
                  <div className="text-gray-300 text-sm">Uptime System</div>
                </div>
              </div>
            </div>

            {/* Company Values */}
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{transitionDelay: '1100ms'}}>
              <div className="space-y-6">
                <div className="group bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-blue-400/50 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      🚀
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">Inovasi</h3>
                  </div>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    Selalu menghadirkan teknologi terdepan untuk solusi HR yang efektif dan efisien.
                  </p>
                </div>

                <div className="group bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-green-400/50 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      🤝
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">Kepercayaan</h3>
                  </div>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    Membangun hubungan jangka panjang dengan client melalui layanan yang dapat diandalkan.
                  </p>
                </div>

                <div className="group bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-purple-400/50 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      ⭐
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">Kualitas</h3>
                  </div>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    Berkomitmen memberikan produk dan layanan berkualitas tinggi dengan standar internasional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="relative z-20 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '1200ms'}}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Visi & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Misi</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Vision */}
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '1300ms'}}>
              <div className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl p-8 rounded-3xl border border-blue-400/20 hover:border-blue-400/50 hover:scale-105 transition-all duration-500">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    👁️
                  </div>
                  <h3 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">VISI</h3>
                </div>
                <p className="text-lg text-gray-300 group-hover:text-white transition-colors duration-300 text-center leading-relaxed">
                  "Menjadi perusahaan teknologi HR terdepan di Indonesia yang menghadirkan solusi digital 
                  inovatif untuk transformasi manajemen sumber daya manusia di era digital."
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '1400ms'}}>
              <div className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl p-8 rounded-3xl border border-green-400/20 hover:border-green-400/50 hover:scale-105 transition-all duration-500">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    🎯
                  </div>
                  <h3 className="text-3xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">MISI</h3>
                </div>
                <div className="space-y-4 text-gray-300 group-hover:text-white transition-colors duration-300">
                  <div className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1">•</span>
                    <p>Mengembangkan platform HR yang user-friendly dan terintegrasi</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1">•</span>
                    <p>Memberikan layanan support 24/7 dengan response time terbaik</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1">•</span>
                    <p>Meningkatkan efisiensi proses HR hingga 80% melalui otomatisasi</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1">•</span>
                    <p>Membangun ekosistem digital yang mendukung pertumbuhan bisnis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-20 py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-4xl font-bold text-white text-center mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Keunggulan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Platform</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className={`group bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-blue-400/50 hover:-translate-y-4 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '1000ms'}}>
              <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">⚡</div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">Proses Cepat</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Pengajuan diproses dalam hitungan menit</p>
            </div>

            <div className={`group bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-green-400/50 hover:-translate-y-4 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '1200ms'}}>
              <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">📅</div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">Fleksibel</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Atur jadwal sesuai kebutuhan Anda</p>
            </div>

            <div className={`group bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-cyan-400/50 hover:-translate-y-4 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '1400ms'}}>
              <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">✅</div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">Real-Time</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Pantau status pengajuan secara langsung</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-20 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-4xl font-bold text-white text-center mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '1500ms'}}>
            Apa Kata <span className="gradient-text-animated">Pengguna</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-blue-400/50 hover:scale-105 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{transitionDelay: '1600ms'}}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">Ahmad Rizki</h4>
                  <p className="text-gray-400 text-sm">Staff IT</p>
                </div>
              </div>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                "Platform ini sangat memudahkan proses pengajuan cuti. Interface yang user-friendly dan proses yang cepat!"
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">⭐</span>
                ))}
              </div>
            </div>

            <div className={`group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-green-400/50 hover:scale-105 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{transitionDelay: '1700ms'}}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">Sari Dewi</h4>
                  <p className="text-gray-400 text-sm">HRD Manager</p>
                </div>
              </div>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                "Sebagai HRD, sistem ini sangat membantu dalam mengelola dan memantau semua pengajuan karyawan secara real-time."
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">⭐</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-20 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 md:p-12 text-center hover:from-cyan-600 hover:to-blue-600 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '1800ms'}}>
            <div className="text-4xl md:text-6xl mb-6 animate-bounce">⚡</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Siap Mengajukan Perizinan?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Proses cepat dan mudah, hanya butuh beberapa menit
            </p>
            <Link to="/pengajuan-form" className="relative z-10">
              <button className="group relative px-8 md:px-10 py-4 bg-white text-blue-600 rounded-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 overflow-hidden ripple-effect">
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">Mulai Sekarang</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative z-20 bg-black/40 backdrop-blur-xl border-t border-white/10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className={`grid md:grid-cols-4 gap-8 mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '1900ms'}}>
            {/* Company Info */}
            <div className="group md:col-span-2">
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4 group-hover:from-cyan-400 group-hover:to-blue-400 transition-all duration-300">
                IWARE
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-6 leading-relaxed">
                Perusahaan teknologi terdepan yang menghadirkan solusi digital inovatif untuk transformasi 
                manajemen sumber daya manusia di era digital. Dengan pengalaman lebih dari 10 tahun, 
                kami telah dipercaya oleh ratusan perusahaan.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 cursor-pointer">
                  📧
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 cursor-pointer">
                  📞
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 cursor-pointer">
                  🌐
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="group">
              <h4 className="text-xl font-semibold text-white mb-6 group-hover:text-blue-400 transition-colors duration-300">Layanan Kami</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer flex items-center">
                  <span className="text-blue-400 mr-2">→</span> Sistem Pengajuan Cuti
                </li>
                <li className="hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer flex items-center">
                  <span className="text-green-400 mr-2">→</span> Manajemen Lembur
                </li>
                <li className="hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer flex items-center">
                  <span className="text-purple-400 mr-2">→</span> Real-time Tracking
                </li>
                <li className="hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer flex items-center">
                  <span className="text-orange-400 mr-2">→</span> Dashboard Analytics
                </li>
                <li className="hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer flex items-center">
                  <span className="text-cyan-400 mr-2">→</span> Support 24/7
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="group">
              <h4 className="text-xl font-semibold text-white mb-6 group-hover:text-cyan-400 transition-colors duration-300">Hubungi Kami</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer flex items-center">
                  <span className="text-2xl mr-3">📧</span>
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm">info@iware.com</div>
                  </div>
                </li>
                <li className="hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer flex items-center">
                  <span className="text-2xl mr-3">📞</span>
                  <div>
                    <div className="font-medium">Telepon</div>
                    <div className="text-sm">(021) 1234-5678</div>
                  </div>
                </li>
                <li className="hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer flex items-center">
                  <span className="text-2xl mr-3">📍</span>
                  <div>
                    <div className="font-medium">Alamat</div>
                    <div className="text-sm">Jakarta, Indonesia</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className={`border-t border-white/10 pt-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '2000ms'}}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 hover:text-gray-300 transition-colors duration-300 mb-4 md:mb-0">
                &copy; 2026 IWARE. Hak Cipta Dilindungi. Dibuat dengan ❤️ untuk masa depan HR yang lebih baik.
              </p>
              <div className="flex space-x-6 text-sm text-gray-500">
                <span className="hover:text-white transition-colors duration-300 cursor-pointer">Kebijakan Privasi</span>
                <span className="hover:text-white transition-colors duration-300 cursor-pointer">Syarat & Ketentuan</span>
                <span className="hover:text-white transition-colors duration-300 cursor-pointer">FAQ</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
