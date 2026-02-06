# Changelog

## [2.0.0] - 2026-02-06

### 🎉 Major Changes
- Simplified deployment untuk VPS
- Removed Hostinger/Railway specific configurations
- Added Docker support
- Improved documentation

### ✨ Added
- Docker Compose configuration
- VPS deployment scripts (Linux & Windows)
- Simplified environment configuration
- PM2 deployment guide

### 🗑️ Removed
- Hostinger specific files (.htaccess, composer.json, server.php)
- Railway specific configurations
- Vercel configurations
- Unused deployment scripts
- Multiple environment files (consolidated to .env.vps)

### 🔧 Fixed
- Cleaned up package.json scripts
- Removed unused dependencies
- Simplified project structure

### 📝 Changed
- Updated README with VPS deployment guide
- Simplified environment setup
- Improved error handling in server.js

### 🔐 Security
- Maintained JWT authentication
- Kept bcrypt password hashing
- Preserved CORS configuration

---

## [1.0.0] - 2024-12-XX

### Initial Release
- React frontend with responsive design
- Express backend with MySQL
- Admin & HRD role management
- Pengajuan cuti/lembur system
- WhatsApp notification integration
- Dashboard with statistics
