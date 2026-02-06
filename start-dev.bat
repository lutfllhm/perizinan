@echo off
echo Starting IWARE Perizinan in Development Mode...

REM Check if .env exists
if not exist backend\.env (
    echo [WARNING] backend\.env not found. Creating from .env.vps...
    copy backend\.env.vps backend\.env
    echo [OK] Created backend\.env
    echo [WARNING] Please edit backend\.env and configure your database settings
    pause
    exit /b 1
)

REM Start development servers
echo Starting backend and frontend...
call npm run dev
