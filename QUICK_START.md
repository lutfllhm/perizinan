# 🚀 Quick Start Guide

## 📦 Instalasi Lokal

### 1. Clone Repository
```bash
git clone <repository-url>
cd iware-perizinan
```

### 2. Install Dependencies
```bash
# Install semua dependencies
npm run install:all

# Atau manual:
cd backend && npm install
cd ../frontend && npm install
```

### 3. Setup Database MySQL

#### Buat Database
```sql
CREATE DATABASE iware_perizinan;
```

#### Import Schema
```bash
mysql -u root -p iware_perizinan < iware_perizinan.sql
```

#### Atau Gunakan Init Script
```bash
cd backend
npm run init-db
```

### 4. Configure Environment

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=iware_perizinan
JWT_SECRET=your_generated_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Generate JWT Secret:
```bash
node scripts/generate-jwt-secret.js
```

#### Frontend (.env)
```bash
cd frontend
```

Edit `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

### 5. Run Application

#### Development Mode (Concurrent)
```bash
# Dari root directory
npm run dev
```

#### Atau Manual

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 6. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

### 7. Default Login

**Admin:**
- Username: `admin`
- Password: `admin123`

**HRD:**
- Username: `hrd`
- Password: `hrd123`

## 🚀 Deploy ke Railway

Lihat panduan lengkap di [RAILWAY_DEPLOY_GUIDE.md](./RAILWAY_DEPLOY_GUIDE.md)

### Quick Steps:

1. **Deploy MySQL**
   - New Project > Deploy MySQL
   - Tunggu hingga selesai

2. **Deploy Backend**
   - New Service > GitHub Repo
   - Root Directory: `backend`
   - Link ke MySQL service
   - Set environment variables
   - Generate domain

3. **Deploy Frontend**
   - New Service > GitHub Repo
   - Root Directory: `frontend`
   - Update `REACT_APP_API_URL`
   - Generate domain

4. **Initialize Database**
   ```bash
   railway run npm run init-railway-db
   ```

## 📁 Struktur Project

```
iware-perizinan/
├── backend/
│   ├── config/
│   │   └── mysql.js          # MySQL connection
│   ├── middleware/
│   │   └── auth.js           # JWT authentication
│   ├── routes/
│   │   ├── auth.js           # Auth endpoints
│   │   └── pengajuan.js      # Pengajuan endpoints
│   ├── scripts/
│   │   ├── init-database.js  # Local DB init
│   │   └── init-railway-db.js # Railway DB init
│   ├── uploads/              # File uploads
│   ├── .env                  # Local config
│   ├── .env.railway          # Railway template
│   ├── server.js             # Express server
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── utils/
│   │   │   └── api.js        # API client
│   │   ├── App.jsx
│   │   └── index.js
│   ├── .env                  # Local config
│   ├── .env.railway          # Railway template
│   └── package.json
├── iware_perizinan.sql       # Database schema
├── RAILWAY_DEPLOY_GUIDE.md   # Deploy guide
└── README.md
```

## 🔧 Available Scripts

### Root
- `npm run install:all` - Install all dependencies
- `npm run dev` - Run backend + frontend concurrently

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server (nodemon)
- `npm run init-db` - Initialize local database
- `npm run init-railway-db` - Initialize Railway database
- `npm run test-db` - Test MySQL connection

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Serve production build

## 🐛 Troubleshooting

### MySQL Connection Error
```bash
# Check MySQL service
# Windows
net start MySQL80

# Linux/Mac
sudo service mysql start

# Test connection
cd backend
npm run test-db
```

### Port Already in Use
```bash
# Kill process on port 5000 (Backend)
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (Frontend)
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Database Not Initialized
```bash
cd backend
npm run init-db
```

### CORS Error
Pastikan `FRONTEND_URL` di backend `.env` sudah benar:
```env
FRONTEND_URL=http://localhost:3000
```

## 📚 API Documentation

### Authentication

**POST** `/api/auth/login`
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**GET** `/api/auth/me`
Headers: `Authorization: Bearer <token>`

### Pengajuan

**GET** `/api/pengajuan` - Get all pengajuan

**POST** `/api/pengajuan` - Create pengajuan
```json
{
  "nama": "John Doe",
  "no_telp": "08123456789",
  "jenis_perizinan": "cuti",
  "tanggal_mulai": "2026-01-20T09:00:00",
  "tanggal_selesai": "2026-01-22T17:00:00",
  "catatan": "Keperluan keluarga"
}
```

**PUT** `/api/pengajuan/:id` - Update status
```json
{
  "status": "approved",
  "catatan": "Disetujui"
}
```

**DELETE** `/api/pengajuan/:id` - Delete pengajuan

**GET** `/api/pengajuan/stats/dashboard` - Get statistics

**GET** `/api/pengajuan/report` - Get report with filters

## 🔐 Security

- JWT authentication
- Password hashing dengan bcrypt
- CORS protection
- File upload validation
- SQL injection protection (prepared statements)

## 📝 License

MIT

## 👥 Support

Untuk bantuan, silakan buka issue di repository ini.
