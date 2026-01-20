# 🚀 Railway Deployment Setup

## ✅ MySQL Railway Credentials

```env
MYSQLHOST=${{RAILWAY_PRIVATE_DOMAIN}}
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=BSDUfqXevxLoqlxpsmTDQoUGXQwRlluk
MYSQLDATABASE=railway
```

## 📋 Backend Environment Variables

Copy ini ke Railway Dashboard → Backend Service → Variables → RAW Editor:

```env
NODE_ENV=production
PORT=5000
MYSQLHOST=${{RAILWAY_PRIVATE_DOMAIN}}
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=BSDUfqXevxLoqlxpsmTDQoUGXQwRlluk
MYSQLDATABASE=railway
JWT_SECRET=b5f51c7f57f3f0d20b421741b7ed371fc1686d67a0b43d45f2879a892b81088d30ff54563b270beaf5b8d95e09cda72c1b5d22b71b50a21d35b28238d8284abe8
FRONTEND_URL=http://localhost:3000
```

## 🎯 Deployment Steps

### 1. Deploy Backend
1. Railway Dashboard → New → GitHub Repo
2. Settings → Root Directory: `backend`
3. Variables → Set environment variables (lihat di atas)
4. Settings → Generate Domain
5. Save backend URL

### 2. Initialize Database
```bash
npm install -g @railway/cli
railway login
railway link
railway run node scripts/init-railway-db.js
```

### 3. Deploy Frontend
1. Railway Dashboard → New → GitHub Repo (same repo)
2. Settings → Root Directory: `frontend`
3. Variables → Add:
   - `REACT_APP_API_URL` = `https://your-backend-url.up.railway.app`
4. Settings → Generate Domain

### 4. Update Backend FRONTEND_URL
1. Backend Service → Variables
2. Edit `FRONTEND_URL` → `https://your-frontend-url.up.railway.app`
3. Save (auto-redeploy)

## 🧪 Testing

```bash
# Test backend
curl https://your-backend-url.up.railway.app/api/health

# Test login
curl -X POST https://your-backend-url.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 🔧 Troubleshooting

### Backend Error: ECONNREFUSED
→ Set environment variables di Railway Dashboard (tidak otomatis baca .env file)

### Frontend Error: npm EBUSY
→ Sudah fixed di `frontend/nixpacks.toml` dan `frontend/.npmrc`

### CORS Error
→ Update `FRONTEND_URL` di backend variables

## 📚 Files Reference

- `backend/.env.railway` - Template environment variables
- `backend/test-railway-mysql.js` - Test MySQL connection
- `backend/scripts/init-railway-db.js` - Initialize database
- `frontend/nixpacks.toml` - Frontend build configuration
- `frontend/.npmrc` - NPM configuration

## ✅ Checklist

- [x] MySQL deployed
- [x] Credentials configured
- [x] JWT secret generated
- [ ] Backend deployed
- [ ] Database initialized
- [ ] Frontend deployed
- [ ] FRONTEND_URL updated
- [ ] Full integration test

---

**Default Login:** admin / admin123
