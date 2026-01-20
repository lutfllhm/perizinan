# 🚀 READY TO DEPLOY!

## ✅ Status: DEPLOYMENT READY

Aplikasi Anda sudah siap untuk di-deploy ke Railway!

## 📦 What's Included

### Backend
- ✅ Express.js server with MySQL
- ✅ JWT authentication
- ✅ File upload support
- ✅ Health check endpoint
- ✅ Auto database initialization
- ✅ Railway configuration
- ✅ CORS configured for Railway domains

### Frontend
- ✅ React 18 application
- ✅ Responsive design with Tailwind CSS
- ✅ Admin & HRD dashboards
- ✅ Public submission form
- ✅ Charts and statistics
- ✅ Railway build configuration

### Database
- ✅ MySQL schema ready
- ✅ Auto-initialization script
- ✅ Default admin user
- ✅ Sample data structure

## 🎯 Quick Deploy (5 Steps)

### 1. Deploy MySQL (2 minutes)
```
Railway Dashboard → New Project → Deploy MySQL
```

### 2. Deploy Backend (3 minutes)
```
New Service → GitHub Repo → Root: backend
Add Variables: NODE_ENV, PORT, JWT_SECRET, FRONTEND_URL
Link to MySQL service
Generate Domain
```

### 3. Initialize Database (1 minute)
```bash
railway run npm run init-railway-db
```

### 4. Deploy Frontend (3 minutes)
```
New Service → GitHub Repo → Root: frontend
Add Variable: REACT_APP_API_URL=<backend-url>
Generate Domain
```

### 5. Update Backend CORS (1 minute)
```
Backend Variables → FRONTEND_URL=<frontend-url>
```

**Total Time: ~10 minutes**

## 📚 Documentation

### Start Here
1. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** ⭐
   - Step-by-step checklist
   - Verification steps
   - Troubleshooting

2. **[RAILWAY_DEPLOY_GUIDE.md](./RAILWAY_DEPLOY_GUIDE.md)** 📖
   - Complete deployment guide
   - Detailed explanations
   - Best practices

3. **[QUICK_START.md](./QUICK_START.md)** 🏃
   - Local development setup
   - Testing guide
   - API documentation

### Reference
- **[README.md](./README.md)** - Project overview
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history
- **[backend/README.md](./backend/README.md)** - Backend docs

## 🔐 Default Credentials

After deployment, login with:
- **Username**: `admin`
- **Password**: `admin123`

**⚠️ IMPORTANT**: Change password after first login!

## 🧪 Pre-Deployment Check

Run this command to verify everything is ready:

```bash
npm run deploy-check
```

Expected output:
```
✅ DEPLOYMENT READY!
```

## 📋 Environment Variables Needed

### Backend (Railway)
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=<generate-with-crypto>
FRONTEND_URL=<frontend-domain>
```

Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend (Railway)
```env
REACT_APP_API_URL=<backend-domain>
```

**Note**: Railway will auto-inject MySQL variables when you link services.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│           Railway Project                    │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────────────┐                           │
│  │    MySQL     │                           │
│  │   Service    │                           │
│  └──────┬───────┘                           │
│         │                                    │
│         │ (linked)                           │
│         │                                    │
│  ┌──────▼───────┐      ┌──────────────┐    │
│  │   Backend    │◄─────┤   Frontend   │    │
│  │   Service    │ CORS │   Service    │    │
│  │              │      │              │    │
│  │ Node.js +    │      │   React +    │    │
│  │ Express      │      │   Tailwind   │    │
│  └──────────────┘      └──────────────┘    │
│         │                      │             │
│         │                      │             │
└─────────┼──────────────────────┼─────────────┘
          │                      │
          ▼                      ▼
    backend.up.railway.app  frontend.up.railway.app
```

## 🎯 Features

### For Users
- 📝 Submit perizinan online
- 📸 Upload supporting documents
- 📊 Track submission status
- 📱 Mobile-friendly interface

### For Admin/HRD
- 👥 Manage submissions
- ✅ Approve/reject requests
- 📈 View statistics and reports
- 📊 Dashboard with charts
- 🔍 Filter and search
- 📥 Export reports

## 🔧 Tech Stack

**Backend:**
- Node.js 18
- Express.js
- MySQL (Railway)
- JWT Authentication
- Multer (file upload)
- bcryptjs (password hashing)

**Frontend:**
- React 18
- React Router v6
- Axios
- Tailwind CSS
- Framer Motion
- Recharts
- React Icons
- React Toastify

**Deployment:**
- Railway (PaaS)
- Nixpacks (build)
- GitHub (source)

## 📊 Database Schema

### users
```sql
id INT PRIMARY KEY AUTO_INCREMENT
username VARCHAR(50) UNIQUE
password VARCHAR(255)
nama VARCHAR(100)
role ENUM('admin', 'hrd')
created_at TIMESTAMP
```

### pengajuan
```sql
id INT PRIMARY KEY AUTO_INCREMENT
nama VARCHAR(100)
no_telp VARCHAR(20)
jenis_perizinan VARCHAR(50)
tanggal_mulai DATETIME
tanggal_selesai DATETIME
bukti_foto VARCHAR(255)
status ENUM('pending', 'approved', 'rejected')
catatan TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Pengajuan
- `GET /api/pengajuan` - Get all
- `POST /api/pengajuan` - Create
- `PUT /api/pengajuan/:id` - Update status
- `DELETE /api/pengajuan/:id` - Delete
- `GET /api/pengajuan/stats/dashboard` - Statistics
- `GET /api/pengajuan/report` - Report with filters

### Health
- `GET /api/health` - Server status

## 🐛 Common Issues & Solutions

### Issue: Backend can't connect to MySQL
**Solution**: Make sure backend service is linked to MySQL service in Railway

### Issue: Frontend can't reach backend
**Solution**: Check `REACT_APP_API_URL` is correct (without `/api` suffix)

### Issue: CORS error
**Solution**: Set `FRONTEND_URL` in backend to match frontend domain exactly

### Issue: Database not initialized
**Solution**: Run `railway run npm run init-railway-db`

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for more troubleshooting.

## 💰 Cost

**Railway Free Tier:**
- $5 credit/month
- Enough for 3 services (MySQL + Backend + Frontend)
- Perfect for development/testing

**Upgrade for Production:**
- Hobby: $5/month per service
- Pro: $20/month per service

## 📞 Support

Need help?
1. Check [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
2. Check [RAILWAY_DEPLOY_GUIDE.md](./RAILWAY_DEPLOY_GUIDE.md)
3. Check [Railway Docs](https://docs.railway.app)
4. Open an issue in repository

## ✨ Next Steps

After deployment:
1. ✅ Test all features
2. ✅ Change default password
3. ✅ Add custom domain (optional)
4. ✅ Set up monitoring
5. ✅ Configure backups
6. ✅ Share with team

---

## 🚀 Ready to Deploy?

Choose your path:

### Option A: Quick Deploy (Recommended)
Follow [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

### Option B: Detailed Guide
Read [RAILWAY_DEPLOY_GUIDE.md](./RAILWAY_DEPLOY_GUIDE.md)

### Option C: Local Testing First
See [QUICK_START.md](./QUICK_START.md)

---

**🎉 Good luck with your deployment!**

Made with ❤️ by IWARE Team
