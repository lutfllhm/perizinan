# 📚 Dokumentasi Aplikasi Perizinan IWARE

## 🎯 Mulai Di Sini

### Untuk Deploy ke Railway
👉 **[READY_TO_DEPLOY.md](./READY_TO_DEPLOY.md)** - Status & overview deployment

### Untuk Development Lokal
👉 **[QUICK_START.md](./QUICK_START.md)** - Setup lokal dalam 5 menit

---

## 📖 Dokumentasi Lengkap

### Deployment
1. **[READY_TO_DEPLOY.md](./READY_TO_DEPLOY.md)** ⭐ START HERE
   - Status deployment
   - Quick overview
   - Architecture diagram
   - Next steps

2. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** ✅ RECOMMENDED
   - Step-by-step checklist
   - Verification steps
   - Troubleshooting guide
   - Environment variables

3. **[RAILWAY_DEPLOY_GUIDE.md](./RAILWAY_DEPLOY_GUIDE.md)** 📖 DETAILED
   - Complete deployment guide
   - Detailed explanations
   - Best practices
   - Monitoring & security

### Development
4. **[QUICK_START.md](./QUICK_START.md)** 🏃 LOCAL DEV
   - Local installation
   - Database setup
   - Running the app
   - API documentation
   - Troubleshooting

5. **[README.md](./README.md)** 📋 OVERVIEW
   - Project overview
   - Tech stack
   - Features
   - Quick commands

### Reference
6. **[CHANGELOG.md](./CHANGELOG.md)** 📝 HISTORY
   - Version history
   - Breaking changes
   - New features
   - Migration notes

7. **[backend/README.md](./backend/README.md)** 🔧 BACKEND
   - Backend documentation
   - API endpoints
   - Database schema
   - Scripts

---

## 🚀 Quick Navigation

### I want to...

#### Deploy to Railway
1. Read [READY_TO_DEPLOY.md](./READY_TO_DEPLOY.md)
2. Follow [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
3. Reference [RAILWAY_DEPLOY_GUIDE.md](./RAILWAY_DEPLOY_GUIDE.md) if needed

#### Run Locally
1. Follow [QUICK_START.md](./QUICK_START.md)
2. Check [README.md](./README.md) for commands

#### Understand the Project
1. Read [README.md](./README.md)
2. Check [CHANGELOG.md](./CHANGELOG.md)
3. Review [backend/README.md](./backend/README.md)

#### Troubleshoot Issues
1. Check [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Troubleshooting section
2. Check [QUICK_START.md](./QUICK_START.md) - Troubleshooting section
3. Review logs in Railway Dashboard

---

## 📁 File Structure

```
iware-perizinan/
├── 📚 Documentation
│   ├── INDEX.md (this file)
│   ├── READY_TO_DEPLOY.md ⭐
│   ├── DEPLOYMENT_CHECKLIST.md ✅
│   ├── RAILWAY_DEPLOY_GUIDE.md 📖
│   ├── QUICK_START.md 🏃
│   ├── README.md 📋
│   └── CHANGELOG.md 📝
│
├── 🔧 Backend
│   ├── config/
│   │   └── mysql.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── pengajuan.js
│   ├── scripts/
│   │   ├── init-database.js
│   │   ├── init-railway-db.js
│   │   └── generate-jwt-secret.js
│   ├── .env.railway (template)
│   ├── railway.json
│   ├── Procfile
│   ├── nixpacks.toml
│   └── server.js
│
├── 🎨 Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   ├── .env.railway (template)
│   ├── railway.json
│   ├── Procfile
│   └── nixpacks.toml
│
├── 🗄️ Database
│   └── iware_perizinan.sql
│
└── 🛠️ Tools
    ├── deploy-check.js
    └── package.json
```

---

## 🎯 Common Tasks

### Check Deployment Readiness
```bash
npm run deploy-check
```

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Initialize Local Database
```bash
cd backend
npm run init-db
```

### Initialize Railway Database
```bash
railway run npm run init-railway-db
```

### Test Database Connection
```bash
cd backend
npm run test-db
```

### Run Development
```bash
npm run dev
```

### Build Frontend
```bash
cd frontend
npm run build
```

---

## 🔐 Default Credentials

**Admin:**
- Username: `admin`
- Password: `admin123`

**HRD:**
- Username: `hrd`
- Password: `hrd123`

**⚠️ IMPORTANT**: Change passwords after first login!

---

## 🌐 URLs

### Local Development
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API: http://localhost:5000/api
- Health: http://localhost:5000/api/health

### Railway Production
- Frontend: https://your-frontend.up.railway.app
- Backend: https://your-backend.up.railway.app
- API: https://your-backend.up.railway.app/api
- Health: https://your-backend.up.railway.app/api/health

---

## 📊 Tech Stack

**Backend:**
- Node.js 18
- Express.js
- MySQL
- JWT Authentication

**Frontend:**
- React 18
- Tailwind CSS
- Framer Motion
- Recharts

**Deployment:**
- Railway
- Nixpacks
- GitHub

---

## 🆘 Need Help?

### Documentation
1. Check relevant documentation above
2. Search for your issue in docs
3. Check troubleshooting sections

### Railway Support
- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app)

### Project Support
- Open issue in repository
- Check [CHANGELOG.md](./CHANGELOG.md) for known issues
- Review logs in Railway Dashboard

---

## ✅ Deployment Status

Run `npm run deploy-check` to verify:

- ✅ All required files present
- ✅ Configuration files valid
- ✅ Scripts configured
- ⚠️ Environment variables need updating

---

## 🎉 Ready to Start?

### For Deployment:
👉 Go to [READY_TO_DEPLOY.md](./READY_TO_DEPLOY.md)

### For Local Development:
👉 Go to [QUICK_START.md](./QUICK_START.md)

---

**Made with ❤️ by IWARE Team**

Last Updated: January 20, 2026
