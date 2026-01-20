# 🏢 Aplikasi Perizinan Cuti/Lembur IWARE

Aplikasi web modern untuk mengelola perizinan cuti dan lembur dengan interface yang interaktif dan responsif.

## ✨ Features

- 📝 Pengajuan perizinan cuti/lembur online
- 👥 Multi-role (Admin & HRD)
- 📊 Dashboard dengan statistik real-time
- 📈 Laporan dan analytics
- 🔐 Autentikasi JWT
- 📱 Responsive design
- 🎨 Modern UI dengan Tailwind CSS

## 🚀 Quick Start

### Lokal Development
```bash
# Install dependencies
npm run install:all

# Setup database
cd backend
npm run init-db

# Run development
npm run dev
```

Lihat [QUICK_START.md](./QUICK_START.md) untuk panduan lengkap.

### Deploy ke Railway
```bash
# 1. Deploy MySQL
# 2. Deploy Backend (link ke MySQL)
# 3. Deploy Frontend
# 4. Initialize database
railway run npm run init-railway-db
```

Lihat [RAILWAY_DEPLOY_GUIDE.md](./RAILWAY_DEPLOY_GUIDE.md) untuk panduan lengkap.

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MySQL + mysql2
- JWT Authentication
- bcryptjs untuk password hashing
- Multer untuk file upload

**Frontend:**
- React 18
- React Router v6
- Axios
- Tailwind CSS
- Framer Motion
- Recharts
- React Icons
- React Toastify

## 📁 Struktur Project

```
iware-perizinan/
├── backend/              # Node.js + Express API
│   ├── config/          # MySQL configuration
│   ├── middleware/      # Authentication middleware
│   ├── routes/          # API routes (auth, pengajuan)
│   ├── scripts/         # Helper scripts
│   ├── uploads/         # File uploads
│   ├── .env.railway     # Railway env template
│   └── server.js        # Main server file
├── frontend/            # React application
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── utils/       # API client
│   ├── .env.railway     # Railway env template
│   └── package.json
├── iware_perizinan.sql  # Database schema
├── QUICK_START.md       # Quick start guide
├── RAILWAY_DEPLOY_GUIDE.md  # Railway deployment guide
└── README.md
```

## 🔐 Default Credentials

**Admin:**
- Username: `admin`
- Password: `admin123`

**HRD:**
- Username: `hrd`
- Password: `hrd123`

**⚠️ PENTING**: Ganti password default setelah login pertama!

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Setup lokal & quick start
- **[RAILWAY_DEPLOY_GUIDE.md](./RAILWAY_DEPLOY_GUIDE.md)** - Deploy ke Railway
- **[backend/README.md](./backend/README.md)** - Backend documentation
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Pengajuan
- `GET /api/pengajuan` - Get all pengajuan
- `POST /api/pengajuan` - Create pengajuan
- `PUT /api/pengajuan/:id` - Update status
- `DELETE /api/pengajuan/:id` - Delete pengajuan
- `GET /api/pengajuan/stats/dashboard` - Get statistics
- `GET /api/pengajuan/report` - Get report with filters

### Health Check
- `GET /api/health` - Server health status

## 🧪 Testing

```bash
# Test database connection
cd backend
npm run test-db

# Test backend health
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 🔧 Available Scripts

### Root
- `npm run install:all` - Install all dependencies
- `npm run dev` - Run backend + frontend concurrently

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm run init-db` - Initialize local database
- `npm run init-railway-db` - Initialize Railway database
- `npm run test-db` - Test MySQL connection

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Serve production build

## 🚀 Deployment

### Railway (Recommended)
1. Deploy MySQL service
2. Deploy Backend (link ke MySQL)
3. Deploy Frontend
4. Initialize database

Lihat [RAILWAY_DEPLOY_GUIDE.md](./RAILWAY_DEPLOY_GUIDE.md)

### Platforms Supported
- **Backend**: Railway, Heroku, Render
- **Database**: Railway MySQL, PlanetScale, AWS RDS
- **Frontend**: Railway, Vercel, Netlify

## 🐛 Troubleshooting

### MySQL Connection Error
```bash
# Check MySQL service
npm run test-db

# Initialize database
npm run init-db
```

### CORS Error
Pastikan `FRONTEND_URL` di backend `.env` sudah benar.

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

Lihat [QUICK_START.md](./QUICK_START.md) untuk troubleshooting lengkap.

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

© 2026 IWARE. All rights reserved.

## 👥 Support

Untuk bantuan:
- Buka issue di repository
- Email: support@iware.com
- Dokumentasi: [QUICK_START.md](./QUICK_START.md)

---

**Made with ❤️ by IWARE Team**
