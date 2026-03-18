import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiLogIn, FiFileText } from 'react-icons/fi';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/img/logo.png" alt="IWARE Logo" className="h-9 w-auto" onError={(e) => {
                e.target.style.display = 'none';
              }} />
              <span className="text-xl font-semibold text-white">IWARE</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {!isLoggedIn ? (
              <>
                <Link to="/pengajuan-form">
                  <button className="flex items-center space-x-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                    <FiFileText size={18} />
                    <span className="font-medium">Ajukan Pengajuan</span>
                  </button>
                </Link>
                <Link to="/login">
                  <button className="flex items-center space-x-2 px-5 py-2 bg-white/5 border border-white/20 text-white rounded-lg hover:bg-white/10 hover:border-white/30 transition-all duration-200">
                    <FiLogIn size={18} />
                    <span className="font-medium">Login</span>
                  </button>
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-slate-900/98 backdrop-blur-md border-t border-white/10"
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            {!isLoggedIn ? (
              <>
                <Link to="/pengajuan-form" onClick={() => setIsOpen(false)}>
                  <button className="w-full flex items-center space-x-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium">
                    <FiFileText size={18} />
                    <span>Ajukan Pengajuan</span>
                  </button>
                </Link>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full flex items-center space-x-2 px-4 py-2.5 bg-white/5 border border-white/20 text-white rounded-lg font-medium">
                    <FiLogIn size={18} />
                    <span>Login</span>
                  </button>
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
