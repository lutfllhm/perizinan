import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import FloatingParticles from '../components/FloatingParticles.jsx';
import ScrollProgress from '../components/ScrollProgress.jsx';
import Card from '../components/ui/Card.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const featuresRef = useRef(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [faqOpen, setFaqOpen] = useState(0);

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

    const currentFeaturesRef = featuresRef.current;
    
    if (currentFeaturesRef) {
      featuresObserver.observe(currentFeaturesRef);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
      if (currentFeaturesRef) {
        featuresObserver.unobserve(currentFeaturesRef);
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image seperti sebelumnya, dengan overlay sedikit lebih gelap */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(/img/bg.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlays for readability & depth */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-gray-900/45 to-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
        
        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>
      {/* Scroll Progress */}
      <ScrollProgress />
      
      {/* Subtle Floating Particles */}
      {!isMobile && <FloatingParticles count={8} />}

      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Hero */}
      <section className="relative z-10 min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="relative max-w-7xl mx-auto w-full">
          <div
            className={`grid gap-10 lg:gap-14 lg:grid-cols-12 items-center transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Left: Text & CTA */}
            <div className="lg:col-span-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mb-4"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-white/8 border border-white/12 px-3 py-1.5 text-xs sm:text-sm text-slate-200 backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-medium">Portal perizinan internal IWARE</span>
                  <span className="hidden sm:inline text-slate-400">•</span>
                  <span className="hidden sm:inline text-slate-300">Untuk karyawan IWARE</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-4 leading-[1.05] tracking-tight">
                  Perizinan internal
                  <motion.span
                    className="block font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-orange-300 animate-gradient-shift"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          delayChildren: 0.25,
                          staggerChildren: 0.2,
                          ease: 'easeOut',
                        },
                      },
                    }}
                  >
                    {['cepat,', 'rapi,', 'dan', 'terukur'].map((word, idx) => (
                      <motion.span
                        key={word + idx}
                        className="inline-block mr-1"
                        variants={{
                          hidden: { opacity: 0, y: 14 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.45, ease: 'easeOut' },
                          },
                        }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-[44rem] leading-relaxed mx-auto">
                  Aplikasi ini dibuat khusus untuk kebutuhan operasional internal IWARE. Ajukan cuti/izin/sakit/lembur/dinas,
                  pantau status persetujuan, dan simpan riwayat secara terstruktur untuk kebutuhan rekap HR.
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
              >
                <Link to="/pengajuan-form" className="w-full sm:w-auto">
                  <button
                    className={`w-full sm:w-auto px-8 py-3.5 bg-red-600 text-white rounded-xl font-semibold text-[15px] sm:text-base transition-all duration-200 shadow-sm shadow-red-600/20 ${
                      !isMobile ? 'hover:bg-red-700 hover:shadow-md hover:shadow-red-600/25' : ''
                    }`}
                  >
                    Buat Pengajuan
                  </button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <button
                    className={`w-full sm:w-auto px-8 py-3.5 bg-white/5 border border-white/20 text-white rounded-xl font-semibold text-[15px] sm:text-base transition-all duration-200 ${
                      !isMobile ? 'hover:bg-white/10 hover:border-white/30' : ''
                    }`}
                  >
                    Masuk Portal
                  </button>
                </Link>
              </motion.div>

              {/* Micro trust */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.7 }}
                className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto"
              >
                {[
                  { k: 'Tertib', v: 'Alur & status jelas' },
                  { k: 'Terkontrol', v: 'Sesuai kebijakan IWARE' },
                  { k: 'Terdokumentasi', v: 'Riwayat siap rekap' },
                ].map((it) => (
                  <div key={it.k} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 backdrop-blur-sm">
                    <div className="text-sm font-semibold text-white">{it.k}</div>
                    <div className="text-xs text-slate-400 mt-1">{it.v}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Trusted strip + jenis perizinan */}
          <div className="mt-10 sm:mt-12 space-y-4">
            <Card className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-1">
                  Standar internal IWARE
                </p>
                <p className="text-sm text-slate-300">
                  HR/GA memantau seluruh pengajuan cuti, izin, lembur, dan dinas dalam satu dashboard internal yang terpusat.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                {['Karyawan', 'Atasan', 'HR/GA', 'Admin'].map((t) => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    {t}
                  </span>
                ))}
              </div>
            </Card>
            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
              {['Cuti', 'Sakit', 'Dinas Luar', 'Pulang Setengah Hari', 'Datang Terlambat', 'Izin Keluar Kantor'].map((t) => (
                <span key={t} className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Premium Cards */}
      <section ref={featuresRef} className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-14 sm:mb-16 transition-all duration-1000 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Ringkas, jelas, dan sesuai kebutuhan internal
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
              Dibuat untuk membantu karyawan mengajukan perizinan dengan cepat, dan membantu HR/GA melakukan rekap dengan akurat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Pengajuan Cepat', desc: 'Buat pengajuan cuti/izin/lembur/dinas dengan format yang terstandar.', delay: 0 },
              { title: 'Status Jelas', desc: 'Pantau status (menunggu, disetujui, ditolak) beserta catatan bila ada.', delay: 0.1 },
              { title: 'Riwayat Terpusat', desc: 'Semua pengajuan tersimpan rapi dan mudah ditelusuri kembali.', delay: 0.2 },
              { title: 'Rekap HR/GA', desc: 'Mempermudah rekap periodik untuk kebutuhan administrasi internal.', delay: 0.3 }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: feature.delay, duration: 0.5 }}
              >
                <Card className={`p-6 h-full transition-all duration-300 bg-white/5 ${!isMobile ? 'hover:bg-white/[0.08] hover:border-white/20 hover:shadow-lg hover:shadow-white/5 hover:-translate-y-1' : ''}`}>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* Why Choose Us Section */}
      <section className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Kenapa pakai portal ini
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
              Karena alurnya dibuat sesuai proses internal IWARE: lebih jelas, terdokumentasi, dan mudah dipantau.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Lebih ringkas',
                desc: 'Format pengajuan konsisten, tidak perlu bolak-balik chat untuk detail yang sama.'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Akses terkontrol',
                desc: 'Hak akses mengikuti role internal (karyawan, atasan, HR/GA, admin).'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Lebih mudah direkap',
                desc: 'Riwayat tersimpan rapi untuk kebutuhan rekap bulanan dan audit internal.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className={`p-6 transition-all duration-300 bg-white/[0.02] ${!isMobile ? 'hover:-translate-y-2 hover:bg-white/[0.04]' : ''}`}>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600/10 border border-red-600/20 rounded-xl text-red-500 mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* How It Works Section */}
      <section className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Cara Kerja
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
              Proses sederhana sesuai alur internal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection Line */}
            {!isMobile && (
              <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600/20 via-red-600/40 to-red-600/20 hidden md:block"></div>
            )}
            
            {[
              { step: '01', title: 'Masuk Portal', desc: 'Gunakan akun internal untuk mengakses sistem' },
              { step: '02', title: 'Buat Pengajuan', desc: 'Isi jenis perizinan, tanggal, dan alasan dengan jelas' },
              { step: '03', title: 'Review & Approval', desc: 'Atasan/HR meninjau sesuai kebijakan yang berlaku' },
              { step: '04', title: 'Arsip & Rekap', desc: 'Riwayat tersimpan untuk kebutuhan rekap internal' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative"
              >
                <Card className="p-6 text-center bg-white/[0.02]">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-full text-white font-bold text-2xl mb-4 shadow-lg shadow-red-600/30 relative z-10">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* FAQ */}
      <section className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Pertanyaan yang sering ditanyakan
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
              Jawaban singkat untuk penggunaan portal internal IWARE.
            </p>
          </div>

          <div className="space-y-3 max-w-5xl mx-auto">
            {[
              {
                q: 'Siapa yang bisa menggunakan portal ini?',
                a: 'Portal ini khusus untuk karyawan/pegawai IWARE dan pihak internal terkait (atasan, HR/GA, admin).'
              },
              {
                q: 'Bagaimana cara mengajukan cuti/izin?',
                a: 'Buka menu pengajuan, pilih jenis perizinan, isi tanggal dan alasan. Jika diperlukan, lampirkan bukti sesuai ketentuan.'
              },
              {
                q: 'Kenapa pengajuan saya belum diproses?',
                a: 'Pastikan data sudah lengkap. Setelah itu, pengajuan menunggu review sesuai alur internal (atasan/HR).'
              },
              {
                q: 'Apakah lampiran (foto/surat) wajib?',
                a: 'Untuk jenis tertentu (mis. sakit/dinas luar) lampiran bisa diwajibkan agar verifikasi lebih cepat dan sesuai kebijakan.'
              }
            ].map((item, idx) => {
              const open = faqOpen === idx;
              return (
                <Card
                  key={item.q}
                  className={`bg-white/5 overflow-hidden transition-colors ${!isMobile ? 'hover:bg-white/[0.07]' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpen(open ? -1 : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                  >
                    <span className="text-sm sm:text-base font-semibold text-white">{item.q}</span>
                    <span className={`shrink-0 text-slate-300 transition-transform ${open ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </button>
                  {open && (
                    <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* CTA Section - Premium */}
      <section className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="rounded-3xl bg-white/5 p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Siap digunakan untuk operasional internal
              </h2>
              <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
                Mulai dari pengajuan hingga arsip. Dibuat agar alur perizinan IWARE lebih tertib dan mudah dipantau.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link to="/pengajuan-form" className="w-full sm:w-auto">
                <button className={`w-full sm:w-auto px-8 py-3.5 bg-red-600 text-white rounded-xl font-semibold text-[15px] sm:text-base transition-all duration-200 shadow-sm shadow-red-600/20 ${!isMobile ? 'hover:bg-red-700 hover:shadow-md hover:shadow-red-600/25' : ''}`}>
                  Ajukan Perizinan
                </button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <button className={`w-full sm:w-auto px-8 py-3.5 bg-white/5 border border-white/15 text-white rounded-xl font-semibold text-[15px] sm:text-base transition-all duration-200 ${!isMobile ? 'hover:bg-white/10 hover:border-white/25' : ''}`}>
                  Masuk Dashboard
                </button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Home;
