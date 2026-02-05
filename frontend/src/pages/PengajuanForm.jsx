import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { pengajuanAPI } from '../utils/api';
import { FiUser, FiPhone, FiCalendar, FiUpload, FiSend, FiX, FiMapPin, FiBriefcase } from 'react-icons/fi';

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

// Data Master Karyawan per Kantor
const dataKaryawan = {
    'RBM-IWARE SURABAYA': [
      { nama: 'Sugiharto Tjokro', jabatan: 'Owner', departemen: 'Direktur' },
      { nama: 'Djie Tince Muhaji (Tince)', jabatan: 'General Manager', departemen: 'Management' },
      { nama: 'Lisa Israti', jabatan: 'HRD', departemen: 'HRD' },
      { nama: 'Azza Diana Lailatul Afidah', jabatan: 'HR Rekrutmen', departemen: 'HRD' },
      { nama: 'Cahyo Novianto', jabatan: 'GA- Surabaya', departemen: 'GA' },
      { nama: 'Dewi Ambarwati', jabatan: 'Kasir', departemen: 'F.A.T. IWARE SURABAYA' },
      { nama: 'Junestia Vianjaningrum', jabatan: 'Taxx', departemen: 'F.A.T. IWARE SURABAYA' },
      { nama: 'Mei Cahyaningtyas', jabatan: 'Admin Pajak', departemen: 'F.A.T. IWARE SURABAYA' },
      { nama: 'Inge Kartika Sari', jabatan: 'Pembayaran Offline', departemen: 'F.A.T. IWARE SURABAYA' },
      { nama: 'Masbita Rusdiana Yunaini', jabatan: 'Accounting Tax', departemen: 'F.A.T. IWARE SURABAYA' },
      { nama: 'Dina Wijayanti', jabatan: 'Controller FAT', departemen: 'F.A.T. IWARE SURABAYA' },
      { nama: 'Aprillia Dwi Prastiwi', jabatan: 'Admin Import', departemen: 'Admin Import' },
      { nama: 'Anisa Nur Hidayati', jabatan: 'Accounting Tax Cakra & iLumindo', departemen: 'Accounting Tax ILUMINDO' },
      { nama: 'Astypuri Wijayanti', jabatan: 'Penagihan', departemen: 'Accounting' },
      { nama: 'Akhla Lailatus Shurur', jabatan: 'Tax', departemen: 'Accounting Tax' },
      { nama: 'Citra Utami', jabatan: 'Accounting Tax Temon', departemen: 'Accounting Tax WMP' },
      { nama: 'Agus Purnomo', jabatan: 'Sales Offline', departemen: 'Sales Offline' },
      { nama: 'Jimmy Matheus Pietrajaua S', jabatan: 'Sales Offline', departemen: 'Sales Offline' },
      { nama: 'Yudy Setiawan', jabatan: 'Sales Offline', departemen: 'Sales Offline' },
      { nama: 'Apsarini Ardiningrum Iswanto', jabatan: 'Sales Support', departemen: 'Sales support' },
      { nama: 'Sindy Chairunisa', jabatan: 'Data Analis', departemen: 'Analis' },
      { nama: 'Lutfillah Masduqi', jabatan: 'Web Developer', departemen: 'IT' },
      { nama: 'Asep Sugianto', jabatan: 'Admin Sales Online', departemen: 'Online' },
      { nama: 'Anti Faradyba Putri', jabatan: 'Admin Sales Online', departemen: 'Online' },
      { nama: 'Mujahidin', jabatan: 'Admin Sales Online', departemen: 'Online' },
      { nama: 'Rachmat Habiono', jabatan: 'Product Support', departemen: 'Product Support- Teknisi' },
      { nama: 'Ika Apriyanti', jabatan: 'Admin Sales Online', departemen: 'Admin Online Marketplace' },
      { nama: 'Rizky Azhari', jabatan: 'Admin Sales Online', departemen: 'Admin Online Marketplace' },
      { nama: 'Rachmad Ardianto', jabatan: 'Design Grafis - Offline', departemen: 'Design Grafis' },
      { nama: 'Dwi Intan Istifadah', jabatan: 'Sosial Media Spesialist', departemen: 'Online' },
      { nama: 'Nurussalamah', jabatan: 'Sosial Media Spesialist', departemen: 'Online' },
      { nama: 'Maratus Sholikhah (Lili)', jabatan: 'Talent/ Host Live Streaming', departemen: 'Online' },
      { nama: 'Adi Ayu Rani', jabatan: 'Design Grafis - Online', departemen: 'Design Grafis' },
      { nama: 'Firman Pradana', jabatan: 'Foto/videografer', departemen: 'Online' },
      { nama: 'Firman setiawan', jabatan: 'Staff', departemen: 'General' },
      { nama: 'Adi Wijaya', jabatan: 'Staff', departemen: 'General' },
      { nama: 'Christoper Hanjaya', jabatan: 'PIC', departemen: 'Digital Marketing' },
      { nama: 'Ali Mahfudz', jabatan: 'Product Support- Teknisi', departemen: 'TEKNISI' },
      { nama: 'Tondo Triono', jabatan: 'Talent/ Host Live Streaming', departemen: 'Online' },
      { nama: 'Moch Amin Tian', jabatan: 'Product Support- Teknisi', departemen: 'TEKNISI' },
      { nama: 'Dedy Setiawan', jabatan: 'Senior Teknisi', departemen: 'Product Support- Teknisi' },
      { nama: 'Muhammad Fatihul Huda', jabatan: 'Teknisi', departemen: 'Teknisi' },
      { nama: 'Devy Haryansari', jabatan: 'Admin Service', departemen: 'Teknisi' },
      { nama: 'El Nusa Putra Pratama', jabatan: 'Teknisi', departemen: 'Teknisi' },
      { nama: 'Sherly', jabatan: 'Admin Service', departemen: 'Teknisi' },
      { nama: 'Musyadi', jabatan: 'Teknisi GPS', departemen: 'GPS' },
      { nama: 'Aditya Pria Anggara', jabatan: 'Supir- Helper', departemen: 'Gudang' },
      { nama: 'Agung Widodo', jabatan: 'Helper', departemen: 'Gudang' },
      { nama: 'Iswie Christyano', jabatan: 'Helper', departemen: 'Gudang' },
      { nama: 'Amin Krestyawan', jabatan: 'Helper', departemen: 'Gudang' },
      { nama: 'Arif Gunawan', jabatan: 'Admin Gudang', departemen: 'Gudang' },
      { nama: 'Heri Triwiyono', jabatan: 'Admin GPS', departemen: 'GPS' },
      { nama: 'Rizki Nur Farhan', jabatan: 'Admin Gudang', departemen: 'Gudang' },
      { nama: 'Rohmad Syaifudin', jabatan: 'Helper- As Supir', departemen: 'Helper- Gudang' },
      { nama: 'Sarwo', jabatan: 'Helper', departemen: 'Helper- Gudang' },
      { nama: 'Samsul Mariono', jabatan: 'Helper', departemen: 'Gudang' },
      { nama: 'Kurniawan', jabatan: 'Helper', departemen: 'Gudang' },
      { nama: 'Mohammad Anas Marzuki', jabatan: 'Helper', departemen: 'Gudang' },
      { nama: 'Ricky Defteransyah', jabatan: 'Admin Gudang', departemen: 'GUudang- Admin Gudang' },
      { nama: 'Adenan Khohar', jabatan: 'Supir-Helper', departemen: 'Gudang' },
      { nama: 'Rahmad Anggi Noval Ariyanto', jabatan: 'Helper', departemen: 'Gudang' },
      { nama: 'Ardiansyah Fatkhurrohman', jabatan: 'Helper', departemen: 'Gudang' },
      { nama: 'Fahmi Rizal', jabatan: 'Helper', departemen: 'Gudang' },
      { nama: 'Syahrul Avis', jabatan: 'Helper', departemen: 'Gudang' },
      { nama: 'Saifudin Hikam', jabatan: 'Admin Gudang', departemen: 'Gudang' },
      { nama: 'Muchammad Harris', jabatan: 'Helper', departemen: 'Gudang' },
      { nama: 'Iful Yusro', jabatan: 'Admin Retur-Gudang', departemen: 'Gudang' },
      { nama: 'Ivan Dwi Saputra', jabatan: 'Helper', departemen: 'Gudang' },
      { nama: 'Nurul Farida', jabatan: 'Admin Nota', departemen: 'Gudang Surabaya' },
      { nama: 'Ong Erni Erawati', jabatan: 'Admin Nota', departemen: 'Gudang Surabaya' },
      { nama: 'Lucki Nata Aprilia', jabatan: 'Admin Nota', departemen: 'Gudang Surabaya' },
      { nama: 'Thomas Puji Adi Wiyarja', jabatan: 'Marketing Toko', departemen: 'Marketing' },
      { nama: 'Anjani Kusuma Wardani', jabatan: 'Admin Toko', departemen: 'Admin' },
      { nama: 'Umam', jabatan: 'Cleaning', departemen: 'Cleaning Service' },
      { nama: 'Saeful', jabatan: 'Cleaning', departemen: 'Cleaning Service' }
    ],
    'SBA-WMP': [
      { nama: 'Ali Usman', jabatan: 'Teknisi Mesin', departemen: 'SBA- WMP Surabaya' },
      { nama: 'Susanti', jabatan: 'Admin', departemen: 'SBA- WMP Surabaya' },
      { nama: 'Rika Rahayu', jabatan: 'Accounting Tax WMP', departemen: 'SBA- WMP Surabaya' },
      { nama: 'Wahyu Adji P.', jabatan: 'Marketing Online', departemen: 'SBA- WMP Surabaya' },
      { nama: 'Ratna', jabatan: 'Admin Import', departemen: 'SBA- WMP Surabaya' },
      { nama: 'Qisha Aulia Habbiballah', jabatan: 'Admin', departemen: 'SBA- WMP Semarang' },
      { nama: 'Andriyanto', jabatan: 'Teknisi Mesin', departemen: 'SBA- WMP Semarang' },
      { nama: 'Sunaryo', jabatan: 'Leader', departemen: 'SBA- WMP Semarang' },
      { nama: 'Muhammad LuthfiL KHAKIM', jabatan: 'Teknisi Mesin', departemen: 'SBA- WMP Semarang' },
      { nama: 'M. Wirawansyah', jabatan: 'Sales', departemen: 'SBA- WMP Semarang' },
      { nama: 'Adib Luthfi Adbillah', jabatan: 'Sales', departemen: 'SBA- WMP Semarang' },
      { nama: 'Abdullah Ubaid', jabatan: 'Admin Gudang', departemen: 'SBA- WMP Legundi' },
      { nama: 'Liem Sandra Salim', jabatan: 'Asisten Manager', departemen: 'SBA- WMP Legundi' },
      { nama: 'Ifmawan Arnanto', jabatan: 'Helper WMP', departemen: 'SBA- WMP Bumi Maspion' },
      { nama: 'Yachya', jabatan: 'Kepala Gudang', departemen: 'SBA- WMP Legundi' },
      { nama: 'Evelyne Greselda', jabatan: 'Admin', departemen: 'SBA- WMP Surabaya' },
      { nama: 'Ho Ming Hie', jabatan: 'Staff', departemen: 'SBA- WMP' },
      { nama: 'Hadi Siswanto', jabatan: 'Helper WMP', departemen: 'SBA- WMP Bumi Maspion' }
    ],
    'RBM-IWARE JAKARTA': [
      { nama: 'M. Hatob', jabatan: 'Driver', departemen: 'Gudang' },
      { nama: 'Robby', jabatan: 'TL Branch', departemen: 'Management' },
      { nama: 'Onan Dopong Duru', jabatan: 'Admin Gudang', departemen: 'Gudang' },
      { nama: 'Orlin Irma Dolinda Tnunai', jabatan: 'Admin Online', departemen: 'Admin' },
      { nama: 'Marliase Ismayassa', jabatan: 'Admin Online', departemen: 'Admin' },
      { nama: 'Budi Ansyah', jabatan: 'Admin Pengiriman', departemen: 'Admin' },
      { nama: 'Muhammad Purwanto', jabatan: 'Packing', departemen: 'Gudang' },
      { nama: "Saepul Ma'ruf", jabatan: 'Admin - Gudang', departemen: 'Gudang' },
      { nama: "Nur'aini", jabatan: 'Admin Online', departemen: 'Gudang' },
      { nama: 'Rizky Ramdhani', jabatan: 'Helper-Packing', departemen: 'Gudang' },
      { nama: 'Dimas Purwanto', jabatan: 'Helper-Packing', departemen: 'Gudang' },
      { nama: 'Preti Erriani', jabatan: 'Helper', departemen: 'Gudang' },
      { nama: 'Eko Purnomo', jabatan: 'Helper-Packing', departemen: 'Gudang' },
      { nama: 'Rinnawati', jabatan: 'Admin Nota Offlie', departemen: 'gudang' },
      { nama: 'M. Aditya Rahman', jabatan: 'Helper-Packing', departemen: 'Gudang' },
      { nama: 'Akhmad Fauzan Akbari', jabatan: 'Helper-Packing', departemen: 'Gudang' },
      { nama: 'Nicolaus Namang Odung', jabatan: 'Helper-Packing', departemen: 'Gudang' },
      { nama: 'Olivia Doho', jabatan: 'Staff', departemen: 'General' },
      { nama: 'Aurelia Fadhilla Naufan', jabatan: 'Accounting', departemen: 'RBB' },
      { nama: 'Egi Nugraha', jabatan: 'Helper-Jurumudi', departemen: 'Gudang' },
      { nama: 'Richi Chandra', jabatan: 'Staff', departemen: 'General' },
      { nama: 'Suryadi', jabatan: 'Driver RBB', departemen: 'Gudang' },
      { nama: 'M. Riyan Hambali', jabatan: 'Driver Jurumudi', departemen: 'Gudang' },
      { nama: 'Ahmad Kahfi', jabatan: 'Cleaning Service', departemen: 'Gudang' },
      { nama: 'Ryzka Syiami Nurharisma', jabatan: 'Admin Nota Rbb', departemen: 'Gudang' },
      { nama: 'Dio Febriyatna', jabatan: 'Helper', departemen: 'Gudang' },
      { nama: 'Aldy Priyanto', jabatan: 'Driver JM', departemen: 'Gudang' },
      { nama: 'Rizky Ramadhan', jabatan: 'Teknisi M2S', departemen: 'Teknisi' },
      { nama: 'Rahmandani', jabatan: 'Helper-Gudang Puri', departemen: 'Gudang' },
      { nama: 'M. Rihan saputra', jabatan: 'Helper RBB', departemen: 'Gudang' },
      { nama: 'Septia Endah Dwi Sulastri', jabatan: 'Admin Service', departemen: 'Teknisi- Admin Service' },
      { nama: 'Anang Sujhatmiko', jabatan: 'Helper JM', departemen: 'Gudang' },
      { nama: 'Robi Sugara', jabatan: 'Teknisi Service', departemen: 'Teknisi' },
      { nama: 'Aryo Giri Anggono', jabatan: 'Teknisi Service', departemen: 'Teknisi' },
      { nama: 'M. Samsul Bahri', jabatan: 'Admin Gudang JM', departemen: 'Gudang' },
      { nama: 'Ahmad Akbar Nurullah', jabatan: 'Admin Gudang RBB', departemen: 'Admin Gudang RBB' }
    ],
    'ILUMINDO': [
      { nama: 'Faisal Nu Triansyah', jabatan: 'Sales Offline Ilumindo', departemen: 'Sales Offline' },
      { nama: 'Joko Yuliantono', jabatan: 'Sales Project', departemen: 'Sales' },
      { nama: 'Nur Kiswanto', jabatan: 'Videographer & Event', departemen: 'General Affair- HRD' },
      { nama: 'Reza Fadhillah', jabatan: 'Sales Project', departemen: 'Sales' },
      { nama: 'Diki Zulkarnain', jabatan: 'Product Support', departemen: 'Teknisi' },
      { nama: 'Agus Tuaasun', jabatan: 'Product Support', departemen: 'Teknisi' },
      { nama: 'Muhammad Reynaldi Putra', jabatan: 'Product Support', departemen: 'Teknisi' },
      { nama: 'Hendra Setiawan', jabatan: 'Sales Project', departemen: 'sales' },
      { nama: 'Wahid Nurhilaludin', jabatan: 'Sales Project- Government', departemen: 'Sales Offline' },
      { nama: 'Putri Aulia Mandhasari', jabatan: 'Admin sales', departemen: 'Sales support' },
      { nama: 'Hoan Junaidi', jabatan: 'Manager', departemen: 'Manager Sales' },
      { nama: 'Meikel Octavian', jabatan: 'Sales Project', departemen: 'Sales' },
      { nama: 'Michael Josef Latumahina', jabatan: 'Channel Sales', departemen: 'Sales' }
    ],
    'RBM - LABEL': [
      { nama: 'Arfhond Kasangke', jabatan: 'Kepala Produksi', departemen: 'Label' },
      { nama: 'Febri Tri Andika', jabatan: 'Operator Sponsing', departemen: 'Label' },
      { nama: 'Rohmat Hidayat', jabatan: 'Operator Sponsing', departemen: 'Label' },
      { nama: 'Andre Aggesi Pratama', jabatan: 'Operator Sponsing', departemen: 'Label' },
      { nama: 'Rio Kusuma', jabatan: 'Operator Sponsing', departemen: 'Label' },
      { nama: 'Susiana', jabatan: 'Admin & QC', departemen: 'Label' },
      { nama: 'Fatqur Roji', jabatan: 'Operator Sliting', departemen: 'Label' },
      { nama: 'Rudiono', jabatan: 'Operator Sponsing', departemen: 'Label' },
      { nama: 'Rachmat Addin Affandi', jabatan: 'Operator Slitting', departemen: 'Label' },
      { nama: 'Ibrahim Riyadi Armansyah', jabatan: 'Operator Slitting', departemen: 'Label' },
      { nama: 'Arvian Bagus Setianto', jabatan: 'Operator Slitting', departemen: 'Label' },
      { nama: 'Wahyu Teguh Anugrah', jabatan: 'Operator Slitting', departemen: 'Label' },
      { nama: 'Muhammad Riski Ramadani', jabatan: 'Operator Slitting', departemen: 'Label' },
      { nama: 'M Faruq Dwi Saputra', jabatan: 'Operator Slitting', departemen: 'Label' },
      { nama: 'Moch Irfan Dwi', jabatan: 'Operator slitting', departemen: 'Label' },
      { nama: 'Ari Ariyanto', jabatan: 'Operator slitting', departemen: 'Label' },
      { nama: 'Firman Ardiansyah', jabatan: 'Operator Packaging', departemen: 'Label' },
      { nama: 'Aris Firmansyah', jabatan: 'Operator Packaging', departemen: 'Label' },
      { nama: 'Data Artha Hendra', jabatan: 'Operator Packaging', departemen: 'Label' },
      { nama: 'Arinta Mustika Rani', jabatan: 'Admin Produksi', departemen: 'Label' }
    ],
    'ALGOO': [
      { nama: 'Irfan Fadhil Rabbaniy', jabatan: 'Desain Grafis', departemen: 'Desain' },
      { nama: 'Nina Dwi Rusanti', jabatan: 'E commerce spesialist', departemen: 'Marketing Online' },
      { nama: 'Krisna Yuvi Setyawan', jabatan: 'Helper', departemen: 'Gudang' },
      { nama: 'Bela Agustina Putri', jabatan: 'Admin Gudang', departemen: 'Gudang' },
      { nama: 'Mochammad Royhansyah', jabatan: 'Helper', departemen: 'Gudang' },
      { nama: 'Asep Hidayat', jabatan: 'Helper', departemen: 'Gudang' }
    ],
    'RBM - IWARE BALI': [
      { nama: 'Hendri Novandri', jabatan: 'Admin Gudang', departemen: 'Gudang' },
      { nama: 'Octavia WigrhaIstia Dewi', jabatan: 'Admin Nota', departemen: 'Gudang' },
      { nama: 'Samsul Arifin', jabatan: 'Helper/driver gudang', departemen: 'Gudang' },
      { nama: 'Muhammad Fathur Rosi', jabatan: 'Teknisi Bali', departemen: 'Gudang' }
    ],
    'RBM-IWARE JOGJA': [
      { nama: 'Yudhistira Iyan Purtanto', jabatan: 'Admin Gudang', departemen: 'Gudang' }
    ]
};

const PengajuanForm = () => {
  const navigasi = useNavigate();
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [dataForm, setDataForm] = useState({
    kantor: '',
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
  const [daftarNama, setDaftarNama] = useState([]);

  const jenisPerizinan = ['cuti', 'lembur', 'sakit', 'lainnya'];

  // Update daftar nama ketika kantor berubah
  useEffect(() => {
    if (dataForm.kantor) {
      const karyawanKantor = dataKaryawan[dataForm.kantor] || [];
      setDaftarNama(karyawanKantor);
      // Reset field lain saat kantor berubah
      setDataForm(prev => ({
        ...prev,
        nama: '',
        jabatan: '',
        departemen: '',
        no_telp: ''
      }));
    } else {
      setDaftarNama([]);
    }
  }, [dataForm.kantor]);

  // Auto-fill jabatan, departemen ketika nama dipilih
  const handleNamaChange = (namaTerpilih) => {
    const karyawan = daftarNama.find(k => k.nama === namaTerpilih);
    if (karyawan) {
      setDataForm(prev => ({
        ...prev,
        nama: karyawan.nama,
        jabatan: karyawan.jabatan,
        departemen: karyawan.departemen
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
            {/* 1. KANTOR - Paling Atas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiMapPin className="inline mr-2" />
                Kantor <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={dataForm.kantor}
                onChange={(e) => setDataForm({ ...dataForm, kantor: e.target.value })}
                className="w-full px-4 py-3 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-base"
              >
                <option value="">-- Pilih Kantor --</option>
                {daftarKantor.map(kantor => (
                  <option key={kantor} value={kantor}>
                    {kantor}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. NAMA - Muncul setelah kantor dipilih */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiUser className="inline mr-2" />
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={dataForm.nama}
                onChange={(e) => handleNamaChange(e.target.value)}
                disabled={!dataForm.kantor}
                className="w-full px-4 py-3 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {dataForm.kantor ? '-- Pilih Nama --' : '-- Pilih Kantor Terlebih Dahulu --'}
                </option>
                {daftarNama.map((karyawan, index) => (
                  <option key={index} value={karyawan.nama}>
                    {karyawan.nama}
                  </option>
                ))}
              </select>
              {!dataForm.kantor && (
                <p className="text-xs text-gray-500 mt-1">Pilih kantor terlebih dahulu</p>
              )}
            </div>

            {/* 3. JABATAN - Auto-fill (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiBriefcase className="inline mr-2" />
                Jabatan
              </label>
              <input
                type="text"
                value={dataForm.jabatan}
                readOnly
                className="w-full px-4 py-3 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed text-base"
                placeholder="Otomatis terisi setelah pilih nama"
              />
            </div>

            {/* 4. DEPARTEMEN - Auto-fill (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiBriefcase className="inline mr-2" />
                Departemen
              </label>
              <input
                type="text"
                value={dataForm.departemen}
                readOnly
                className="w-full px-4 py-3 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed text-base"
                placeholder="Otomatis terisi setelah pilih nama"
              />
            </div>

            {/* 5. NO TELP - Manual Input */}
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
                className="w-full px-4 py-3 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-base"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Perizinan
              </label>
              <select
                value={dataForm.jenis_perizinan}
                onChange={(e) => setDataForm({ ...dataForm, jenis_perizinan: e.target.value })}
                className="w-full px-4 py-3 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-base"
              >
                {jenisPerizinan.map(jenis => (
                  <option key={jenis} value={jenis}>
                    {jenis.charAt(0).toUpperCase() + jenis.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline mr-2" />
                  Tanggal & Jam Mulai
                </label>
                <input
                  type="datetime-local"
                  required
                  value={dataForm.tanggal_mulai}
                  onChange={(e) => setDataForm({ ...dataForm, tanggal_mulai: e.target.value })}
                  className="w-full px-4 py-3 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline mr-2" />
                  Tanggal & Jam Selesai
                </label>
                <input
                  type="datetime-local"
                  required
                  value={dataForm.tanggal_selesai}
                  onChange={(e) => setDataForm({ ...dataForm, tanggal_selesai: e.target.value })}
                  className="w-full px-4 py-3 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiUpload className="inline mr-2" />
                Bukti Foto (Opsional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={tanganiPerubahanFile}
                  className="w-full px-4 py-3 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Format: JPG, PNG, PDF (Maks 5MB)</p>
              
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

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={sedangMemuat}
                className="flex-1 flex items-center justify-center space-x-2 py-3 sm:py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 min-h-[48px]"
              >
                <FiSend />
                <span>{sedangMemuat ? 'Mengirim...' : 'Kirim Pengajuan'}</span>
              </motion.button>

              <Link to="/" className="flex-1">
                <button
                  type="button"
                  className="w-full py-3 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition min-h-[48px]"
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
