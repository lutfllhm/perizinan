# ✅ Railway Deployment Checklist

## Pre-Deployment

### 1. Verifikasi File
- [x] `backend/railway.json` exists
- [x] `frontend/railway.json` exists
- [x] `backend/Procfile` exists
- [x] `frontend/Procfile` exists
- [x] `backend/.env.railway` template exists
- [x] `frontend/.env.railway` template exists
- [x] `backend/scripts/init-railway-db.js` exists
- [x] `iware_perizinan.sql` exists

### 2. Run Deployment Check
```bash
npm run deploy-check
```

Expected output: ✅ DEPLOYMENT READY or ⚠️ DEPLOYMENT READY WITH WARNINGS

## Railway Deployment Steps

### Step 1: Deploy MySQL Database

1. Login ke [Railway Dashboard](https://railway.app)
2. Click **New Project**
3. Select **Deploy MySQL**
4. Wait for deployment to complete
5. Note the service name (e.g., "MySQL")

**Verification:**
- MySQL service shows "Active" status
- Variables tab shows: MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE

---

### Step 2: Deploy Backend

1. In the same project, click **New Service**
2. Select **GitHub Repo** (or Empty Service)
3. Connect your repository
4. Configure service:
   - **Name**: `backend` (or your choice)
   - **Root Directory**: `backend`
   - **Build Command**: (auto-detected)
   - **Start Command**: `node server.js` (auto-detected)

5. Add Environment Variables:
   - Click **Variables** tab
   - Add these variables:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=<generate-new-secret>
FRONTEND_URL=<will-update-later>
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

6. Link to MySQL:
   - In Variables tab, click **Reference**
   - Select your MySQL service
   - Railway will auto-inject MySQL variables

7. Deploy:
   - Click **Deploy**
   - Wait for build to complete

8. Generate Domain:
   - Go to **Settings** > **Networking**
   - Click **Generate Domain**
   - Copy the URL (e.g., `https://backend-production-xxxx.up.railway.app`)

**Verification:**
```bash
curl https://your-backend-url.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server berjalan dengan baik",
  "database": "MySQL"
}
```

---

### Step 3: Initialize Database

**Option A: Via Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Select backend service
railway service

# Run init script
railway run npm run init-railway-db
```

**Option B: Via Railway Dashboard**
1. Go to Backend service
2. Click **Deployments** tab
3. Click latest deployment
4. Click **View Logs**
5. Check if auto-initialization ran successfully

**Verification:**
- Logs show: "✅ Table users created"
- Logs show: "✅ Table pengajuan created"
- Logs show: "✅ Default admin user created"

---

### Step 4: Deploy Frontend

1. Click **New Service**
2. Select **GitHub Repo**
3. Configure service:
   - **Name**: `frontend` (or your choice)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm ci --legacy-peer-deps && npm run build`
   - **Start Command**: `npm run serve`

4. Add Environment Variables:
   - Click **Variables** tab
   - Add:

```env
REACT_APP_API_URL=https://your-backend-url.up.railway.app
```

**Important:** Use the backend URL from Step 2 (WITHOUT `/api`)

5. Deploy:
   - Click **Deploy**
   - Wait for build to complete

6. Generate Domain:
   - Go to **Settings** > **Networking**
   - Click **Generate Domain**
   - Copy the URL (e.g., `https://frontend-production-xxxx.up.railway.app`)

**Verification:**
- Open frontend URL in browser
- Should see IWARE Perizinan homepage

---

### Step 5: Update Backend CORS

1. Go back to Backend service
2. Click **Variables** tab
3. Update `FRONTEND_URL`:

```env
FRONTEND_URL=https://your-frontend-url.up.railway.app
```

4. Backend will auto-redeploy

**Verification:**
- Backend logs show no CORS errors
- Frontend can communicate with backend

---

## Post-Deployment Verification

### 1. Test Backend Health
```bash
curl https://your-backend-url.up.railway.app/api/health
```

Expected:
```json
{
  "status": "OK",
  "message": "Server berjalan dengan baik",
  "timestamp": "2026-01-20T...",
  "env": "production",
  "database": "MySQL"
}
```

### 2. Test Frontend
- Open: `https://your-frontend-url.up.railway.app`
- Should see homepage with IWARE branding
- No console errors

### 3. Test Login
- Click "Login" or go to `/login`
- Enter credentials:
  - Username: `admin`
  - Password: `admin123`
- Should redirect to admin dashboard

### 4. Test API Integration
- In admin dashboard, check if data loads
- Try creating a test pengajuan
- Check if statistics display correctly

### 5. Test Public Form
- Go to homepage
- Click "Ajukan Perizinan"
- Fill form and submit
- Should see success message

---

## Troubleshooting

### Backend won't start
**Check:**
1. MySQL service is running
2. Backend service is linked to MySQL
3. Environment variables are set correctly
4. View logs: Backend > Deployments > Latest > View Logs

**Common issues:**
- MySQL connection timeout → Check if services are linked
- JWT_SECRET missing → Add to variables
- Port already in use → Railway handles this automatically

### Frontend can't connect to Backend
**Check:**
1. `REACT_APP_API_URL` is correct (without `/api`)
2. Backend `FRONTEND_URL` is set
3. Backend CORS allows frontend domain
4. Both services are deployed and active

**Test:**
```bash
# From browser console
fetch('https://your-backend-url.up.railway.app/api/health')
  .then(r => r.json())
  .then(console.log)
```

### Database not initialized
**Solution:**
```bash
railway run npm run init-railway-db
```

Or check backend logs for auto-initialization errors.

### CORS errors
**Check:**
1. Backend `FRONTEND_URL` matches frontend domain exactly
2. No trailing slashes
3. HTTPS (not HTTP)

**Update backend variables:**
```env
FRONTEND_URL=https://your-frontend-url.up.railway.app
```

---

## Environment Variables Summary

### Backend Variables
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=<your-generated-secret>
FRONTEND_URL=https://your-frontend-url.up.railway.app

# Auto-injected by Railway (don't set manually):
MYSQLHOST=<auto>
MYSQLPORT=<auto>
MYSQLUSER=<auto>
MYSQLPASSWORD=<auto>
MYSQLDATABASE=<auto>
```

### Frontend Variables
```env
REACT_APP_API_URL=https://your-backend-url.up.railway.app
```

---

## Security Checklist

- [ ] JWT_SECRET is unique and secure (64+ characters)
- [ ] Default admin password changed after first login
- [ ] FRONTEND_URL is set correctly for CORS
- [ ] Environment variables are not committed to git
- [ ] Railway services are in the same project (for free tier)
- [ ] MySQL service has automatic backups enabled (paid plans)

---

## Cost Estimation

**Railway Free Tier:**
- $5 credit per month
- 3 services: MySQL + Backend + Frontend
- Suitable for development/testing

**For Production:**
- Hobby Plan: $5/month per service
- Pro Plan: $20/month per service
- Consider upgrading for:
  - More resources
  - Custom domains
  - Better uptime
  - Automatic backups

---

## Next Steps

1. [ ] Test all features thoroughly
2. [ ] Change default admin password
3. [ ] Add custom domain (optional)
4. [ ] Set up monitoring/alerts
5. [ ] Configure automatic backups
6. [ ] Document your specific Railway URLs
7. [ ] Share with team

---

## Support

- **Railway Docs**: https://docs.railway.app
- **Project Docs**: See RAILWAY_DEPLOY_GUIDE.md
- **Issues**: Open issue in repository

---

**🎉 Congratulations! Your app is now live on Railway!**

Default Login:
- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANT: Change password immediately after first login!**
