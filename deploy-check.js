#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Railway Deployment Readiness...\n');

let hasErrors = false;
let hasWarnings = false;

// Check backend files
console.log('📦 Backend Checks:');

const backendFiles = [
  'backend/package.json',
  'backend/server.js',
  'backend/config/mysql.js',
  'backend/railway.json',
  'backend/Procfile',
  'backend/.env.railway',
  'backend/scripts/init-railway-db.js'
];

backendFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    hasErrors = true;
  }
});

// Check frontend files
console.log('\n🎨 Frontend Checks:');

const frontendFiles = [
  'frontend/package.json',
  'frontend/src/App.jsx',
  'frontend/railway.json',
  'frontend/Procfile',
  'frontend/.env.railway'
];

frontendFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    hasErrors = true;
  }
});

// Check database
console.log('\n🗄️ Database Checks:');

if (fs.existsSync('iware_perizinan.sql')) {
  console.log('  ✅ iware_perizinan.sql');
} else {
  console.log('  ❌ iware_perizinan.sql - MISSING');
  hasErrors = true;
}

// Check environment variables
console.log('\n🔐 Environment Variable Checks:');

const backendEnv = fs.readFileSync('backend/.env.railway', 'utf8');
if (backendEnv.includes('GENERATE_YOUR_OWN_SECRET_HERE')) {
  console.log('  ⚠️  JWT_SECRET needs to be generated');
  hasWarnings = true;
} else {
  console.log('  ✅ JWT_SECRET configured');
}

if (backendEnv.includes('your-frontend-name')) {
  console.log('  ⚠️  FRONTEND_URL needs to be updated');
  hasWarnings = true;
} else {
  console.log('  ✅ FRONTEND_URL configured');
}

const frontendEnv = fs.readFileSync('frontend/.env.railway', 'utf8');
if (frontendEnv.includes('your-backend-name')) {
  console.log('  ⚠️  REACT_APP_API_URL needs to be updated');
  hasWarnings = true;
} else {
  console.log('  ✅ REACT_APP_API_URL configured');
}

// Check package.json scripts
console.log('\n📜 Script Checks:');

const backendPkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
if (backendPkg.scripts.start && backendPkg.scripts['init-railway-db']) {
  console.log('  ✅ Backend scripts configured');
} else {
  console.log('  ❌ Backend scripts missing');
  hasErrors = true;
}

const frontendPkg = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
if (frontendPkg.scripts.build && frontendPkg.scripts.serve) {
  console.log('  ✅ Frontend scripts configured');
} else {
  console.log('  ❌ Frontend scripts missing');
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ DEPLOYMENT NOT READY - Fix errors above');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  DEPLOYMENT READY WITH WARNINGS');
  console.log('   Update environment variables before deploying');
  process.exit(0);
} else {
  console.log('✅ DEPLOYMENT READY!');
  console.log('\n📚 Next steps:');
  console.log('   1. Deploy MySQL on Railway');
  console.log('   2. Deploy Backend (link to MySQL)');
  console.log('   3. Deploy Frontend');
  console.log('   4. Run: railway run npm run init-railway-db');
  console.log('\n📖 See RAILWAY_DEPLOY_GUIDE.md for details');
  process.exit(0);
}
