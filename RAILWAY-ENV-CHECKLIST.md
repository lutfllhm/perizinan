# Railway Environment Variables Checklist ✅

## 🔐 Required Environment Variables

### Auto-Generated (dari MySQL Database)
Ini akan otomatis ter-set saat Anda add MySQL database di Railway:

```bash
✅ MYSQLHOST=containers-us-west-xxx.railway.app
✅ MYSQLPORT=6379
✅ MYSQLUSER=root
✅ MYSQLDATABASE=railway
✅ MYSQLPASSWORD=xxxxxxxxxxxxx
```

**Cara Cek:**
1. Buka Railway Dashboard
2. Klik MySQL service
3. Tab "Variables"
4. Copy semua variables
5. Paste ke Backend service variables

### Manual Setup (WAJIB)

```bash
# Environment
NODE_ENV=production

# JWT Secret (Generate dengan command di bawah)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Frontend URL (Ganti dengan Vercel URL Anda)
FRONTEND_URL=https://your-app.vercel.app
```

---

## 🔑 Generate JWT Secret

### Option 1: Node.js
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Option 2: OpenSSL
```bash
openssl rand -hex 64
```

### Option 3: Online Generator
- https://www.grc.com/passwords.htm
- Pilih "63 random alpha-numeric characters"

**Example:**
```
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

---

## 📋 Complete Environment Variables Template

Copy-paste ini ke Railway Backend service → Variables:

```bash
# Database (Auto-generated dari MySQL service)
MYSQLHOST=containers-us-west-xxx.railway.app
MYSQLPORT=6379
MYSQLUSER=root
MYSQLDATABASE=railway
MYSQLPASSWORD=xxxxxxxxxxxxx

# Application
NODE_ENV=production
PORT=5000

# Security
JWT_SECRET=your-generated-jwt-secret-here

# CORS
FRONTEND_URL=https://your-app.vercel.app
```

---

## 🔍 Verification

### 1. Check Variables di Railway
```bash
railway variables
```

Output harus menunjukkan semua variables di atas.

### 2. Test Connection
```bash
# Health check
curl https://your-app.up.railway.app/api/health

# Expected response:
{
  "status": "OK",
  "message": "Server berjalan dengan baik",
  "timestamp": "2026-02-09T...",
  "env": "production",
  "database": "MySQL"
}
```

### 3. Test Database Connection
```bash
# Get karyawan
curl https://your-app.up.railway.app/api/karyawan

# Expected: Array of karyawan data
```

---

## 🐛 Common Issues

### Error: "Cannot connect to database"
**Cause:** MySQL variables tidak ter-set

**Solution:**
1. Pastikan MySQL service sudah running
2. Copy variables dari MySQL service
3. Paste ke Backend service
4. Redeploy backend

### Error: "JWT secret not configured"
**Cause:** `JWT_SECRET` tidak ada atau terlalu pendek

**Solution:**
1. Generate JWT secret (min 32 characters)
2. Add ke Railway variables
3. Redeploy backend

### Error: "CORS blocked"
**Cause:** `FRONTEND_URL` tidak match dengan Vercel URL

**Solution:**
1. Cek Vercel URL (https://your-app.vercel.app)
2. Update `FRONTEND_URL` di Railway
3. Redeploy backend

---

## 🔄 Update Environment Variables

### Via Railway Dashboard
1. Klik Backend service
2. Tab "Variables"
3. Edit atau add variable
4. Klik "Save"
5. Railway akan auto-redeploy

### Via Railway CLI
```bash
# Set single variable
railway variables set JWT_SECRET=your-secret

# Set multiple variables
railway variables set NODE_ENV=production FRONTEND_URL=https://your-app.vercel.app

# View all variables
railway variables
```

---

## 🔐 Security Best Practices

### ✅ DO:
- Generate strong JWT secret (min 64 characters)
- Use different secrets untuk production & development
- Rotate JWT secret secara berkala
- Gunakan HTTPS untuk semua connections
- Set `NODE_ENV=production` di production

### ❌ DON'T:
- Commit `.env` file ke Git
- Share JWT secret di public
- Use weak atau predictable secrets
- Use same secret untuk multiple projects
- Hardcode secrets di code

---

## 📊 Environment Variables Priority

Railway menggunakan priority ini:

1. **Service Variables** (Highest priority)
   - Set di Railway Dashboard → Service → Variables

2. **Shared Variables**
   - Set di Railway Dashboard → Project → Variables

3. **Plugin Variables**
   - Auto-generated dari MySQL, Redis, etc.

4. **`.env` file** (Lowest priority)
   - Hanya untuk local development
   - Tidak ter-deploy ke Railway

**Recommendation:** Set semua variables di Service Variables untuk clarity.

---

## 🎯 Final Checklist

Sebelum deploy, pastikan:

- [ ] MySQL service running di Railway
- [ ] MySQL variables ter-copy ke Backend service
- [ ] `NODE_ENV=production` ter-set
- [ ] `JWT_SECRET` ter-generate dan ter-set (min 32 chars)
- [ ] `FRONTEND_URL` match dengan Vercel URL
- [ ] `PORT=5000` ter-set (optional, default 5000)
- [ ] Test `/api/health` endpoint
- [ ] Test `/api/karyawan` endpoint
- [ ] Frontend bisa connect ke backend
- [ ] Login works
- [ ] CORS tidak error

---

## 📞 Need Help?

**Check Logs:**
```bash
railway logs --service backend
```

**Common Log Messages:**

✅ **Success:**
```
✅ Database connection successful!
✅ Database tables initialized successfully!
🚀 Server berjalan di port 5000
```

❌ **Error:**
```
❌ Database connection failed
❌ JWT secret not configured
❌ CORS blocked origin
```

**Solution:** Check environment variables dan redeploy.

---

## 🎉 Done!

Environment variables sudah configured dengan benar!

**Next Steps:**
1. Push code ke GitHub
2. Railway auto-deploy
3. Database auto-migrate
4. Test API endpoints
5. Update Vercel frontend URL
6. Test full application

Happy deploying! 🚀
