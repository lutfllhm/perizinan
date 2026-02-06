@echo off
echo ========================================
echo IWARE Perizinan - VPS Deployment Script
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js tidak ditemukan. Install Node.js terlebih dahulu.
    pause
    exit /b 1
)
echo [OK] Node.js version:
node -v

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm tidak ditemukan. Install npm terlebih dahulu.
    pause
    exit /b 1
)
echo [OK] npm version:
npm -v

echo.
echo Installing dependencies...
call npm run install:all

echo.
echo Setting up environment...
if not exist backend\.env (
    copy backend\.env.vps backend\.env
    echo [OK] Created backend\.env from .env.vps
    echo [WARNING] PENTING: Edit backend\.env dan sesuaikan konfigurasi database!
    pause
)

echo.
echo Building frontend...
call npm run build

echo.
echo ========================================
echo Deployment selesai!
echo ========================================
echo.
echo Langkah selanjutnya:
echo 1. Edit backend\.env dan sesuaikan konfigurasi database
echo 2. Buat database: CREATE DATABASE iware_perizinan;
echo 3. Initialize database: cd backend ^&^& npm run init-db
echo 4. Install PM2: npm install -g pm2
echo 5. Start backend: cd backend ^&^& pm2 start server.js --name iware-backend
echo 6. Install serve: npm install -g serve
echo 7. Start frontend: cd frontend ^&^& pm2 start "serve -s build -l 3000" --name iware-frontend
echo.
echo Default Admin:
echo   Username: admin
echo   Password: admin123
echo.
pause
