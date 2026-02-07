import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { pengajuanAPI, karyawanAPI } from '../utils/api';
import { FiUser, FiPhone, FiCalendar, FiUpload, FiSend, FiX, FiMapPin, FiBriefcase, FiAlertCircle } from 'react-icons/fi';

// Data Master Kantor
const daftarKantor = [
  'RBM-IWARE SURABAYA',
  'SBA-WMP',
  'RBM-IWARE JAKARTA',
  'ILUMINDO',
  'RBM - LABEL',
  'ALGOO',
  'RBM - IWARE BALI',
  'RBM-IWARE JOGJA'
];

const PengajuanForm = () => {
  const navigasi = useNavigate();
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [dataForm, setDataForm] = useState({
    kantor: '',
    karyawan_id: '',
    nama: '',
    jabatan: '',
    departemen: '',
    no_telp: '',
    jenis_perizinan: 'cuti',
    tanggal_mulai: '',
    tanggal_selesai: '',
    bukti_foto: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [daftarKaryawan, setDaftarKaryawan] = useState([]);
  const [quotaInfo, setQuotaInfo] = useState(null);
  const [loadingQuota, setLoadingQuota] = useState(false);

  const jenisPerizinan = [
    { value: 'cuti', label: 'Cuti' },
    { value: 'lembur', label: 'Lembur' },
    { value: 'sakit', label: 'Sakit' },
    { value: 'dinas_luar', label: 'Dinas Luar' },
    { value: 'pulang_cepat', label: 'Pulang Lebih Awal' },
    { value: 'datang_terlambat', label: 'Datang Terlambat' },
    { value: 'lainnya', label: 'Lainnya' }
  ];

  // Fetch karyawan ketika kantor berubah
  useEffect(() => {
    if (dataForm.kantor) {
      fetchKaryawan(dataForm.kantor);
    } else {
      setDaftarKaryawan([]);
      setDataForm(prev => ({
        ...prev,
        karyawan_id: '',
        nama: '',
        jabatan: '',
        departemen: '',
        no_telp: ''
      }));
      setQuotaInfo(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataForm.kantor]);

  // Fetch quota ketika karyawan dipilih
  useEffect(() => {
    if (dataForm.karyawan_id) {
      fetchQuota(dataForm.karyawan_id);
    } else {
      setQuotaInfo(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataForm.karyawan_id]);

  const fetchKaryawan = async (kantor) => {
    try {
      const response = await karyawanAPI.getAll({ kantor, status: 'aktif' });
      setDaftarKaryawan(response.data);
    } catch (error) {
      console.error('Error fetching karyawan:', error);
      toast.error('Gagal memuat data karyawan');
    }
  };

  const fetchQuota = async (karyawanId) => {
    setLoadingQuota(true);
    try {
      const response = await karyawanAPI.getQuota(karyawanId);
      setQuotaInfo(response.data);
    } catch (error) {
      console.error('Error fetching quota:', error);
    } finally {
      setLoadingQuota(false);
    }
  };

  // Auto-fill data ketika karyawan dipilih
  const handleKaryawanChange = (karyawanId) => {
    const karyawan = daftarKaryawan.find(k => k.id === parseInt(karyawanId));
    if (karyawan) {
      setDataForm(prev => ({
        ...prev,
        karyawan_id: karyawan.id,
        nama: karyawan.nama,
        jabatan: karyawan.jabatan,
        departemen: karyawan.departemen,
        no_telp: karyawan.no_telp || prev.no_telp
      }));
    }
  };

  const tanganiPerubahanFile = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }
    setDataForm({ ...dataForm, bukti_foto: file });
    
    // Preview image
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const tanganiSubmit = async (e) => {
    e.preventDefault();

    // Validasi dinas luar harus ada foto
    if (dataForm.jenis_perizinan === 'dinas_luar' && !dataForm.bukti_foto) {
      toast.error('Dinas luar wajib melampirkan bukti foto');
      return;
    }

    // Validasi quota
    if (quotaInfo) {
      if (dataForm.jenis_perizinan === 'pulang_cepat' && quotaInfo.pulang_cepat >= 3) {
        toast.error('Quota pulang cepat bulan ini sudah habis (maksimal 3x)');
        return;
      }
      if (dataForm.jenis_perizinan === 'datang_terlambat' && quotaInfo.datang_terlambat >= 3) {
        toast.error('Quota datang terlambat bulan ini sudah habis (maksimal 3x)');
        return;
      }
      if (dataForm.jenis_perizinan === 'cuti' && quotaInfo.sisa_cuti <= 0) {
        toast.error('Sisa cuti Anda sudah habis');
        return;
      }
    }

    setSedangMemuat(true);

    const data = new FormData();
    Object.keys(dataForm).forEach(kunci => {
      if (dataForm[kunci]) {
        data.append(kunci, dataForm[kunci]);
      }
    });

    try {
      await pengajuanAPI.submit(data);
      toast.success('Pengajuan berhasil dikirim! Silakan tunggu konfirmasi dari HRD.');
      navigasi('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengirim pengajuan');
    } finally {
      setSedangMemuat(false);
    }
  };

  // Cek apakah jenis perizinan memerlukan foto wajib
  const isFotoWajib = dataForm.jenis_perizinan === 'dinas_luar';

  // Hitung sisa quota
  const sisaPulangCepat = quotaInfo ? 3 - quotaInfo.pulang_cepat : 3;
  const sisaDatangTerlambat = quotaInfo ? 3 - quotaInfo.datang_terlambat : 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 sm:py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Form Pengajuan</h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Isi formulir di bawah ini dengan lengkap</p>
          </div>

          <form onSubmit={tanganiSubmit} className="space-y-4 sm:space-y-6">
            {/* 1. KANTOR */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiMapPin className="inline mr-2" />
                Kantor <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={dataForm.kantor}
                onChange={(e) => setDataForm({ ...dataForm, kantor: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-base"
              >
                <option value="">-- Pilih Kantor --</option>
                {daftarKantor.map(kantor => (
                  <option key={kantor} value={kantor}>
                    {kantor}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. NAMA KARYAWAN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiUser className="inline mr-2" />
                Nama Karyawan <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={dataForm.karyawan_id}
                onChange={(e) => handleKaryawanChange(e.target.value)}
                disabled={!dataForm.kantor}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {dataForm.kantor ? '-- Pilih Nama Karyawan --' : '-- Pilih Kantor Terlebih Dahulu --'}
                </option>
                {daftarKaryawan.map((karyawan) => (
                  <option key={karyawan.id} value={karyawan.id}>
                    {karyawan.nama} - {karyawan.jabatan}
                  </option>
                ))}
              </select>
              {!dataForm.kantor && (
                <p className="text-xs text-gray-500 mt-1">Pilih kantor terlebih dahulu</p>
              )}
            </div>

            {/* 3. JABATAN - Auto-fill */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiBriefcase className="inline mr-2" />
                Jabatan
              </label>
              <input
                type="text"
                value={dataForm.jabatan}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed text-base"
                placeholder="Otomatis terisi setelah pilih nama"
              />
            </div>

            {/* 4. DEPARTEMEN - Auto-fill */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiBriefcase className="inline mr-2" />
                Departemen
              </label>
              <input
                type="text"
                value={dataForm.departemen}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed text-base"
                placeholder="Otomatis terisi setelah pilih nama"
              />
            </div>

            {/* 5. NO TELP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiPhone className="inline mr-2" />
                No. Telp/WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={dataForm.no_telp}
                onChange={(e) => setDataForm({ ...dataForm, no_telp: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-base"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            {/* 6. JENIS PERIZINAN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Perizinan <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={dataForm.jenis_perizinan}
                onChange={(e) => setDataForm({ ...dataForm, jenis_perizinan: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-base"
              >
                {jenisPerizinan.map(jenis => (
                  <option key={jenis.value} value={jenis.value}>
                    {jenis.label}
                  </option>
                ))}
              </select>

              {/* Info Quota */}
              {quotaInfo && !loadingQuota && (
                <div className="mt-3 space-y-2">
                  {dataForm.jenis_perizinan === 'cuti' && (
                    <div className={`p-3 rounded-lg border ${quotaInfo.sisa_cuti > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <p className="text-sm font-semibold text-gray-700">
                        📅 Sisa Cuti: <span className={quotaInfo.sisa_cuti > 0 ? 'text-green-600' : 'text-red-600'}>{quotaInfo.sisa_cuti} hari</span> (Tahun {quotaInfo.tahun_cuti})
                      </p>
                    </div>
                  )}
                  {dataForm.jenis_perizinan === 'pulang_cepat' && (
                    <div className={`p-3 rounded-lg border ${sisaPulangCepat > 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
                      <p className="text-sm font-semibold text-gray-700">
                        🏃 Sisa Pulang Cepat Bulan Ini: <span className={sisaPulangCepat > 0 ? 'text-blue-600' : 'text-red-600'}>{sisaPulangCepat}x</span> dari 3x
                      </p>
                    </div>
                  )}
                  {dataForm.jenis_perizinan === 'datang_terlambat' && (
                    <div className={`p-3 rounded-lg border ${sisaDatangTerlambat > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                      <p className="text-sm font-semibold text-gray-700">
                        ⏰ Sisa Datang Terlambat Bulan Ini: <span className={sisaDatangTerlambat > 0 ? 'text-yellow-600' : 'text-red-600'}>{sisaDatangTerlambat}x</span> dari 3x
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 7. TANGGAL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline mr-2" />
                  Tanggal & Jam Mulai <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={dataForm.tanggal_mulai}
                  onChange={(e) => setDataForm({ ...dataForm, tanggal_mulai: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline mr-2" />
                  Tanggal & Jam Selesai <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={dataForm.tanggal_selesai}
                  onChange={(e) => setDataForm({ ...dataForm, tanggal_selesai: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-base"
                />
              </div>
            </div>

            {/* 8. BUKTI FOTO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiUpload className="inline mr-2" />
                Bukti Foto {isFotoWajib && <span className="text-red-500">*</span>}
                {isFotoWajib && <span className="text-red-500 text-xs ml-2">(Wajib untuk Dinas Luar)</span>}
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  required={isFotoWajib}
                  onChange={tanganiPerubahanFile}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Format: JPG, PNG, PDF (Maks 5MB)</p>
              
              {/* Alert untuk Dinas Luar */}
              {dataForm.jenis_perizinan === 'dinas_luar' && (
                <div className="mt-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <div className="flex items-start">
                    <FiAlertCircle className="text-red-600 mt-0.5 mr-2 flex-shrink-0" size={18} />
                    <div>
                      <p className="text-sm font-semibold text-red-800 mb-1">
                        ⚠️ Perhatian!
                      </p>
                      <p className="text-sm text-red-700">
                        Untuk izin Dinas Luar, Anda WAJIB melampirkan bukti foto.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* WhatsApp Notification */}
              <div className="mt-3 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <div className="flex items-start">
                  <FiPhone className="text-green-600 mt-0.5 mr-2 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-sm font-semibold text-green-800 mb-1">
                      📱 Penting!
                    </p>
                    <p className="text-sm text-green-700">
                      Setelah Mengisi Form, Mohon Kirim Bukti Berupa Screenshot Ke Nomor WhatsApp HRD:
                    </p>
                    <a 
                      href="https://wa.me/6281249749282" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-sm font-bold text-green-600 hover:text-green-800 hover:underline transition-colors"
                    >
                      <FiPhone className="mr-1" size={14} />
                      +62 812-4974-9282
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Image Preview */}
              {previewImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 relative"
                >
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setDataForm({ ...dataForm, bukti_foto: null });
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FiX size={16} />
                  </button>
                </motion.div>
              )}
            </div>

            {/* SUBMIT BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={sedangMemuat}
                className="flex-1 flex items-center justify-center space-x-2 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 min-h-[48px]"
              >
                <FiSend />
                <span>{sedangMemuat ? 'Mengirim...' : 'Kirim Pengajuan'}</span>
              </motion.button>

              <Link to="/" className="flex-1">
                <button
                  type="button"
                  className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition min-h-[48px]"
                >
                  Batal
                </button>
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PengajuanForm;
