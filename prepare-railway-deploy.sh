#!/bin/bash

echo "========================================"
echo "Railway Deployment Preparation Script"
echo "========================================"
echo ""

echo "[1/5] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js not installed!"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi
echo "✅ OK: Node.js installed ($(node --version))"
echo ""

echo "[2/5] Validating backend configuration..."
cd backend
npm run validate-railway
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ ERROR: Backend validation failed!"
    echo "Please fix the errors above before deploying."
    cd ..
    exit 1
fi
cd ..
echo ""

echo "[3/5] Validating frontend configuration..."
cd frontend
npm run validate-railway
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ ERROR: Frontend validation failed!"
    echo "Please fix the errors above before deploying."
    cd ..
    exit 1
fi
cd ..
echo ""

echo "[4/5] Generating JWT Secret..."
cd backend
node scripts/generate-jwt-secret.js > jwt-secret.txt
echo "✅ JWT Secret saved to backend/jwt-secret.txt"
echo "⚠️  IMPORTANT: Copy this to Railway Dashboard!"
cd ..
echo ""

echo "[5/5] Creating credentials file..."
if [ ! -f RAILWAY_CREDENTIALS.md ]; then
    cp RAILWAY_CREDENTIALS.template.md RAILWAY_CREDENTIALS.md
    echo "✅ Created RAILWAY_CREDENTIALS.md from template"
    echo "📝 Please fill in your Railway credentials!"
else
    echo "✅ RAILWAY_CREDENTIALS.md already exists"
fi
echo ""

echo "========================================"
echo "✅ Preparation Complete!"
echo "========================================"
echo ""
cat RAILWAY_SUMMARY.txt
echo ""
echo "📚 Next steps:"
echo "1. Read RAILWAY_QUICKSTART.md"
echo "2. Push code to GitHub: git push origin main"
echo "3. Create Railway project"
echo "4. Deploy MySQL service"
echo "5. Deploy backend service"
echo "6. Deploy frontend service"
echo ""
echo "📖 Documentation:"
echo "- Quick Start: RAILWAY_QUICKSTART.md"
echo "- Complete Guide: DEPLOY_RAILWAY.md"
echo "- Checklist: RAILWAY_CHECKLIST.md"
echo ""
