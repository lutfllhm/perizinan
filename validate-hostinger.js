#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Hostinger deployment configuration...\n');

let errors = [];
let warnings = [];
let success = [];

// Check required files
const requiredFiles = [
  { path: 'composer.json', desc: 'Framework detection' },
  { path: 'index.php', desc: 'Entry point' },
  { path: '.htaccess', desc: 'Apache routing' },
  { path: 'package.json', desc: 'Root package config' },
  { path: 'backend/package.json', desc: 'Backend dependencies' },
  { path: 'backend/server.js', desc: 'Backend entry point' },
  { path: 'backend/.env.hostinger', desc: 'Environment template' },
  { path: 'frontend/package.json', desc: 'Frontend dependencies' },
];

console.log('📋 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file.path)) {
    success.push(`✅ ${file.path} - ${file.desc}`);
  } else {
    errors.push(`❌ Missing: ${file.path} - ${file.desc}`);
  }
});

// Check frontend build
console.log('\n📦 Checking frontend build...');
if (fs.existsSync('frontend/build')) {
  const buildFiles = fs.readdirSync('frontend/build');
  if (buildFiles.includes('index.html')) {
    success.push('✅ Frontend build exists');
  } else {
    warnings.push('⚠️  Frontend build incomplete (no index.html)');
  }
} else {
  warnings.push('⚠️  Frontend not built yet (run: npm run hostinger:build)');
}

// Check backend .env
console.log('\n🔐 Checking environment configuration...');
if (fs.existsSync('backend/.env')) {
  success.push('✅ backend/.env exists');
  
  // Check if it's configured
  const envContent = fs.readFileSync('backend/.env', 'utf8');
  if (envContent.includes('your_database_password_here') || 
      envContent.includes('your_generated_jwt_secret_here')) {
    warnings.push('⚠️  backend/.env contains placeholder values - update before deploy');
  }
} else {
  warnings.push('⚠️  backend/.env not found (copy from .env.hostinger)');
}

// Check package.json scripts
console.log('\n📜 Checking npm scripts...');
const rootPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['hostinger:build', 'hostinger:start', 'hostinger:install'];
requiredScripts.forEach(script => {
  if (rootPkg.scripts && rootPkg.scripts[script]) {
    success.push(`✅ Script: ${script}`);
  } else {
    errors.push(`❌ Missing script: ${script}`);
  }
});

// Check Node.js version
console.log('\n🔧 Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 18) {
  success.push(`✅ Node.js ${nodeVersion} (>= 18 required)`);
} else {
  errors.push(`❌ Node.js ${nodeVersion} is too old (>= 18 required)`);
}

// Print results
console.log('\n' + '='.repeat(60));
console.log('📊 VALIDATION RESULTS');
console.log('='.repeat(60) + '\n');

if (success.length > 0) {
  console.log('✅ SUCCESS:\n');
  success.forEach(msg => console.log('  ' + msg));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:\n');
  warnings.forEach(msg => console.log('  ' + msg));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ ERRORS:\n');
  errors.forEach(msg => console.log('  ' + msg));
  console.log('');
}

console.log('='.repeat(60));

if (errors.length === 0) {
  console.log('\n✅ Validation passed! Ready for Hostinger deployment.');
  console.log('\n📋 Next steps:');
  console.log('1. Push to GitHub');
  console.log('2. Import repository in Hostinger Git');
  console.log('3. Setup Node.js App in cPanel');
  console.log('4. Configure MySQL database');
  console.log('5. Update backend/.env with credentials');
  console.log('6. Run: node backend/scripts/init-database.js\n');
  process.exit(0);
} else {
  console.log('\n❌ Validation failed! Fix errors before deploying.\n');
  process.exit(1);
}
