import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { FiCalendar, FiCheckCircle, FiArrowRight, FiZap, FiShield, FiTrendingUp, FiUsers, FiAward } from 'react-icons/fi';

const Home = () => {
  const [gambarSaatIni, setGambarSaatIni] = useState(1);
  const gambar = [1, 2, 4, 5];
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGambarSaatIni((prev) => (prev % gambar.length) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fitur = [
    {
      ikon: <FiZap className="text-5xl" />,
      judul: 'Cepat & Mudah',
      deskripsi: 'Ajukan perizinan cuti atau lembur dengan cepat dan mudah dalam hitungan menit',
      gradient: 'from-blue-500 to-cyan-500',
      delay: 0
    },
    {
      ikon: <FiCalendar className="text-5xl" />,
      judul: 'Fleksibel',
      deskripsi: 'Atur jadwal cuti atau lembur sesuai kebutuhan Anda dengan sistem yang adaptif',
      gradient: 'from-purple-500 to-pink-500',
      delay: 0.15
    },
    {
      ikon: <FiCheckCircle className="text-5xl" />,
      judul: 'Transparan',
      deskripsi: 'Pantau status pengajuan Anda secara real-time dengan notifikasi otomatis',
      gradient: 'from-green-500 to-emerald-500',
      delay: 0.3
    }
  ];

  const statistik = [
    { angka: '500+', label: 'Pengajuan Diproses', ikon: <FiTrendingUp /> },
    { angka: '98%', label: 'Tingkat Kepuasan', ikon: <FiCheckCircle /> },
    { angka: '24/7', label: 'Akses Sistem', ikon: <FiShield /> }
  ];

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden relative">
      {/* Background Image Slider with Overlay */}
      <div className="fixed inset-0 z-0">
        {gambar.map((num) => (
          <motion.div
            key={num}
            initial={{ opacity: 0 }}
            animate={{
              opacity: gambarSaatIni === num ? 1 : 0,
            }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            <img
              src={`/img/${num}.jpeg`}
              alt={`Background ${num}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            {/* Dark Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900/90" />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-indigo-900/40" />
          </motion.div>
        ))}
      </div>

      {/* Floating Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400 to-blue-400 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Bagian Hero */}
      <section className="relative pt-32 pb-20 px-4 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              style={{ opacity, scale }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-4"
              >
                <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm">
                  ✨ Sistem Terpercaya & Modern
                </span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">
                Sistem Perizinan
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Cuti & Lembur
                </span>
              </h1>
              
              <p className="text-xl text-gray-100 mb-8 leading-relaxed drop-shadow-lg">
                Kelola pengajuan cuti dan lembur dengan mudah, cepat, dan efisien. 
                Sistem terintegrasi untuk kemudahan manajemen SDM yang modern.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Link to="/ajukan">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <span>Ajukan Sekarang</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-xl text-lg font-bold hover:bg-white/20 transition-all duration-300 shadow-lg"
                  >
                    Login Staff
                  </motion.button>
                </Link>
              </div>

              {/* Statistik Mini */}
              <div className="grid grid-cols-3 gap-4">
                {statistik.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="text-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                  >
                    <div className="text-2xl font-bold text-white mb-1">{item.angka}</div>
                    <div className="text-xs text-gray-200">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-purple-600/30 z-10" />
                
                {/* Image Preview */}
                {gambar.map((num) => (
                  <motion.img
                    key={num}
                    src={`/img/${num}.jpeg`}
                    alt={`Perusahaan IWARE ${num}`}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{
                      opacity: gambarSaatIni === num ? 1 : 0,
                      scale: gambarSaatIni === num ? 1 : 1.1
                    }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                ))}
                
                {/* Decorative Elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-20 blur-2xl"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full opacity-20 blur-2xl"
                />
              </motion.div>
              
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ y: -5 }}
                className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-xs border border-white/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <FiCheckCircle className="text-white text-2xl" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">100%</div>
                    <div className="text-sm text-gray-600">Sistem Aman</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bagian Fitur */}
      <section className="relative py-24 px-4 bg-white/95 backdrop-blur-sm z-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block px-5 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-bold rounded-full mb-6 shadow-md"
            >
              ⚡ Keunggulan Kami
            </motion.span>
            <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 mb-6">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Solusi terbaik untuk manajemen perizinan yang efisien, modern, dan terpercaya untuk perusahaan Anda
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {fitur.map((item, indeks) => (
              <motion.div
                key={indeks}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item.delay, duration: 0.6, type: "spring" }}
                whileHover={{ y: -15, scale: 1.03 }}
                className="group relative bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
              >
                {/* Animated Gradient Background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                
                {/* Shine Effect */}
                <motion.div
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                
                {/* Icon Container */}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.15 }}
                  transition={{ duration: 0.5 }}
                  className={`relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${item.gradient} rounded-3xl mb-6 shadow-xl group-hover:shadow-2xl`}
                >
                  <div className="text-white">{item.ikon}</div>
                  
                  {/* Pulse Ring */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-3xl`}
                  />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  {item.judul}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base">{item.deskripsi}</p>
                
                {/* Decorative Elements */}
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  whileInView={{ scale: 1, rotate: 45 }}
                  viewport={{ once: true }}
                  transition={{ delay: item.delay + 0.3, type: "spring" }}
                  className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-40 blur-xl"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: item.delay + 0.4 }}
                  className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-cyan-100 to-blue-100 rounded-full opacity-30 blur-lg"
                />
              </motion.div>
            ))}
          </div>

          {/* Testimonial / Trust Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-12 shadow-lg"
          >
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <FiUsers className="text-3xl text-white" />
                </div>
                <h4 className="text-3xl font-bold text-gray-800 mb-2">1000+</h4>
                <p className="text-gray-600">Pengguna Aktif</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <FiAward className="text-3xl text-white" />
                </div>
                <h4 className="text-3xl font-bold text-gray-800 mb-2">5 Tahun</h4>
                <p className="text-gray-600">Pengalaman Terpercaya</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <FiShield className="text-3xl text-white" />
                </div>
                <h4 className="text-3xl font-bold text-gray-800 mb-2">100%</h4>
                <p className="text-gray-600">Data Aman & Terenkripsi</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bagian Ajakan */}
      <section className="relative py-24 px-4 overflow-hidden z-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl overflow-hidden">
            {/* Animated Background Pattern */}
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}
            />
            
            {/* Floating Orbs */}
            <motion.div
              animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
            />
            <motion.div
              animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
            />
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-block mb-6"
              >
                <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <FiZap className="text-5xl text-white" />
                </div>
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                Siap Mengajukan Perizinan?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Proses cepat dan mudah, hanya butuh beberapa menit. Mulai sekarang dan rasakan kemudahannya!
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/ajukan">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-10 py-5 bg-white text-blue-600 rounded-xl text-lg font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl"
                  >
                    <span className="flex items-center space-x-2">
                      <span>Mulai Pengajuan</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    </span>
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl text-lg font-bold hover:bg-white/20 transition-all"
                  >
                    Lihat Status
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gray-900/95 backdrop-blur-sm text-white py-12 px-4 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                IWARE
              </h3>
              <p className="text-gray-400">
                Sistem perizinan modern untuk manajemen SDM yang efisien dan terpercaya.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Pengajuan Cuti</li>
                <li className="hover:text-white transition-colors cursor-pointer">Pengajuan Lembur</li>
                <li className="hover:text-white transition-colors cursor-pointer">Tracking Status</li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@iware.com</li>
                <li>Telepon: (021) 1234-5678</li>
                <li>Alamat: Jakarta, Indonesia</li>
              </ul>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="border-t border-gray-700 pt-8 text-center text-gray-400"
          >
            <p>&copy; 2026 IWARE. Hak Cipta Dilindungi. Dibuat dengan ❤️ untuk kemudahan Anda.</p>
          </motion.div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default Home;
