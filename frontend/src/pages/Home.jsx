import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "⚡",
      title: "Otomatisasi Cerdas",
      description: "Proses persetujuan cuti dan lembur otomatis dengan workflow yang dapat dikustomisasi sesuai struktur organisasi",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "📊",
      title: "Dashboard Analytics",
      description: "Laporan real-time dan insights mendalam tentang produktivitas, absensi, dan tren HR perusahaan Anda",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "🔒",
      title: "Keamanan Enterprise",
      description: "Perlindungan data karyawan dengan enkripsi end-to-end dan compliance terhadap regulasi Indonesia",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { number: "500+", label: "Perusahaan Client", icon: "🏢" },
    { number: "50K+", label: "Karyawan Aktif", icon: "👥" },
    { number: "99.9%", label: "Uptime SLA", icon: "⚡" },
    { number: "24/7", label: "Support", icon: "🛟" }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Modern Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: 'url(/img/bg.jpeg)',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Modern gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95" />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`
        }} />
      </div>

      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="relative max-w-6xl mx-auto text-center">
          {/* Main Heading */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
              Sistem HR Terdepan 2026
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Kelola <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Perizinan</span>
              <br />dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Cerdas</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-12 max-w-2xl mx-auto leading-relaxed">
              Platform HRMS berbasis cloud yang mengotomatisasi proses cuti, lembur, absensi, dan payroll 
              untuk perusahaan Indonesia dengan kepatuhan terhadap regulasi ketenagakerjaan lokal
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link to="/pengajuan-form">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300">
                <span className="relative z-10 flex items-center">
                  Mulai Gratis
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </Link>
            <Link to="/login">
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-2xl font-semibold hover:bg-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300">
                Login Dashboard
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {stats.map((stat, index) => (
              <div key={index} className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-white/30 transition-all duration-300">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-sm text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Mengapa Memilih <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">IWARE</span>?
            </h2>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto">
              Solusi HRMS terintegrasi yang dirancang khusus untuk kebutuhan perusahaan Indonesia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-white/30 transition-all duration-500 cursor-pointer ${
                  activeFeature === index ? 'ring-2 ring-blue-500/50 bg-white/15' : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 py-24 px-4 bg-black/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">IWARE</span>
              </h2>
              <p className="text-lg text-slate-200 mb-8 leading-relaxed">
                IWARE adalah perusahaan teknologi Indonesia yang berdedikasi menghadirkan solusi Human Resource Management System (HRMS) 
                terdepan. Sejak 2014, kami telah membantu lebih dari 500 perusahaan di Indonesia mengoptimalkan proses manajemen SDM 
                dengan teknologi cloud-based yang aman dan efisien.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-200">10+ tahun pengalaman dalam teknologi HRMS Indonesia</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-200">Dipercaya oleh 500+ perusahaan dari startup hingga enterprise</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-200">Sertifikasi ISO 27001 untuk keamanan data kelas enterprise</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">500+</div>
                    <div className="text-slate-300 text-sm">Perusahaan Client</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">50K+</div>
                    <div className="text-slate-300 text-sm">Karyawan Terkelola</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                    <div className="text-slate-300 text-sm">Uptime SLA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">24/7</div>
                    <div className="text-slate-300 text-sm">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Visi & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Misi</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-white/30 transition-all duration-500">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  👁️
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">VISI</h3>
              </div>
              <p className="text-lg text-slate-200 text-center leading-relaxed">
                "Menjadi platform HRMS terdepan di Indonesia yang memberdayakan perusahaan untuk mengelola 
                sumber daya manusia secara efisien, transparan, dan berkelanjutan melalui inovasi teknologi digital."
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-white/30 transition-all duration-500">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  🎯
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">MISI</h3>
              </div>
              <div className="space-y-4 text-slate-200">
                <div className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1 text-lg">•</span>
                  <p>Mengembangkan solusi HRMS yang user-friendly dan terintegrasi dengan ekosistem bisnis Indonesia</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-400 mr-3 mt-1 text-lg">•</span>
                  <p>Memberikan layanan support 24/7 dengan response time terbaik di kelasnya</p>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-400 mr-3 mt-1 text-lg">•</span>
                  <p>Meningkatkan efisiensi proses HR hingga 80% melalui otomatisasi cerdas</p>
                </div>
                <div className="flex items-start">
                  <span className="text-pink-400 mr-3 mt-1 text-lg">•</span>
                  <p>Membangun ekosistem digital yang mendukung pertumbuhan SDM Indonesia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Siap Mengoptimalkan HR Anda?
            </h2>
            <p className="text-xl text-slate-200 mb-8">
              Bergabunglah dengan 500+ perusahaan Indonesia yang telah merasakan efisiensi maksimal dalam pengelolaan SDM
            </p>
            <Link to="/pengajuan-form">
              <button className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300">
                <span className="relative z-10 flex items-center justify-center">
                  Mulai Sekarang - Gratis
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
      <footer className="relative z-10 py-16 px-4 bg-black/40 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                IWARE
              </h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Platform HRMS terdepan di Indonesia yang menggunakan teknologi cloud untuk mengotomatisasi 
                dan mengoptimalkan proses manajemen sumber daya manusia. Dipercaya oleh 500+ perusahaan 
                dari berbagai industri di seluruh Indonesia.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm">📧</span>
                </div>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <span className="text-sm">📞</span>
                </div>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-sm">🌐</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Solusi HRMS</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="hover:text-white transition-colors cursor-pointer">Manajemen Cuti & Izin</li>
                <li className="hover:text-white transition-colors cursor-pointer">Sistem Absensi Digital</li>
                <li className="hover:text-white transition-colors cursor-pointer">Payroll & Benefits</li>
                <li className="hover:text-white transition-colors cursor-pointer">Performance Management</li>
                <li className="hover:text-white transition-colors cursor-pointer">Employee Self Service</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Hubungi Kami</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="hover:text-white transition-colors cursor-pointer">
                  <span className="block font-medium">Email</span>
                  <span className="text-sm">info@iware-hrms.co.id</span>
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  <span className="block font-medium">Telepon</span>
                  <span className="text-sm">+62 21 2922 1234</span>
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  <span className="block font-medium">Alamat</span>
                  <span className="text-sm">Jakarta Selatan, Indonesia</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-slate-400">
            <p>&copy; 2026 IWARE HRMS Indonesia. All rights reserved. Solusi HR terpercaya untuk masa depan yang lebih baik.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;