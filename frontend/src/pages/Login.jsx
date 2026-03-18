import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../utils/api';
import { FiUser, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { LoadingDots } from '../components/LoadingSpinner';
import Card from '../components/ui/Card';

function decodeJwtPayload(token) {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const Login = () => {
  const [dataForm, setDataForm] = useState({ username: '', password: '' });
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigasi = useNavigate();

  const tanganiSubmit = async (e) => {
    e.preventDefault();
    setSedangMemuat(true);

    try {
      const respons = await authAPI.login(dataForm);
      const { token, user } = respons.data;

      // Normalize role across different DB schemas:
      // If role is missing in DB/token, default to 'hrd' so user can still access dashboard
      const roleLower = (user?.role || '').trim().toLowerCase();
      const payload = token ? decodeJwtPayload(token) : null;
      const roleFromToken = (payload?.role || '').trim().toLowerCase();
      const rawRole = roleLower || roleFromToken;
      const fallbackRole = rawRole || 'hrd';
      const normalizedRole = fallbackRole;

      localStorage.setItem('token', token);
      localStorage.setItem('role', normalizedRole);
      localStorage.setItem('username', user.username);
      localStorage.setItem('nama', user.nama);

      toast.success(`Selamat datang, ${user.nama}!`);

      if (normalizedRole === 'admin' || normalizedRole === 'superadmin') {
        navigasi('/admin', { replace: true });
      } else if (normalizedRole === 'hrd') {
        navigasi('/hrd', { replace: true });
      } else {
        navigasi('/', { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login gagal');
    } finally {
      setSedangMemuat(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background - konsisten dengan homepage */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/img/bg.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-gray-900/45 to-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link to="/" className="inline-block mb-6">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              <FiArrowLeft />
              <span>Kembali</span>
            </motion.button>
          </Link>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg p-2">
                  <img 
                    src="/img/logo.png" 
                    alt="IWARE Logo" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <h1 className="text-3xl font-bold text-white">
                  IWARE
                </h1>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Login Staff</h2>
              <p className="text-sm sm:text-base text-slate-400">Masuk untuk mengakses dashboard perizinan</p>
            </div>

            {/* Form */}
            <form onSubmit={tanganiSubmit} className="space-y-5">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className={`text-lg transition-colors duration-300 ${
                      focusedField === 'username' ? 'text-red-400' : 'text-slate-400'
                    }`} />
                  </div>
                  <input
                    type="text"
                    required
                    value={dataForm.username}
                    onChange={(e) => setDataForm({ ...dataForm, username: e.target.value })}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 outline-none"
                    placeholder="Masukkan username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className={`text-lg transition-colors duration-300 ${
                      focusedField === 'password' ? 'text-red-400' : 'text-slate-400'
                    }`} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={dataForm.password}
                    onChange={(e) => setDataForm({ ...dataForm, password: e.target.value })}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 outline-none"
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-red-400 transition-colors duration-300"
                  >
                    {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sedangMemuat}
                className="w-full py-3.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
              >
                {sedangMemuat ? <LoadingDots text="Memproses" /> : 'Masuk'}
              </button>
            </form>

            {/* Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                Belum punya akun?{' '}
                <Link to="/pengajuan-form" className="text-red-400 hover:text-red-300 font-medium transition-colors duration-300">
                  Ajukan Perizinan
                </Link>
              </p>
            </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
