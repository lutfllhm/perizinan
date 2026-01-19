# 🏢 Aplikasi Perizinan Cuti/Lembur IWARE

Aplikasi web modern untuk mengelola perizinan cuti dan lembur dengan interface yang interaktif dan responsif.

## 🚀 Quick Start

```bash
# Setup lengkap (otomatis)
setup-mysql.bat

# Atau manual:
cd backend
npm install
node scripts/init-database.js
npm start
```

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MySQL + mysql2
- JWT Authentication
- bcryptjs untuk password hashing

**Frontend:**
- React 18
- React Router v6
- Axios
- Tailwind CSS
- Framer Motion
- Recharts

## 📁 Struktur Project

```
iware-perizinan/
├── backend/              # Node.js + Express API
│   ├── config/          # Database & configuration
│   ├── middleware/      # Authentication middleware
│   ├── routes/          # API routes
│   ├── scripts/         # Helper scripts
│   └── server.js        # Main server file
├── frontend/            # React application
│   ├── public/          # Static files
│   └── src/             # React components
├── DEPLOYMENT-GUIDE.md  # Panduan deployment lengkap
├── QUICK-DEPLOY.md      # Checklist deployment cepat
└── deploy-helper.js     # Script helper deployment
```

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs untuk password hashing

**Frontend:**
- React 18
- React Router v6
- Axios
- Tailwind CSS
- Framer Motion
- Recharts

## 📦 Deployment Platforms

- **Backend**: Railway atau Heroku
- **Database**: MongoDB Atlas (gratis) atau Railway
- **Frontend**: Railway atau Vercel

## 🔐 Default Credentials

Setelah deployment, login dengan:
- Username: `admin`
- Password: `password`

**⚠️ PENTING**: Segera ganti password setelah login pertama!

## 📚 Documentation

### Setup & Installation
- **[SETUP_MYSQL.md](./SETUP_MYSQL.md)** ⭐ - Panduan lengkap setup MySQL
- **[MIGRASI_KEMBALI_KE_MYSQL.md](./MIGRASI_KEMBALI_KE_MYSQL.md)** - Changelog migrasi ke MySQL
- **[README.md](./README.md)** - Overview project

### Deployment
- **[DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md)** - Deploy ke Railway
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Checklist deployment

### Backend
- **[backend/README.md](./backend/README.md)** - Backend documentation
- **[backend/scripts/README.md](./backend/scripts/README.md)** - Helper scripts

## 🧪 Testing

```bash
# Check deployment readiness
cd backend
npm run deploy-check

# Generate JWT secret
node scripts/generate-jwt-secret.js

# Test backend health (production)
curl https://your-backend-url.railway.app/api/health

# Test login (production)
curl -X POST https://your-backend-url.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test database connection (via Railway CLI)
railway connect mysql
```

## 🔧 Helper Scripts

```bash
# Backend scripts
cd backend

# Initialize database
npm run init-db

# Check deployment readiness
npm run deploy-check

# Generate JWT secret
node scripts/generate-jwt-secret.js

# Create admin user
node scripts/create-admin.js

# Debug login
node scripts/debug-login.js

# Test Railway connection
node scripts/test-railway-connection.js
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## Lisensi

© 2024 IWARE. All rights reserved.
