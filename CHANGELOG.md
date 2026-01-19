# Changelog - Aplikasi Perizinan IWARE

## [2.0.0] - 2026-01-19

### 🔄 MAJOR UPDATE: Migration to MongoDB

#### Breaking Changes
- ⚠️ **Database migrated from MySQL to MongoDB**
- ⚠️ **All SQL queries converted to MongoDB queries**
- ⚠️ **ID field changed from integer to ObjectId**

#### New Features
- ✅ MongoDB integration with Mongoose ODM
- ✅ Flexible schema with automatic timestamps
- ✅ Better scalability and performance
- ✅ Cloud-ready with MongoDB Atlas support
- ✅ Auto-initialization of database and admin user

#### Tech Stack Updates
- **Database:** MySQL → **MongoDB**
- **ORM/ODM:** None → **Mongoose**
- **Connection:** mysql2 → **mongoose**

#### New Files
- `backend/config/mongodb.js` - MongoDB connection configuration
- `backend/models/User.js` - User model with Mongoose
- `backend/models/Pengajuan.js` - Pengajuan model with Mongoose
- `backend/test-mongodb-connection.js` - Connection test script
- `backend/MIGRATION_MONGODB.md` - Migration documentation
- `backend/INSTALL_MONGODB.md` - MongoDB installation guide
- `QUICK_START_MONGODB.md` - Quick start guide
- `install-mongodb.bat` - Auto-install script (Windows)
- `cleanup-mysql.bat` - Cleanup MySQL dependencies

#### Updated Files
- `backend/package.json` - Replaced mysql2 with mongoose
- `backend/server.js` - MongoDB connection and initialization
- `backend/routes/auth.js` - Converted to MongoDB queries
- `backend/routes/pengajuan.js` - Converted to MongoDB queries
- `backend/.env` - Updated for MongoDB configuration
- `backend/.env.example` - MongoDB configuration template
- `README.md` - Updated with MongoDB information

#### Deprecated Files
- `backend/config/database.js` - MySQL configuration (not used)
- `backend/config/init-db.sql` - SQL initialization (not used)
- `backend/config/reset-admin.sql` - SQL reset script (not used)

#### Default Credentials (Updated)
- **Username:** admin
- **Password:** password (changed from admin123)
- ⚠️ **IMPORTANT:** Change password after first login!

#### Migration Benefits
1. **Flexibility** - No need for ALTER TABLE, just add fields
2. **Performance** - Faster for read-heavy operations
3. **Scalability** - Easy horizontal scaling
4. **Cloud Native** - MongoDB Atlas free tier available
5. **JSON Native** - Data stored in JSON-like format (BSON)
6. **Developer Friendly** - JavaScript-like queries

#### Installation (MongoDB)

**Quick Start:**
```bash
# 1. Install MongoDB
# Windows: Download from mongodb.com
# Linux: sudo apt-get install mongodb
# macOS: brew install mongodb-community

# 2. Install dependencies
cd backend
npm install

# 3. Run server (auto-creates database & admin)
npm start
```

**Or use MongoDB Atlas (Cloud - Free):**
```bash
# 1. Sign up at mongodb.com/cloud/atlas
# 2. Create free cluster (M0)
# 3. Get connection string
# 4. Update .env:
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/iware_perizinan
```

#### Testing
```bash
# Test MongoDB connection
cd backend
npm run test-db

# Test API
curl http://localhost:5000/api/health
```

#### Documentation
- 📚 [MIGRATION_MONGODB.md](./backend/MIGRATION_MONGODB.md) - Complete migration guide
- 📚 [INSTALL_MONGODB.md](./backend/INSTALL_MONGODB.md) - MongoDB installation
- 📚 [QUICK_START_MONGODB.md](./QUICK_START_MONGODB.md) - 5-minute quick start

#### Known Issues
- None

#### TODO / Future Enhancements
- [ ] Data migration script from MySQL to MongoDB
- [ ] MongoDB backup automation
- [ ] Performance optimization with indexes
- [ ] Aggregation pipeline for complex reports

---

## [1.0.0] - 2024-01-12

### ✨ Initial Release

#### Features
- ✅ Sistem perizinan cuti/lembur berbasis web
- ✅ Role-based access control (Admin & HRD)
- ✅ Dashboard interaktif dengan grafik
- ✅ Form pengajuan public
- ✅ Upload bukti foto
- ✅ Approval system
- ✅ Report per bulan/tahun
- ✅ Responsive design
- ✅ Modern animations

#### Tech Stack
- **Backend:** Node.js + Express.js
- **Frontend:** React.js (JSX)
- **Database:** MySQL
- **Styling:** TailwindCSS
- **Animation:** Framer Motion
- **Charts:** Recharts

#### Security
- ✅ Password hashing dengan bcrypt (salt rounds: 10)
- ✅ JWT authentication
- ✅ Protected routes
- ✅ File upload validation
- ✅ SQL injection prevention (prepared statements)

#### Default Credentials
- **Username:** admin
- **Password:** admin123 (bcrypt hash: `$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`)

#### Database
- **Name:** iware_perizinan
- **Tables:** users, pengajuan
- **Default admin:** Pre-seeded dengan password ter-hash

#### File Structure
```
iware-perizinan/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── init-db.sql (✅ dengan bcrypt hash)
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── pengajuan.js
│   ├── scripts/
│   │   ├── generate-hash.js (✅ NEW)
│   │   ├── verify-password.js (✅ NEW)
│   │   └── README.md (✅ NEW)
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── SECURITY.md (✅ NEW)
├── frontend/
│   ├── public/
│   │   ├── img/ (untuk logo.png & 1-5.jpeg)
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx (✅ JSX)
│   │   │   └── PrivateRoute.jsx (✅ JSX)
│   │   ├── pages/
│   │   │   ├── Home.jsx (✅ JSX)
│   │   │   ├── Login.jsx (✅ JSX)
│   │   │   ├── PengajuanForm.jsx (✅ JSX)
│   │   │   ├── AdminDashboard.jsx (✅ JSX)
│   │   │   └── HRDDashboard.jsx (✅ JSX)
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx (✅ JSX)
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
├── .gitignore (✅ Updated)
├── README.md
├── SETUP.md (✅ NEW)
├── CHANGELOG.md (✅ NEW)
├── CREDENTIALS.md (✅ NEW - gitignored)
└── CREDENTIALS.example.md (✅ NEW)
```

#### Documentation
- ✅ README.md - Overview & quick start
- ✅ SETUP.md - Detailed installation guide
- ✅ SECURITY.md - Security best practices
- ✅ CREDENTIALS.md - Default credentials (gitignored)
- ✅ CREDENTIALS.example.md - Template
- ✅ backend/scripts/README.md - Password management guide

#### Key Changes from Initial Setup

1. **Password Security**
   - ✅ Admin password di-hash dengan bcrypt
   - ✅ Hash: `$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`
   - ✅ Script untuk generate & verify hash

2. **File Extensions**
   - ✅ Semua React components menggunakan `.jsx`
   - ✅ Import statements updated

3. **Branding**
   - ✅ Nama perusahaan: RBM → IWARE
   - ✅ Database: rbm_perizinan → iware_perizinan
   - ✅ Logo path: /img/logo.png
   - ✅ Company photos: /img/1-5.jpeg

4. **Security Enhancements**
   - ✅ Comprehensive security documentation
   - ✅ Password management scripts
   - ✅ .gitignore updated untuk credentials
   - ✅ Environment variables template

#### Known Issues
- None

#### TODO / Future Enhancements
- [ ] Change password feature di dashboard
- [ ] Email notifications
- [ ] Export report to PDF/Excel
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app
- [ ] Rate limiting
- [ ] Audit logging
- [ ] Two-factor authentication

#### Installation

See `SETUP.md` for detailed installation instructions.

Quick start:
```bash
# Database
mysql -u root -p < backend/config/init-db.sql

# Backend
cd backend && npm install && npm start

# Frontend
cd frontend && npm install && npm start
```

#### Support

For issues or questions, contact IWARE IT Team.

---

## Version History

### [1.0.0] - 2024-01-12
- Initial release with full features
- Bcrypt password hashing implemented
- JSX file extensions
- IWARE branding
- Comprehensive documentation

---

**Maintained by:** IWARE IT Team
**License:** © 2024 IWARE. All rights reserved.
