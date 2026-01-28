# Fix Admin Login Issue

## Problem
Admin tidak bisa login karena password hash di database tidak cocok.

## Solution

### Option 1: Update Password via Railway Dashboard (RECOMMENDED)

1. Buka Railway Dashboard
2. Pilih MySQL service
3. Klik tab "Data"
4. Pilih table "users"
5. Klik pada row admin
6. Update kolom `password` dengan hash baru:

```
$2a$10$vaCHOrKC1pzHj23.tbYYzeL7yQCHlSp2lNAvxLa2IcxJ5DKisNDGm
```

7. Save changes

**Login Credentials:**
- Username: `admin`
- Password: `admin123`

### Option 2: Run SQL Query in Railway

1. Buka Railway Dashboard
2. Pilih MySQL service
3. Klik tab "Query"
4. Jalankan query berikut:

```sql
UPDATE users 
SET password = '$2a$10$vaCHOrKC1pzHj23.tbYYzeL7yQCHlSp2lNAvxLa2IcxJ5DKisNDGm' 
WHERE username = 'admin';
```

5. Verify dengan query:

```sql
SELECT id, username, nama, role FROM users WHERE username = 'admin';
```

### Option 3: Generate Custom Password Hash

Jika ingin menggunakan password lain, jalankan:

```bash
node backend/scripts/generate-password-hash.js your_password_here
```

Kemudian copy hash yang dihasilkan dan update di Railway.

## Verify Login

Setelah update password, coba login dengan:
- URL: https://licensing-iw.up.railway.app/login
- Username: admin
- Password: admin123

## Troubleshooting

### Jika masih tidak bisa login:

1. **Check Backend Logs di Railway:**
   - Buka Railway Dashboard
   - Pilih backend service
   - Klik tab "Logs"
   - Cari error message saat login

2. **Verify Database Connection:**
   - Pastikan backend bisa connect ke MySQL
   - Check environment variables di Railway

3. **Check Frontend API URL:**
   - Pastikan frontend mengarah ke backend URL yang benar
   - Check file `frontend/src/utils/api.js`

4. **Clear Browser Cache:**
   - Clear localStorage
   - Clear cookies
   - Refresh page

## Additional Admin Users

Untuk membuat admin tambahan, jalankan query:

```sql
INSERT INTO users (username, password, nama, role) 
VALUES (
  'admin2', 
  '$2a$10$vaCHOrKC1pzHj23.tbYYzeL7yQCHlSp2lNAvxLa2IcxJ5DKisNDGm', 
  'Administrator 2', 
  'admin'
);
```

Password: admin123

## Security Notes

⚠️ **IMPORTANT:** Setelah berhasil login, segera ganti password melalui menu profile/settings!

Default password `admin123` hanya untuk initial setup dan harus diganti dengan password yang lebih kuat.
