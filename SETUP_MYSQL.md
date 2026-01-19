# Setup MySQL - Aplikasi Perizinan IWARE

## 🚀 Quick Start

```bash
setup-mysql.bat
```

Script otomatis akan:
1. Install dependencies
2. Membuat database dan tabel
3. Membuat user default
4. Test koneksi

---

## 📥 Install MySQL

### Windows

1. **Download MySQL Installer**
   - Buka: https://dev.mysql.com/downloads/installer/
   - Pilih: "MySQL Installer for Windows"
   - Download versi "mysql-installer-community" (sekitar 400MB)

2. **Install MySQL**
   - Jalankan installer
   - Pilih "Developer Default" atau "Server only"
   - Klik "Next" sampai ke "Authentication Method"
   - Pilih "Use Strong Password Encryption"
   - Set root password (catat baik-baik!)
   - Klik "Next" sampai selesai

3. **Verifikasi Instalasi**
   ```bash
   mysql --version
   ```

4. **Start MySQL Service**
   ```bash
   net start MySQL80
   ```

---

## ⚙️ Konfigurasi

### 1. Update File `.env`

Edit file `backend/.env`:

```env
PORT=5000

# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=iware_perizinan

JWT_SECRET=cf9376f298de46b707fbc7affa22f22d9dc6a6ca9f556a9874727a85007b2b68
NODE_ENV=development

FRONTEND_URL=http://localhost:3000
```

**Ganti `your_mysql_password_here` dengan password MySQL Anda!**

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Initialize Database

```bash
node scripts/init-database.js
```

Script ini akan:
- Membuat database `iware_perizinan`
- Membuat tabel `users` dan `pengajuan`
- Insert user default (admin & hrd)

### 4. Test Koneksi

```bash
node test-mysql-connection.js
```

Output yang benar:
```
✅ MySQL connected successfully!
✅ Test query successful: 2
📊 Tables in database: 2
  - users
  - pengajuan
👥 Total users: 2
📝 Total pengajuan: 0
```

---

## 🗄️ Struktur Database

### Tabel: users

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nama VARCHAR(100) NOT NULL,
  role ENUM('admin', 'hrd') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel: pengajuan

```sql
CREATE TABLE pengajuan (
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
);
```

---

## 👥 Default Users

Setelah init database, Anda bisa login dengan:

**Admin:**
- Username: `admin`
- Password: `admin123`

**HRD:**
- Username: `hrd`
- Password: `hrd123`

---

## 🚀 Start Development

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

Aplikasi akan berjalan di:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

---

## 🐛 Troubleshooting

### Error: Access denied for user 'root'@'localhost'

**Solusi:**
1. Cek password di file `.env`
2. Reset password MySQL jika lupa:
   ```bash
   # Stop MySQL service
   net stop MySQL80
   
   # Start MySQL tanpa password
   mysqld --skip-grant-tables
   
   # Di terminal baru
   mysql -u root
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
   FLUSH PRIVILEGES;
   ```

### Error: Can't connect to MySQL server

**Solusi:**
1. Pastikan MySQL service running:
   ```bash
   net start MySQL80
   ```

2. Cek port 3306 tidak digunakan aplikasi lain

3. Cek firewall tidak memblokir MySQL

### Error: Unknown database 'iware_perizinan'

**Solusi:**
```bash
cd backend
node scripts/init-database.js
```

### Error: Table 'users' doesn't exist

**Solusi:**
```bash
cd backend
node scripts/init-database.js
```

### Error: Cannot find module 'mysql2'

**Solusi:**
```bash
cd backend
npm install
```

---

## 📊 Import Data dari SQL File

Jika Anda punya file `iware_perizinan.sql`:

```bash
# Via command line
mysql -u root -p iware_perizinan < iware_perizinan.sql

# Atau via MySQL Workbench
# File > Run SQL Script > Pilih iware_perizinan.sql
```

---

## 🔧 MySQL Commands

### Masuk ke MySQL CLI

```bash
mysql -u root -p
```

### Lihat Database

```sql
SHOW DATABASES;
USE iware_perizinan;
SHOW TABLES;
```

### Lihat Data

```sql
SELECT * FROM users;
SELECT * FROM pengajuan;
```

### Reset Database

```sql
DROP DATABASE iware_perizinan;
```

Lalu jalankan lagi:
```bash
node scripts/init-database.js
```

---

## 🌐 Production (Railway/Heroku)

### Environment Variables

Set di dashboard Railway/Heroku:

```env
DB_HOST=your-mysql-host.railway.app
DB_USER=root
DB_PASSWORD=your-production-password
DB_NAME=railway
PORT=5000
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

### MySQL di Railway

1. Buat MySQL service di Railway
2. Copy connection details
3. Set environment variables
4. Deploy backend

---

## 📚 Resources

- MySQL Documentation: https://dev.mysql.com/doc/
- MySQL Workbench: https://dev.mysql.com/downloads/workbench/
- Node.js mysql2: https://github.com/sidorares/node-mysql2

---

## 💡 Tips

1. **Backup database** secara berkala:
   ```bash
   mysqldump -u root -p iware_perizinan > backup.sql
   ```

2. **Gunakan MySQL Workbench** untuk GUI management

3. **Ganti password default** setelah login pertama

4. **Set strong JWT_SECRET** untuk production

5. **Enable SSL** untuk production database
