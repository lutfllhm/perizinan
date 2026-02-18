import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../utils/api';
import { FiUser, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { LoadingDots } from '../components/LoadingSpinner';
import CharacterAnimation from '../components/CharacterAnimation';

const Login = () => {
  const [dataForm, setDataForm] = useState({ username: '', password: '' });
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [currentAnimation, setCurrentAnimation] = useState(0);
  const navigasi = useNavigate();

  // Animation scenarios
  const animations = [
    {
      type: 'sick',
      title: 'Cuti Sakit',
      description: 'Istirahat untuk pemulihan kesehatan',
      color: 'from-red-500 to-pink-500'
    },
    {
      type: 'vacation',
      title: 'Cuti Tahunan',
      description: 'Waktu untuk refreshing dan keluarga',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      type: 'early',
      title: 'Pulang Cepat',
      description: 'Keperluan mendesak di rumah',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      type: 'late',
      title: 'Datang Terlambat',
      description: 'Kendala perjalanan atau keperluan',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      type: 'wfh',
      title: 'Work From Home',
      description: 'Bekerja dari rumah dengan produktif',
      color: 'from-green-500 to-teal-500'
    }
  ];

  // Auto-rotate animations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % animations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const tanganiSubmit = async (e) => {
    e.preventDefault();
    setSedangMemuat(true);

    try {
      const respons = await authAPI.login(dataForm);
      const { token, user } = respons.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('username', user.username);
      localStorage.setItem('nama', user.nama);

      toast.success(`Selamat datang, ${user.nama}!`);

      if (user.role === 'admin') {
        navigasi('/admin');
      } else {
        navigasi('/hrd');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login gagal');
    } finally {
      setSedangMemuat(false);
    }
  };

  const currentAnim = animations[currentAnimation];

  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-50">
      {/* Left Side - Animation Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Professional Dark Background Pattern */}
        <div className="absolute inset-0">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* Floating Orbs - Darker and more subtle */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute rounded-full bg-blue-500/5 backdrop-blur-sm"
              style={{
                width: `${Math.random() * 150 + 100}px`,
                height: `${Math.random() * 150 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 50 - 25, 0],
                y: [0, Math.random() * 50 - 25, 0],
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          {/* Logo/Brand with Icon */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 flex items-center gap-4"
          >
            {/* Logo Image */}
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl p-2">
              <img 
                src="/img/logo.png" 
                alt="IWARE Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-5xl font-bold">IWARE</h1>
              <p className="text-xl text-slate-300">Sistem Perizinan Karyawan</p>
            </div>
          </motion.div>

          {/* Character and Info Side by Side */}
          <div className="flex items-center justify-center gap-8 mb-16 w-full max-w-4xl px-6">
            {/* Animated Character */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAnimation}
                initial={{ opacity: 0, scale: 0.8, x: -50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 50 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0"
              >
                <CharacterAnimation type={currentAnim.type} />
              </motion.div>
            </AnimatePresence>

            {/* Animation Info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAnimation}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="flex-1 text-left"
              >
                <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-slate-700/50">
                  <h3 className="text-4xl font-bold mb-4 text-white">{currentAnim.title}</h3>
                  <p className="text-xl text-slate-200 leading-relaxed">{currentAnim.description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Animation Indicators */}
          <div className="flex space-x-3">
            {animations.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentAnimation(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentAnimation ? 'w-10 bg-blue-500' : 'w-2 bg-slate-600'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative bg-white">
        {/* Back Button */}
        <Link to="/" className="absolute top-6 left-6 z-50">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300"
          >
            <FiArrowLeft />
            <span>Kembali</span>
          </motion.button>
        </Link>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg p-1.5">
                <img 
                  src="/img/logo.png" 
                  alt="IWARE Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                IWARE
              </h1>
            </div>
            <p className="text-gray-600">Sistem Perizinan Karyawan</p>
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang Kembali</h2>
            <p className="text-gray-600">Masuk untuk melanjutkan ke dashboard</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={tanganiSubmit} className="space-y-6">
            {/* Username Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className={`text-xl transition-colors duration-300 ${
                    focusedField === 'username' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type="text"
                  required
                  value={dataForm.username}
                  onChange={(e) => setDataForm({ ...dataForm, username: e.target.value })}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-white transition-all duration-300 outline-none"
                  placeholder="Masukkan username"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className={`text-xl transition-colors duration-300 ${
                    focusedField === 'password' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={dataForm.password}
                  onChange={(e) => setDataForm({ ...dataForm, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-white transition-all duration-300 outline-none"
                  placeholder="Masukkan password"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors duration-300"
                >
                  {showPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
                </motion.button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={sedangMemuat}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 text-lg">
                  {sedangMemuat ? <LoadingDots text="Memproses" /> : 'Masuk'}
                </span>
              </motion.button>
            </motion.div>
          </form>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link to="/" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-300">
                Ajukan Perizinan
              </Link>
            </p>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-20 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-100 to-blue-100 rounded-full blur-3xl opacity-20 -z-10"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
