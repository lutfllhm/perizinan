import React from 'react';
import Navbar from '../components/Navbar.jsx';
import PhotoBackground from '../components/layout/PhotoBackground.jsx';
import Card from '../components/ui/Card.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

export default function TentangKami() {
  return (
    <PhotoBackground>
      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="relative z-10 px-4 sm:px-6 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 sm:p-8 bg-slate-900/70">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Tentang Kami</h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              IWARE adalah sistem perizinan karyawan berbasis web untuk membantu perusahaan menstandarkan proses cuti,
              izin, lembur, dan dinas luar secara lebih cepat, rapi, dan transparan.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white mb-1">Misi</div>
                <div className="text-sm text-slate-400 leading-relaxed">
                  Mengurangi pekerjaan administratif manual dan meningkatkan akurasi data perizinan.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white mb-1">Nilai</div>
                <div className="text-sm text-slate-400 leading-relaxed">
                  Keamanan data, kemudahan penggunaan, dan visibilitas proses untuk semua pihak.
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white mb-1">Apa yang kami sediakan</div>
              <ul className="mt-2 space-y-2 text-sm text-slate-400">
                <li>- Form pengajuan yang cepat dan terstandar</li>
                <li>- Persetujuan (approval) yang jelas dengan status & catatan</li>
                <li>- Arsip, riwayat, dan rekap untuk kebutuhan audit</li>
              </ul>
            </div>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </PhotoBackground>
  );
}

