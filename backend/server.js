const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 FINAL SERVER STARTING...');
console.log('📍 Port:', PORT);

// CORS - allow all
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'bukti-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg, .jpeg and .pdf format allowed!'));
    }
  }
});

// Database connection
let db;
async function connectDB() {
  try {
    db = await mysql.createPool({
      host: process.env.MYSQLHOST || process.env.DB_HOST,
      port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
      user: process.env.MYSQLUSER || process.env.DB_USER,
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
      database: process.env.MYSQLDATABASE || process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log('✅ Database connected');
    
    // Auto-create tables
    await initializeTables();
    
    return db;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return null;
  }
}

// Auto-import karyawan data (174 employees from 8 offices)
async function autoImportKaryawan() {
  try {
    // Check if karyawan table already has data
    const [existing] = await db.query('SELECT COUNT(*) as count FROM karyawan');
    if (existing[0].count > 0) {
      console.log(`ℹ️  Karyawan data already exists (${existing[0].count} records), skipping import`);
      return;
    }
    
    console.log('🔄 Auto-importing karyawan data...');
    
    // Data karyawan LENGKAP (174 karyawan dari 8 kantor)
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
    
    let totalImported = 0;
    let phoneCounter = 1000;
    
    for (const [kantor, karyawanList] of Object.entries(dataKaryawan)) {
      for (const karyawan of karyawanList) {
        const no_telp = `08123456${String(phoneCounter).padStart(4, '0')}`;
        phoneCounter++;
        
        try {
          await db.query(
            'INSERT INTO karyawan (kantor, nama, jabatan, departemen, no_telp, jatah_cuti, sisa_cuti, status) VALUES (?, ?, ?, ?, ?, 12, 12, "aktif")',
            [kantor, karyawan.nama, karyawan.jabatan, karyawan.departemen, no_telp]
          );
          totalImported++;
        } catch (error) {
          if (error.code !== 'ER_DUP_ENTRY') {
            console.error(`❌ Error importing ${karyawan.nama}:`, error.message);
          }
        }
      }
    }
    
    console.log(`✅ Auto-imported ${totalImported} karyawan from 8 offices`);
    
  } catch (error) {
    console.error('❌ Error auto-importing karyawan:', error.message);
  }
}

async function initializeTables() {
  try {
    console.log('🔄 Initializing database tables...');
    
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        nama VARCHAR(100) NOT NULL,
        role ENUM('admin', 'hrd') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log('✅ Table users OK');
    
    // Create pengajuan table
    await db.query(`
      CREATE TABLE IF NOT EXISTS pengajuan (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nama VARCHAR(100) NOT NULL,
        no_telp VARCHAR(20) NOT NULL,
        jenis_perizinan VARCHAR(50) NOT NULL,
        tanggal_mulai DATETIME NOT NULL,
        tanggal_selesai DATETIME NOT NULL,
        bukti_foto VARCHAR(255),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        catatan TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log('✅ Table pengajuan OK');
    
    // Create karyawan table
    const currentYear = new Date().getFullYear();
    await db.query(`
      CREATE TABLE IF NOT EXISTS karyawan (
        id INT PRIMARY KEY AUTO_INCREMENT,
        kantor VARCHAR(100) NOT NULL,
        nama VARCHAR(100) NOT NULL,
        jabatan VARCHAR(100) NOT NULL,
        departemen VARCHAR(100) NOT NULL,
        no_telp VARCHAR(20),
        jatah_cuti INT DEFAULT 12,
        sisa_cuti INT DEFAULT 12,
        tahun_cuti INT DEFAULT ${currentYear},
        status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_karyawan (kantor, nama)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log('✅ Table karyawan OK');
    
    // Create quota_bulanan table
    await db.query(`
      CREATE TABLE IF NOT EXISTS quota_bulanan (
        id INT PRIMARY KEY AUTO_INCREMENT,
        karyawan_id INT NOT NULL,
        bulan INT NOT NULL,
        tahun INT NOT NULL,
        pulang_cepat INT DEFAULT 0,
        datang_terlambat INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_quota (karyawan_id, bulan, tahun),
        FOREIGN KEY (karyawan_id) REFERENCES karyawan(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log('✅ Table quota_bulanan OK');
    
    // Add columns to pengajuan if not exist
    const [columns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'pengajuan' 
      AND COLUMN_NAME IN ('karyawan_id', 'kantor', 'jabatan', 'departemen')
    `);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    
    if (!existingColumns.includes('karyawan_id')) {
      await db.query('ALTER TABLE pengajuan ADD COLUMN karyawan_id INT');
      console.log('✅ Column karyawan_id added');
    }
    
    if (!existingColumns.includes('kantor')) {
      await db.query('ALTER TABLE pengajuan ADD COLUMN kantor VARCHAR(100)');
      console.log('✅ Column kantor added');
    }
    
    if (!existingColumns.includes('jabatan')) {
      await db.query('ALTER TABLE pengajuan ADD COLUMN jabatan VARCHAR(100)');
      console.log('✅ Column jabatan added');
    }
    
    if (!existingColumns.includes('departemen')) {
      await db.query('ALTER TABLE pengajuan ADD COLUMN departemen VARCHAR(100)');
      console.log('✅ Column departemen added');
    }
    
    // Create default admin user if not exists
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', ['admin']);
    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.query(
        'INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)',
        ['admin', hashedPassword, 'Administrator', 'admin']
      );
      console.log('✅ Default admin user created (admin/admin123)');
    }
    
    // Auto-import karyawan data if table is empty
    await autoImportKaryawan();
    
    console.log('✅ Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Error initializing tables:', error.message);
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server berjalan dengan baik',
    timestamp: new Date().toISOString()
  });
});

// LOGIN ROUTE - HARDCODED
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body);
    
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password harus diisi' });
    }

    if (!db) {
      await connectDB();
    }

    // Get user
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const user = rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful:', username);

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        username: user.username,
        nama: user.nama,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat login',
      error: error.message 
    });
  }
});

// Get karyawan
app.get('/api/karyawan', async (req, res) => {
  try {
    if (!db) await connectDB();
    
    const { kantor } = req.query;
    
    let query = 'SELECT * FROM karyawan WHERE status = "aktif"';
    let params = [];
    
    if (kantor) {
      query += ' AND kantor = ?';
      params.push(kantor);
    }
    
    query += ' ORDER BY nama ASC';
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('❌ Get karyawan error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete karyawan
app.delete('/api/karyawan/:id', async (req, res) => {
  try {
    if (!db) await connectDB();
    
    const { id } = req.params;

    // Check if karyawan exists
    const [karyawan] = await db.query('SELECT * FROM karyawan WHERE id = ?', [id]);
    
    if (karyawan.length === 0) {
      return res.status(404).json({ message: 'Karyawan tidak ditemukan' });
    }

    // Delete karyawan
    await db.query('DELETE FROM karyawan WHERE id = ?', [id]);

    console.log('✅ Karyawan deleted:', id);

    res.json({ message: 'Karyawan berhasil dihapus' });

  } catch (error) {
    console.error('❌ Delete karyawan error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get pengajuan
app.get('/api/pengajuan', async (req, res) => {
  try {
    if (!db) await connectDB();
    
    const [rows] = await db.query(`
      SELECT p.*, k.nama as nama_karyawan, k.kantor, k.jabatan, k.departemen
      FROM pengajuan p
      LEFT JOIN karyawan k ON p.karyawan_id = k.id
      ORDER BY p.created_at DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('❌ Get pengajuan error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get statistics
app.get('/api/pengajuan/stats', async (req, res) => {
  try {
    if (!db) await connectDB();
    
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM pengajuan
    `);
    
    res.json(stats[0] || { total: 0, pending: 0, approved: 0, rejected: 0 });
  } catch (error) {
    console.error('❌ Get stats error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get statistics for dashboard (alias)
app.get('/api/pengajuan/stats/dashboard', async (req, res) => {
  try {
    if (!db) await connectDB();
    
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM pengajuan
    `);
    
    res.json(stats[0] || { total: 0, pending: 0, approved: 0, rejected: 0 });
  } catch (error) {
    console.error('❌ Get stats error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get users (for admin)
app.get('/api/auth/users', async (req, res) => {
  try {
    if (!db) await connectDB();
    
    const [rows] = await db.query(
      'SELECT id, username, nama, role, created_at FROM users ORDER BY created_at DESC'
    );
    
    res.json({ users: rows });
  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Register HRD user
app.post('/api/auth/register-hrd', async (req, res) => {
  try {
    if (!db) await connectDB();
    
    const { username, password, nama } = req.body;

    if (!username || !password || !nama) {
      return res.status(400).json({ message: 'Username, password, dan nama harus diisi' });
    }

    // Check if username exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query(
      'INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, nama, 'hrd']
    );

    console.log('✅ HRD registered:', username);

    res.status(201).json({
      message: 'HRD berhasil didaftarkan',
      user: { username, nama, role: 'hrd' }
    });

  } catch (error) {
    console.error('❌ Register HRD error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete user
app.delete('/api/auth/users/:id', async (req, res) => {
  try {
    if (!db) await connectDB();
    
    const userId = req.params.id;

    // Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Delete user
    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    console.log('✅ User deleted:', userId);

    res.json({ message: 'User berhasil dihapus' });

  } catch (error) {
    console.error('❌ Delete user error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update pengajuan status
app.put('/api/pengajuan/:id', async (req, res) => {
  try {
    if (!db) await connectDB();
    
    const { id } = req.params;
    const { status, catatan } = req.body;

    await db.query(
      'UPDATE pengajuan SET status = ?, catatan = ? WHERE id = ?',
      [status, catatan, id]
    );

    console.log('✅ Pengajuan updated:', id);

    res.json({ message: 'Status pengajuan berhasil diupdate' });

  } catch (error) {
    console.error('❌ Update pengajuan error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create pengajuan (with file upload)
app.post('/api/pengajuan', upload.single('bukti_foto'), async (req, res) => {
  try {
    if (!db) await connectDB();
    
    const { 
      karyawan_id, 
      nama, 
      no_telp, 
      kantor, 
      jabatan, 
      departemen, 
      jenis_perizinan, 
      tanggal_mulai, 
      tanggal_selesai, 
      catatan 
    } = req.body;
    
    // Validasi field wajib
    if (!nama || !no_telp || !jenis_perizinan || !tanggal_mulai || !tanggal_selesai) {
      return res.status(400).json({ 
        message: 'Field wajib tidak lengkap: nama, no_telp, jenis_perizinan, tanggal_mulai, tanggal_selesai' 
      });
    }
    
    // Validasi dinas luar harus ada foto
    if (jenis_perizinan === 'dinas_luar' && !req.file) {
      return res.status(400).json({ 
        message: 'Dinas luar wajib melampirkan bukti foto' 
      });
    }
    
    // Get file path if uploaded
    const bukti_foto = req.file ? `/uploads/${req.file.filename}` : null;
    
    const [result] = await db.query(
      `INSERT INTO pengajuan (
        karyawan_id, nama, no_telp, kantor, jabatan, departemen, 
        jenis_perizinan, tanggal_mulai, tanggal_selesai, bukti_foto, catatan, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        karyawan_id || null, 
        nama, 
        no_telp, 
        kantor || null, 
        jabatan || null, 
        departemen || null, 
        jenis_perizinan, 
        tanggal_mulai, 
        tanggal_selesai, 
        bukti_foto,
        catatan || null, 
        'pending'
      ]
    );
    
    console.log('✅ Pengajuan created:', result.insertId, 'by', nama);
    
    res.status(201).json({ 
      message: 'Pengajuan berhasil dibuat',
      id: result.insertId 
    });
  } catch (error) {
    console.error('❌ Create pengajuan error:', error);
    res.status(500).json({ 
      message: 'Gagal mengirim pengajuan: ' + error.message 
    });
  }
});

// 404 handler
app.use((req, res) => {
  console.log('❌ 404:', req.method, req.url);
  res.status(404).json({
    error: 'Not Found',
    path: req.url,
    method: req.method,
    availableRoutes: [
      'POST /api/auth/login',
      'GET /api/health',
      'GET /api/karyawan',
      'GET /api/pengajuan',
      'POST /api/pengajuan'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: err.message });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('='.repeat(50));
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ Server ready`);
    console.log('='.repeat(50));
    console.log('');
    console.log('Available routes:');
    console.log('  POST   /api/auth/login');
    console.log('  GET    /api/health');
    console.log('  GET    /api/karyawan');
    console.log('  GET    /api/pengajuan');
    console.log('  POST   /api/pengajuan');
    console.log('');
  });
});
