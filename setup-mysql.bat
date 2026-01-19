@echo off
echo ========================================
echo   Setup MySQL untuk Aplikasi Perizinan
echo ========================================
echo.

echo [1/4] Install dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Gagal install dependencies
    pause
    exit /b 1
)
echo.

echo [2/4] Initialize database...
node scripts/init-database.js
if errorlevel 1 (
    echo.
    echo ========================================
    echo   MYSQL BELUM SIAP!
    echo ========================================
    echo.
    echo Pastikan MySQL sudah terinstall dan running:
    echo.
    echo 1. Download MySQL: https://dev.mysql.com/downloads/installer/
    echo 2. Install MySQL Community Server
    echo 3. Start MySQL service
    echo 4. Update file backend/.env dengan credentials MySQL Anda
    echo.
    echo Setelah setup, jalankan script ini lagi.
    echo ========================================
    pause
    exit /b 1
)
echo.

echo [3/4] Test koneksi MySQL...
node test-mysql-connection.js
if errorlevel 1 (
    echo ERROR: Koneksi MySQL gagal
    pause
    exit /b 1
)
echo.

echo [4/4] Setup selesai!
echo.
echo ========================================
echo   SETUP BERHASIL!
echo ========================================
echo.
echo Langkah selanjutnya:
echo 1. Start backend: cd backend ^&^& npm start
echo 2. Start frontend: cd frontend ^&^& npm start
echo 3. Buka browser: http://localhost:3000
echo 4. Login dengan:
echo    - Username: admin
echo    - Password: admin123
echo.
pause
