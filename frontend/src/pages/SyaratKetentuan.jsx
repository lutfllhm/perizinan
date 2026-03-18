import React from 'react';
import Navbar from '../components/Navbar.jsx';
import PhotoBackground from '../components/layout/PhotoBackground.jsx';
import Card from '../components/ui/Card.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

export default function SyaratKetentuan() {
  return (
    <PhotoBackground>
      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="relative z-10 px-4 sm:px-6 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 sm:p-8 bg-slate-900/70">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Syarat &amp; Ketentuan</h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Dengan menggunakan IWARE, pengguna menyetujui ketentuan berikut untuk memastikan sistem dipakai secara aman
              dan tertib.
            </p>

            <div className="mt-6 space-y-4 text-sm text-slate-400 leading-relaxed">
              <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white mb-1">Akun & akses</div>
                <div>
                  Pengguna bertanggung jawab menjaga kerahasiaan kredensial. Akses ditentukan oleh role (mis. Karyawan,
                  HRD, Admin) sesuai kebijakan perusahaan.
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white mb-1">Keakuratan data</div>
                <div>
                  Pengguna wajib mengisi data pengajuan dengan benar. Pengajuan yang tidak valid dapat ditolak atau
                  diminta perbaikan.
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white mb-1">Lampiran & verifikasi</div>
                <div>
                  Untuk jenis tertentu (mis. sakit/dinas luar), lampiran dapat diwajibkan. HRD/atasan berwenang melakukan
                  verifikasi sesuai SOP.
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white mb-1">Ketersediaan layanan</div>
                <div>
                  Kami berupaya menjaga layanan tetap tersedia, namun pemeliharaan/insiden dapat terjadi. Perubahan fitur
                  dapat dilakukan untuk peningkatan performa dan keamanan.
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white mb-1">Dukungan</div>
                <div>
                  Jika membutuhkan bantuan, hubungi{' '}
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

