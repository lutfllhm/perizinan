# HOSTINGER DEPLOYMENT INSTRUCTIONS

## Files Structure
- public_html/ : Frontend React build (upload to public_html di Hostinger)
- api/ : Backend Node.js (upload ke folder di luar public_html)

## Deployment Steps

### 1. Upload Files
- Upload semua file di folder 'public_html' ke Hostinger public_html directory
- Upload semua file di folder 'api' ke folder 'api' di root Hostinger (buat folder baru)

### 2. Setup Backend (via SSH)
```bash
cd ~/api
npm install --production
```

### 3. Configure Database
Edit file ~/api/.env dan sesuaikan dengan database Hostinger Anda:
```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=3306
```

### 4. Initialize Database
```bash
cd ~/api
node scripts/init-database.js
```

### 5. Start Application
Hostinger biasanya menggunakan Node.js App Manager atau PM2:
```bash
cd ~/api
pm2 start server.js --name iware-api
pm2 save
pm2 startup
```

### 6. Configure .htaccess
File .htaccess sudah disertakan di public_html untuk:
- Redirect HTTP ke HTTPS
- Handle React Router
- Proxy API requests ke backend

## Troubleshooting

### Backend tidak jalan
- Pastikan Node.js version >= 18.0.0
- Check PM2 logs: `pm2 logs iware-api`
- Check error logs di Hostinger control panel

### Database connection error
- Verify database credentials di .env
- Pastikan database sudah dibuat di Hostinger MySQL
- Check MySQL user permissions

### Frontend tidak load
- Clear browser cache
- Check .htaccess configuration
- Verify file permissions (644 for files, 755 for directories)

## Support
Untuk bantuan lebih lanjut, hubungi tim development.
