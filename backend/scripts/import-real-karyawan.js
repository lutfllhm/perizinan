const mysql = require('mysql2/promise');
require('dotenv').config();

// Data karyawan LENGKAP dari import-karyawan.js (174 karyawan)
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

async function importKaryawan() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway'
  });

  try {
    console.log('🔄 Memulai import data karyawan LENGKAP...');

    let totalImported = 0;
    let totalSkipped = 0;
    let phoneCounter = 1000;

    for (const [kantor, karyawanList] of Object.entries(dataKaryawan)) {
      console.log(`\n📍 Import karyawan ${kantor}...`);
      
      for (const karyawan of karyawanList) {
        const no_telp = `08123456${String(phoneCounter).padStart(4, '0')}`;
        phoneCounter++;
        
        try {
          await connection.query(
            `INSERT INTO karyawan (kantor, nama, jabatan, departemen, no_telp, jatah_cuti, sisa_cuti, tahun_cuti) 
             VALUES (?, ?, ?, ?, ?, 12, 12, YEAR(CURDATE()))`,
            [kantor, karyawan.nama, karyawan.jabatan, karyawan.departemen, no_telp]
          );
          totalImported++;
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            totalSkipped++;
          } else {
            console.error(`❌ Error import ${karyawan.nama}:`, error.message);
          }
        }
      }
    }

    console.log('\n✅ Import selesai!');
    console.log(`📊 Total berhasil: ${totalImported}`);
    console.log(`⏭️  Total dilewati (sudah ada): ${totalSkipped}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

importKaryawan()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
