# Vercel Environment Variables Setup 🚀

## 📋 Environment Variables untuk Frontend di Vercel

### Required Environment Variable

Hanya ada **1 environment variable** yang diperlukan untuk frontend:

```bash
REACT_APP_API_URL=https://your-backend.up.railway.app
```

---

## 🔧 Cara Setup di Vercel Dashboard

### Step 1: Buka Vercel Project Settings

1. Login ke https://vercel.com
2. Pilih project frontend Anda
3. Klik **Settings** (tab di atas)
4. Klik **Environment Variables** (menu di kiri)

### Step 2: Add Environment Variable

1. Klik **Add New**
2. Isi form:

   **Name:**
   ```
   REACT_APP_API_URL
   ```

   **Value:**
   ```
   https://your-backend.up.railway.app
   ```
   
   ⚠️ **PENTING:** Ganti `your-backend.up.railway.app` dengan URL Railway backend Anda!

   **Environment:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

3. Klik **Save**

### Step 3: Redeploy

Setelah save environment variable, Vercel akan otomatis trigger redeploy.

Atau manual redeploy:
1. Tab **Deployments**
2. Klik **...** (three dots) di deployment terbaru
3. Klik **Redeploy**

---

## 🔍 Cara Mendapatkan Railway Backend URL

### Option 1: Via Railway Dashboard

1. Login ke https://railway.app
2. Klik **Backend service**
3. Tab **Settings**
4. Scroll ke **Networking**
5. Copy **Public URL**
   - Format: `https://xxx-production-xxxx.up.railway.app`

### Option 2: Via Railway CLI

```bash
railway status
```

Output akan menunjukkan URL backend.

---

## ✅ Verification

### 1. Check Environment Variable

Di Vercel Dashboard → Settings → Environment Variables:

```
Name: REACT_APP_API_URL
Value: https://your-backend.up.railway.app
Environments: Production, Preview, Development
```

### 2. Test Frontend

Setelah redeploy, buka frontend Vercel URL:

```
https://your-app.vercel.app
```

**Test:**
1. Buka browser console (F12)
2. Cek network tab
3. Login atau buka form pengajuan
4. API calls harus ke Railway URL
5. Tidak ada CORS error

### 3. Test API Connection

```bash
# Test dari browser console
fetch('https://your-backend.up.railway.app/api/health')
  .then(r => r.json())
  .then(d => console.log(d))

# Expected output:
{
  "status": "OK",
  "message": "Server berjalan dengan baik",
  "timestamp": "2026-02-09T...",
  "env": "production",
  "database": "MySQL"
}
```

---

## 🐛 Troubleshooting

### Issue 1: CORS Error

**Symptoms:**
```
Access to fetch at 'https://xxx.up.railway.app/api/...' from origin 'https://your-app.vercel.app' has been blocked by CORS policy
```

**Solution:**

1. **Update Railway Backend Environment Variable:**
   
   Railway Dashboard → Backend service → Variables:
   
   ```bash
   FRONTEND_URL=https://your-app.vercel.app
   ```
   
   ⚠️ Ganti dengan Vercel URL Anda!

2. **Redeploy Railway Backend:**
   
   Railway akan auto-redeploy setelah update environment variable.

3. **Verify CORS di Backend Code:**
   
   File `backend/server.js` sudah include:
   ```javascript
   const allowedOrigins = [
     'http://localhost:3000',
     'http://localhost:5000',
     process.env.FRONTEND_URL,
     /\.up\.railway\.app$/
   ].filter(Boolean);
   ```

### Issue 2: API URL Tidak Terbaca

**Symptoms:**
- API calls ke `undefined/api/...`
- Network error di browser console

**Solution:**

1. **Check Environment Variable Name:**
   
   Harus **REACT_APP_API_URL** (bukan REACT_APP_BACKEND_URL atau lainnya)

2. **Redeploy Vercel:**
   
   Environment variables hanya apply setelah redeploy.

3. **Check di Code:**
   
   File `frontend/src/utils/api.js`:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
   ```

### Issue 3: Environment Variable Tidak Muncul

**Symptoms:**
- Vercel build success tapi env var tidak apply

**Solution:**

1. **Pastikan Prefix REACT_APP_:**
   
   Create React App hanya recognize env vars dengan prefix `REACT_APP_`

2. **Rebuild:**
   
   Environment variables di-embed saat build time, bukan runtime.
   
   Harus redeploy untuk apply changes.

### Issue 4: Different URL untuk Preview/Development

**Solution:**

Bisa set different values per environment:

1. **Production:**
   ```
   REACT_APP_API_URL=https://backend-production.up.railway.app
   ```

2. **Preview:**
   ```
   REACT_APP_API_URL=https://backend-staging.up.railway.app
   ```

3. **Development:**
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

---

## 📝 Complete Setup Checklist

### Railway Backend

- [ ] Backend deployed di Railway
- [ ] MySQL database connected
- [ ] Environment variables set:
  - [ ] `MYSQLHOST`
  - [ ] `MYSQLPORT`
  - [ ] `MYSQLUSER`
  - [ ] `MYSQLDATABASE`
  - [ ] `MYSQLPASSWORD`
  - [ ] `NODE_ENV=production`
  - [ ] `JWT_SECRET=your-secret`
  - [ ] `FRONTEND_URL=https://your-app.vercel.app`
- [ ] Backend URL copied: `https://xxx.up.railway.app`
- [ ] API `/api/health` returns OK

### Vercel Frontend

- [ ] Frontend deployed di Vercel
- [ ] Environment variable set:
  - [ ] `REACT_APP_API_URL=https://xxx.up.railway.app`
- [ ] Redeploy triggered
- [ ] Frontend URL: `https://your-app.vercel.app`
- [ ] No CORS errors
- [ ] Login works
- [ ] API calls successful

---

## 🎯 Final Test

### 1. Login Test

```
URL: https://your-app.vercel.app
Username: admin
Password: admin123
```

**Expected:**
- ✅ Login successful
- ✅ Redirect to dashboard
- ✅ No console errors

### 2. API Test

Open browser console:

```javascript
// Check API URL
console.log(process.env.REACT_APP_API_URL)
// Should output: https://xxx.up.railway.app

// Test API call
fetch(process.env.REACT_APP_API_URL + '/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
// Should output: { status: "OK", ... }
```

### 3. Form Test

1. Navigate to form pengajuan
2. Select karyawan from dropdown
3. Fill form
4. Submit
5. Check HRD dashboard

**Expected:**
- ✅ Dropdown loads karyawan
- ✅ Form submits successfully
- ✅ Data appears in HRD dashboard

---

## 📞 Need Help?

### Check Vercel Logs

1. Vercel Dashboard → Project
2. Tab **Deployments**
3. Click latest deployment
4. Click **View Function Logs**

### Check Railway Logs

```bash
railway logs --service backend
```

### Common Log Messages

**✅ Success:**
```
Build completed
Deployment ready
```

**❌ Error:**
```
Error: REACT_APP_API_URL is not defined
CORS error
Network error
```

---

## 🔄 Update Environment Variables

### When to Update

- Backend URL changed
- Switch dari staging ke production
- Add new backend service

### How to Update

1. Vercel Dashboard → Settings → Environment Variables
2. Click **Edit** pada `REACT_APP_API_URL`
3. Update value
4. Click **Save**
5. Redeploy (automatic or manual)

---

## 🎉 Done!

Environment variables sudah configured dengan benar!

**Summary:**
- ✅ Vercel: `REACT_APP_API_URL` → Railway backend URL
- ✅ Railway: `FRONTEND_URL` → Vercel frontend URL
- ✅ CORS configured
- ✅ API connection working

Happy deploying! 🚀

---

## 📚 Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [Create React App Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)

---

## 🔐 Security Notes

### DO:
- ✅ Use HTTPS for production URLs
- ✅ Set `FRONTEND_URL` di backend untuk CORS
- ✅ Keep `JWT_SECRET` secure di backend
- ✅ Use different secrets untuk production/staging

### DON'T:
- ❌ Commit `.env` files ke Git
- ❌ Share environment variables publicly
- ❌ Use HTTP in production
- ❌ Hardcode URLs di code

---

© 2026 IWARE. All rights reserved.
