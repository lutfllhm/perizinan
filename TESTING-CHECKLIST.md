# Testing Checklist - Auto-Migration ✅

## 🧪 Pre-Deployment Testing (Local)

### 1. Test Server Start
```bash
cd backend
npm start
```

**Expected Output:**
```
🚀 Starting server...
🔄 Attempting database connection...
✅ Database connection successful!
🔄 Initializing database tables...
✅ Tabel karyawan berhasil dibuat
✅ Tabel quota_bulanan berhasil dibuat
✅ Kolom karyawan_id ditambahkan
✅ Kolom kantor ditambahkan
✅ Kolom jabatan ditambahkan
✅ Kolom departemen ditambahkan
📥 Tabel karyawan kosong, memulai auto-import...
✅ Auto-import karyawan berhasil
✅ Database tables initialized successfully!
🚀 Server berjalan di port 5000
```

### 2. Test Database Structure
```sql
-- Check tables
SHOW TABLES;
-- Expected: users, pengajuan, karyawan, quota_bulanan

-- Check karyawan count
SELECT COUNT(*) FROM karyawan;
-- Expected: 200+

-- Check pengajuan structure
DESCRIBE pengajuan;
-- Expected: karyawan_id, kantor, jabatan, departemen columns exist
```

### 3. Test API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Get karyawan
curl http://localhost:5000/api/karyawan

# Get karyawan by kantor
curl http://localhost:5000/api/karyawan?kantor=RBM-IWARE%20SURABAYA
```

### 4. Test Idempotency
```bash
# Stop server
# Start server again
npm start

# Should NOT error, should skip existing tables/columns
```

**Expected Output:**
```
✅ Tabel karyawan berhasil dibuat (or already exists)
✅ Tabel quota_bulanan berhasil dibuat (or already exists)
⚠️  Kolom sudah ada atau error, melanjutkan...
```

---

## 🚀 Railway Deployment Testing

### 1. Pre-Deployment Checklist
- [ ] Code pushed ke GitHub
- [ ] Railway project created
- [ ] MySQL database added
- [ ] Environment variables set
- [ ] Root directory set to `backend`

### 2. Deploy & Monitor
```bash
# Via Railway CLI
railway up

# Or push to GitHub (auto-deploy)
git push origin main
```

**Monitor Logs:**
```bash
railway logs --service backend
```

### 3. Verify Deployment Logs

**✅ Success Indicators:**
```
🔄 Attempting database connection...
✅ Database connection successful!
🔄 Initializing database tables...
✅ Tabel karyawan berhasil dibuat
✅ Tabel quota_bulanan berhasil dibuat
✅ Kolom karyawan_id ditambahkan
✅ Kolom kantor ditambahkan
✅ Kolom jabatan ditambahkan
✅ Kolom departemen ditambahkan
📥 Tabel karyawan kosong, memulai auto-import...
✅ Auto-import karyawan berhasil
✅ Database tables initialized successfully!
🚀 Server berjalan di port 5000
```

**❌ Error Indicators:**
```
❌ Database connection failed
❌ Max retries reached
❌ Auto-import karyawan gagal
```

### 4. Test Railway API

```bash
# Replace with your Railway URL
RAILWAY_URL="https://your-app.up.railway.app"

# Health check
curl $RAILWAY_URL/api/health

# Expected:
{
  "status": "OK",
  "message": "Server berjalan dengan baik",
  "timestamp": "2026-02-09T...",
  "env": "production",
  "database": "MySQL"
}

# Get karyawan
curl $RAILWAY_URL/api/karyawan

# Expected: Array of karyawan objects
```

### 5. Verify Database via Railway MySQL

**Via Railway Dashboard:**
1. Click MySQL service
2. Tab "Query"
3. Run queries:

```sql
-- Check tables
SHOW TABLES;

-- Check karyawan count
SELECT COUNT(*) as total FROM karyawan;

-- Check sample data
SELECT * FROM karyawan LIMIT 5;

-- Check pengajuan structure
DESCRIBE pengajuan;

-- Check foreign key
SELECT 
  CONSTRAINT_NAME,
  COLUMN_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'pengajuan' 
AND REFERENCED_TABLE_NAME = 'karyawan';
```

---

## 🌐 Frontend Integration Testing

### 1. Update Vercel Environment
```
REACT_APP_API_URL=https://your-app.up.railway.app
```

### 2. Test Form Pengajuan
- [ ] Open form pengajuan
- [ ] Dropdown karyawan loads
- [ ] Can select karyawan
- [ ] Form auto-fills kantor, jabatan, departemen
- [ ] Can submit form
- [ ] Success message appears

### 3. Test HRD Dashboard
- [ ] Login as HRD
- [ ] Navigate to "Daftar Karyawan"
- [ ] Table shows karyawan data
- [ ] Can search karyawan
- [ ] Can filter by kantor
- [ ] Pagination works

### 4. Test Pengajuan Flow
- [ ] Submit pengajuan as user
- [ ] Check pengajuan appears in HRD dashboard
- [ ] Verify karyawan_id is set
- [ ] Verify kantor, jabatan, departemen are set
- [ ] Approve/reject works

---

## 🔄 Re-Deployment Testing

### 1. Make Code Change
```bash
# Make a small change (e.g., add console.log)
echo "console.log('Test redeploy');" >> backend/server.js

# Commit & push
git add .
git commit -m "test: Verify auto-migration on redeploy"
git push
```

### 2. Monitor Redeploy
```bash
railway logs --service backend
```

**Expected:**
- Migration runs again
- No errors
- No duplicate data
- Server starts successfully

### 3. Verify Data Integrity
```sql
-- Check no duplicate karyawan
SELECT nama, kantor, COUNT(*) as count
FROM karyawan
GROUP BY nama, kantor
HAVING count > 1;
-- Expected: Empty result

-- Check data count unchanged
SELECT COUNT(*) FROM karyawan;
-- Expected: Same count as before
```

---

## 🐛 Error Scenario Testing

### 1. Test Database Connection Failure
**Scenario:** MySQL service down

**Expected Behavior:**
```
🔄 Attempting database connection (1/10)...
❌ Database connection failed (attempt 1): ...
⏳ Retrying in 1 seconds...
🔄 Attempting database connection (2/10)...
```

**Recovery:**
- Server retries up to 10 times
- Exponential backoff
- Exits if max retries reached

### 2. Test Auto-Import Failure
**Scenario:** import-karyawan.js script error

**Expected Behavior:**
```
📥 Tabel karyawan kosong, memulai auto-import...
⚠️  Auto-import karyawan gagal: ...
💡 Jalankan manual: npm run import-karyawan
✅ Database tables initialized successfully!
🚀 Server berjalan di port 5000
```

**Recovery:**
- Server continues to start
- Manual import available
- No data loss

### 3. Test Duplicate Column Addition
**Scenario:** Column already exists

**Expected Behavior:**
```
✅ Kolom karyawan_id ditambahkan
⚠️  Kolom kantor sudah ada
⚠️  Kolom jabatan sudah ada
⚠️  Kolom departemen sudah ada
```

**Recovery:**
- Skip existing columns
- No errors
- Continue migration

---

## 📊 Performance Testing

### 1. Migration Speed
**Measure:**
```bash
# Time the migration
time npm start
```

**Expected:**
- First deploy (with import): 30-60 seconds
- Subsequent deploys: 5-10 seconds

### 2. API Response Time
```bash
# Test API latency
curl -w "@curl-format.txt" -o /dev/null -s $RAILWAY_URL/api/karyawan
```

**Expected:**
- < 500ms for karyawan list
- < 200ms for health check

### 3. Database Query Performance
```sql
-- Test karyawan query
EXPLAIN SELECT * FROM karyawan WHERE kantor = 'RBM-IWARE SURABAYA';

-- Test pengajuan with join
EXPLAIN SELECT p.*, k.nama, k.kantor 
FROM pengajuan p 
LEFT JOIN karyawan k ON p.karyawan_id = k.id;
```

---

## ✅ Final Acceptance Criteria

### Backend
- [x] Server starts without errors
- [x] Database auto-migrates
- [x] Karyawan data auto-imports
- [x] All tables created
- [x] All columns added
- [x] Foreign keys set
- [x] API endpoints work
- [x] Health check returns OK

### Frontend
- [x] Can connect to backend
- [x] Karyawan dropdown loads
- [x] Form submission works
- [x] HRD dashboard shows data
- [x] No CORS errors

### Deployment
- [x] Railway auto-deploy works
- [x] Environment variables set
- [x] Logs show success
- [x] No manual intervention needed
- [x] Idempotent (safe to redeploy)

### Data Integrity
- [x] No duplicate karyawan
- [x] All 200+ karyawan imported
- [x] Foreign keys working
- [x] Data persists across redeploys

---

## 🎯 Sign-Off

**Tested By:** _________________

**Date:** _________________

**Environment:**
- [ ] Local Development
- [ ] Railway Staging
- [ ] Railway Production

**Result:**
- [ ] ✅ All tests passed
- [ ] ⚠️ Some tests failed (see notes)
- [ ] ❌ Critical failures

**Notes:**
_______________________________________
_______________________________________
_______________________________________

---

## 📞 Support

If any test fails:

1. **Check Logs:**
   ```bash
   railway logs --service backend
   ```

2. **Verify Environment:**
   ```bash
   railway variables
   ```

3. **Manual Migration:**
   ```bash
   railway run npm run update-db
   railway run npm run import-karyawan
   ```

4. **Restart Service:**
   ```bash
   railway restart
   ```

5. **Contact Support:**
   - Check `RAILWAY-SETUP.md` for troubleshooting
   - Check `DEPLOYMENT-SUMMARY.md` for common issues

---

Happy Testing! 🧪✨
