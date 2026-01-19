# Backend - Aplikasi Perizinan IWARE

Backend API untuk aplikasi perizinan cuti/lembur menggunakan Node.js, Express, dan MongoDB.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` ke `.env` dan sesuaikan:

```bash
cp .env.example .env
```

Edit `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/iware_perizinan
JWT_SECRET=your-secret-key
```

### 3. Install & Start MongoDB

**Windows:**
- Download: https://www.mongodb.com/try/download/community
- Install dan jalankan sebagai service

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongod
```

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Atau gunakan MongoDB Atlas (Cloud - Gratis):**
- Daftar: https://www.mongodb.com/cloud/atlas
- Buat cluster gratis
- Update MONGODB_URI di .env

### 4. Test MongoDB Connection

```bash
npm run test-db
```

### 5. Start Server

```bash
npm start
```

Server akan otomatis:
- Connect ke MongoDB
- Membuat database `iware_perizinan`
- Membuat user admin default

## 🔐 Default Credentials

- **Username:** admin
- **Password:** password

⚠️ **PENTING:** Ganti password setelah login pertama!

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Authentication
```
POST   /api/auth/login              # Login
POST   /api/auth/register-hrd       # Register HRD (admin only)
GET    /api/auth/users              # Get all users (admin only)
DELETE /api/auth/users/:id          # Delete user (admin only)
PUT    /api/auth/profile            # Update profile
PUT    /api/auth/change-password    # Change password
```

### Pengajuan
```
POST   /api/pengajuan/submit        # Submit pengajuan (public)
GET    /api/pengajuan               # Get all (HRD/admin)
PUT    /api/pengajuan/:id           # Update status (HRD/admin)
DELETE /api/pengajuan/:id           # Delete (HRD/admin)
GET    /api/pengajuan/stats/dashboard  # Statistics (HRD/admin)
GET    /api/pengajuan/report        # Report with filter (HRD/admin)
```

## 🛠️ Scripts

```bash
npm start          # Start server
npm run dev        # Development mode (nodemon)
npm run test-db    # Test MongoDB connection
```

## 📁 Struktur Folder

```
backend/
├── config/
│   └── mongodb.js          # MongoDB connection
├── middleware/
│   └── auth.js             # JWT authentication
├── models/
│   ├── User.js             # User model
│   └── Pengajuan.js        # Pengajuan model
├── routes/
│   ├── auth.js             # Auth routes
│   └── pengajuan.js        # Pengajuan routes
├── scripts/
│   └── generate-jwt-secret.js
├── uploads/                # File uploads
├── .env                    # Environment variables
├── .env.example            # Environment template
├── package.json
└── server.js               # Main server file
```

## 🔧 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/iware_perizinan

# JWT
JWT_SECRET=your-secret-key

# CORS
FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing

### Test MongoDB Connection
```bash
npm run test-db
```

### Test API dengan curl

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

**Get Users (dengan token):**
```bash
curl http://localhost:5000/api/auth/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🚀 Deployment

### Railway

1. Push ke GitHub
2. Connect Railway ke repository
3. Set environment variables:
   ```
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-secret
   FRONTEND_URL=your-frontend-url
   ```
4. Deploy!

### MongoDB Atlas (Recommended)

1. Daftar: https://www.mongodb.com/cloud/atlas
2. Buat cluster gratis (M0)
3. Dapatkan connection string
4. Update MONGODB_URI

## 🔒 Security

- Password di-hash dengan bcrypt (salt rounds: 10)
- JWT authentication dengan expiration 24 jam
- CORS protection
- File upload validation (type & size)
- Role-based access control

## 📚 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **multer** - File upload
- **cors** - CORS middleware
- **dotenv** - Environment variables

## 🆘 Troubleshooting

### MongoDB tidak bisa connect

```bash
# Windows
net start MongoDB

# Linux
sudo systemctl start mongod

# macOS
brew services start mongodb-community
```

### Port 5000 sudah digunakan

Edit `.env`:
```env
PORT=5001
```

### JWT Secret error

Generate new secret:
```bash
node scripts/generate-jwt-secret.js
```

## 📞 Support

Untuk masalah atau pertanyaan, lihat dokumentasi lengkap di folder root project.

---

**Version:** 2.0.0  
**Database:** MongoDB  
**Maintained by:** IWARE IT Team
