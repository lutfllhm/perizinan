import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { FiClock, FiCalendar, FiCheckCircle, FiArrowRight, FiZap, FiShield, FiTrendingUp } from 'react-icons/fi';

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
      deskripsi: 'Ajukan perizinan cuti atau lembur dengan cepat dan mudah',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      ikon: <FiCalendar className="text-5xl" />,
      judul: 'Fleksibel',
      deskripsi: 'Atur jadwal cuti atau lembur sesuai kebutuhan Anda',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      ikon: <FiCheckCircle className="text-5xl" />,
      judul: 'Transparan',
      deskripsi: 'Pantau status pengajuan Anda secara real-time',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  const statistik = [
    { angka: '500+', label: 'Pengajuan Diproses', ikon: <FiTrendingUp /> },
    { angka: '98%', label: 'Tingkat Kepuasan', ikon: <FiCheckCircle /> },
    { angka: '24/7', label: 'Akses Sistem', ikon: <FiShield /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      <Navbar />
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400 to-blue-400 rounded-full blur-3xl"
        />
      </div>

      {/* Bagian Hero */}
      <section className="relative pt-32 pb-20 px-4">
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
                <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold rounded-full shadow-lg">
                  ✨ Sistem Terpercaya & Modern
                </span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 mb-6 leading-tight">
                Sistem Perizinan
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Cuti & Lembur
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Kelola pengajuan cuti dan lembur dengan mudah, cepat, dan efisien. 
                Sistem terintegrasi untuk kemudahan manajemen SDM yang modern.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Link to="/ajukan">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
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
                    className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-800 rounded-xl text-lg font-bold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 shadow-lg"
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
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-blue-600 mb-1">{item.angka}</div>
                    <div className="text-xs text-gray-600">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 z-10" />
                
                {/* Image Slider */}
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
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl max-w-xs"
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
      <section className="relative py-24 px-4 bg-white">
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
              className="inline-block px-4 py-2 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full mb-4"
            >
              Keunggulan Kami
            </motion.span>
            <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-600 mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Solusi terbaik untuk manajemen perizinan yang efisien dan modern
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {fitur.map((item, indeks) => (
              <motion.div
                key={indeks}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: indeks * 0.15, duration: 0.5 }}
                whileHover={{ y: -15, scale: 1.02 }}
                className="group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />
                
                {/* Icon Container */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-2xl mb-6 shadow-lg`}
                >
                  <div className="text-white">{item.ikon}</div>
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {item.judul}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.deskripsi}</p>
                
                {/* Decorative Corner */}
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  whileInView={{ scale: 1, rotate: 45 }}
                  viewport={{ once: true }}
                  transition={{ delay: indeks * 0.15 + 0.3 }}
                  className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-50"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bagian Ajakan */}
      <section className="relative py-24 px-4 overflow-hidden">
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
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-4">
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
  );
};

export default Home;
