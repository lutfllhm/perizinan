import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import PhotoBackground from '../components/layout/PhotoBackground.jsx';
import Card from '../components/ui/Card.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

const FAQ_ITEMS = [
  {
    q: 'Apakah data karyawan harus ada di database?',
    a: 'Disarankan. Sistem akan lebih stabil jika karyawan tersimpan di tabel karyawan dan transaksi pengajuan menyimpan karyawan_id (serta snapshot nama bila diperlukan).',
  },
  {
    q: 'Kenapa nama karyawan tidak muncul di form pengajuan?',
    a: 'Biasanya karena API /api/karyawan tidak terhubung (API URL salah) atau tabel karyawan kosong. Pastikan backend berjalan dan data karyawan sudah terisi.',
  },
  {
    q: 'Bagaimana akses dashboard untuk HRD dan Admin?',
    a: 'Role di token/DB menentukan akses. Anda bisa mengatur agar HRD dan Admin masuk ke dashboard admin sesuai kebutuhan operasional.',
  },
  {
    q: 'Apakah bukti foto wajib?',
    a: 'Untuk jenis tertentu seperti Sakit (surat dokter) dan Dinas Luar, bukti foto bisa diwajibkan agar proses verifikasi lebih cepat.',
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <PhotoBackground>
      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="relative z-10 px-4 sm:px-6 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 sm:p-8 bg-slate-900/70">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">FAQ</h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Pertanyaan yang sering ditanyakan terkait penggunaan sistem perizinan.
            </p>

            <div className="mt-6 space-y-3">
              {FAQ_ITEMS.map((item, idx) => {
                const open = openIdx === idx;
                return (
                  <Card key={item.q} className="bg-white/5 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenIdx(open ? -1 : idx)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                    >
                      <span className="text-sm sm:text-base font-semibold text-white">{item.q}</span>
                      <span className={`shrink-0 text-slate-300 transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
                    </button>
                    {open && <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">{item.a}</div>}
                  </Card>
                );
              })}
            </div>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </PhotoBackground>
  );
}

