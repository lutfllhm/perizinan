import React from 'react';
import { Link } from 'react-router-dom';

export default function SiteFooter() {
  const linkClass =
    'inline-flex w-fit hover:text-white transition-colors duration-200';

  return (
    <footer className="relative z-10 py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-slate-900/50 backdrop-blur-sm border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/img/logo.png"
                alt="IWARE Logo"
                className="h-8 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
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
              <li className="cursor-default">Pengajuan Cuti</li>
              <li className="cursor-default">Pengajuan Lembur</li>
              <li className="cursor-default">Tracking Status</li>
              <li className="cursor-default">Riwayat Perizinan</li>
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Perusahaan</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/tentang-kami" className={linkClass}>
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/kebijakan-privasi" className={linkClass}>
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link to="/syarat-ketentuan" className={linkClass}>
                  Syarat &amp; Ketentuan
                </Link>
              </li>
              <li>
                <Link to="/faq" className={linkClass}>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Kontak</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <span className="block text-xs text-slate-500 mb-1">Email</span>
                <a href="mailto:support@iware.id" className={linkClass}>
                  support@iware.id
                </a>
              </li>
              <li>
                <span className="block text-xs text-slate-500 mb-1">Telepon</span>
                <a href="tel:+622112345678" className={linkClass}>
                  +62 21 1234 5678
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm text-slate-500">&copy; 2026 IWARE. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-xs sm:text-sm text-slate-500">
            <Link to="/kebijakan-privasi" className={linkClass}>
              Privacy Policy
            </Link>
            <Link to="/syarat-ketentuan" className={linkClass}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

