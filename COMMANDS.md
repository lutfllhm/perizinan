# 🔧 Command Reference

Quick reference untuk semua commands yang sering digunakan.

---

## 📦 Installation

### Install All Dependencies
```bash
npm run install:all
```

### Install Backend Only
```bash
cd backend
npm install
```

### Install Frontend Only
```bash
cd frontend
npm install
```

---

## 🚀 Development

### Run Both (Concurrent)
```bash
npm run dev
```

### Run Backend Only
```bash
cd backend
npm run dev
# atau
npm start
```

### Run Frontend Only
```bash
cd frontend
npm start
# atau
npm run dev
```

---

## 🗄️ Database

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

### Import SQL File
```bash
mysql -u root -p iware_perizinan < iware_perizinan.sql
```

---

## 🔐 Security

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Generate JWT Secret (Backend)
```bash
cd backend
node scripts/generate-jwt-secret.js
```

---

## 🧪 Testing

### Check Deployment Readiness
```bash
npm run deploy-check
```

### Test Backend Health (Local)
```bash
curl http://localhost:5000/api/health
```

### Test Backend Health (Production)
```bash
curl https://your-backend.up.railway.app/api/health
```

### Test Login (Local)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Test Login (Production)
```bash
curl -X POST https://your-backend.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 🏗️ Build

### Build Frontend
```bash
cd frontend
npm run build
```

### Serve Frontend Build
```bash
cd frontend
npm run serve
```

### Build & Serve
```bash
cd frontend
npm run build && npm run serve
```

---

## 🚂 Railway CLI

### Install Railway CLI
```bash
npm install -g @railway/cli
```

### Login to Railway
```bash
railway login
```

### Link Project
```bash
railway link
```

### Select Service
```bash
railway service
```

### Run Command in Railway
```bash
railway run <command>
```

### View Logs
```bash
railway logs
```

### View Logs (Specific Service)
```bash
railway logs --service backend
railway logs --service frontend
railway logs --service mysql
```

### Deploy
```bash
railway up
```

### Connect to MySQL
```bash
railway connect mysql
```

### Open Dashboard
```bash
railway open
```

---

## 🔍 Debugging

### View Backend Logs (Local)
```bash
cd backend
npm run dev
# Logs akan muncul di terminal
```

### View Frontend Logs (Local)
```bash
cd frontend
npm start
# Logs akan muncul di terminal
```

### Check Port Usage (Windows)
```bash
# Check port 5000 (Backend)
netstat -ano | findstr :5000

# Check port 3000 (Frontend)
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

### Check Port Usage (Linux/Mac)
```bash
# Check port 5000 (Backend)
lsof -ti:5000

# Check port 3000 (Frontend)
lsof -ti:3000

# Kill process
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

---

## 📊 Database Commands

### MySQL Login
```bash
mysql -u root -p
```

### Create Database
```sql
CREATE DATABASE iware_perizinan;
```

### Use Database
```sql
USE iware_perizinan;
```

### Show Tables
```sql
SHOW TABLES;
```

### Describe Table
```sql
DESCRIBE users;
DESCRIBE pengajuan;
```

### View Users
```sql
SELECT * FROM users;
```

### View Pengajuan
```sql
SELECT * FROM pengajuan;
```

### Drop Database (DANGER!)
```sql
DROP DATABASE iware_perizinan;
```

---

## 🔄 Git Commands

### Check Status
```bash
git status
```

### Add All Changes
```bash
git add .
```

### Commit Changes
```bash
git commit -m "Your message"
```

### Push to GitHub
```bash
git push origin main
```

### Pull Latest Changes
```bash
git pull origin main
```

### Create New Branch
```bash
git checkout -b feature/your-feature
```

### Switch Branch
```bash
git checkout main
```

---

## 🧹 Cleanup

### Remove node_modules
```bash
# Windows
rmdir /s /q node_modules
rmdir /s /q backend\node_modules
rmdir /s /q frontend\node_modules

# Linux/Mac
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules
```

### Remove build files
```bash
# Windows
rmdir /s /q frontend\build

# Linux/Mac
rm -rf frontend/build
```

### Clean Install
```bash
# Remove and reinstall
npm run install:all
```

---

## 📝 Environment Variables

### Copy Environment Templates
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### Edit Environment Files
```bash
# Windows
notepad backend\.env
notepad frontend\.env

# Linux/Mac
nano backend/.env
nano frontend/.env
```

---

## 🔧 Package Management

### Update Dependencies
```bash
npm update
```

### Check Outdated Packages
```bash
npm outdated
```

### Install Specific Package
```bash
npm install <package-name>
```

### Install Dev Dependency
```bash
npm install --save-dev <package-name>
```

### Uninstall Package
```bash
npm uninstall <package-name>
```

---

## 📦 Railway Deployment

### Deploy Backend
```bash
cd backend
railway up
```

### Deploy Frontend
```bash
cd frontend
railway up
```

### Set Environment Variable
```bash
railway variables set KEY=value
```

### Get Environment Variables
```bash
railway variables
```

---

## 🆘 Emergency Commands

### Kill All Node Processes (Windows)
```bash
taskkill /F /IM node.exe
```

### Kill All Node Processes (Linux/Mac)
```bash
killall node
```

### Reset Database
```bash
cd backend
npm run init-db
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Everything
```bash
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
npm run install:all
```

---

## 📚 Documentation Commands

### View Documentation
```bash
# Windows
start INDEX.md
start READY_TO_DEPLOY.md
start DEPLOYMENT_CHECKLIST.md

# Linux/Mac
open INDEX.md
open READY_TO_DEPLOY.md
open DEPLOYMENT_CHECKLIST.md
```

---

## 🎯 Quick Workflows

### Fresh Start (Local)
```bash
npm run install:all
cd backend
npm run init-db
cd ..
npm run dev
```

### Deploy to Railway
```bash
npm run deploy-check
railway login
railway link
cd backend
railway up
cd ../frontend
railway up
```

### Update Production
```bash
git add .
git commit -m "Update"
git push origin main
# Railway auto-deploys
```

---

## 💡 Tips

### Run Multiple Commands
```bash
# Windows (cmd)
command1 & command2 & command3

# Windows (PowerShell)
command1; command2; command3

# Linux/Mac
command1 && command2 && command3
```

### Background Process (Linux/Mac)
```bash
npm start &
```

### View Process
```bash
# Windows
tasklist | findstr node

# Linux/Mac
ps aux | grep node
```

---

**Quick Reference untuk Development & Deployment**

Last Updated: January 20, 2026
