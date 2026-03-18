import React from 'react';
import Navbar from '../components/Navbar.jsx';
import PhotoBackground from '../components/layout/PhotoBackground.jsx';
import Card from '../components/ui/Card.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

export default function KebijakanPrivasi() {
  return (
    <PhotoBackground>
      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="relative z-10 px-4 sm:px-6 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 sm:p-8 bg-slate-900/70">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Kebijakan Privasi</h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Dokumen ini menjelaskan bagaimana IWARE mengumpulkan, menggunakan, dan melindungi data yang diproses
              dalam sistem perizinan.
            </p>

            <div className="mt-6 space-y-4 text-sm text-slate-400 leading-relaxed">
              <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white mb-1">Data yang diproses</div>
                <div>
                  Data profil karyawan (mis. nama, NIK/ID internal), data pengajuan (jenis, tanggal, alasan), dan lampiran
                  (jika diwajibkan) untuk verifikasi.
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white mb-1">Tujuan penggunaan</div>
                <div>
                  Untuk memfasilitasi alur pengajuan-persetujuan, penyimpanan arsip, pelaporan, dan peningkatan layanan
                  (mis. stabilitas dan keamanan).
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white mb-1">Keamanan</div>
                <div>
                  Kami menerapkan kontrol akses berbasis role, pencatatan aktivitas (audit trail) bila tersedia, dan praktik
                  keamanan aplikasi untuk meminimalkan risiko akses tidak sah.
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white mb-1">Retensi & penghapusan</div>
                <div>
                  Retensi mengikuti kebijakan perusahaan/instansi. Penghapusan data dilakukan sesuai prosedur dan otorisasi
                  yang berlaku.
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white mb-1">Kontak</div>
                <div>
                  Jika ada pertanyaan terkait privasi, hubungi{' '}
                  <a className="text-slate-200 hover:text-white underline underline-offset-4" href="mailto:support@iware.id">
                    support@iware.id
                  </a>
                  .
                </div>
              </section>
            </div>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </PhotoBackground>
  );
}

