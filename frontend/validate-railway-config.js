#!/usr/bin/env node

/**
 * Script untuk validasi konfigurasi Railway Frontend sebelum deployment
 * Jalankan: node validate-railway-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Frontend Railway Configuration...\n');

let hasErrors = false;
let hasWarnings = false;

// Check 1: package.json
console.log('📦 Checking package.json...');
try {
  const packageJson = require('./package.json');
  
  if (!packageJson.scripts || !packageJson.scripts.build) {
    console.error('❌ Missing "build" script in package.json');
    hasErrors = true;
  } else {
    console.log('✅ Build script found:', packageJson.scripts.build);
  }
  
  if (!packageJson.scripts || !packageJson.scripts.serve) {
    console.error('❌ Missing "serve" script in package.json');
    console.log('💡 Add: "serve": "serve -s build -l $PORT"');
    hasErrors = true;
  } else {
    console.log('✅ Serve script found:', packageJson.scripts.serve);
  }
  
  if (!packageJson.dependencies || !packageJson.dependencies.serve) {
    console.error('❌ "serve" package not in dependencies');
    console.log('💡 Run: npm install serve');
    hasErrors = true;
  } else {
    console.log('✅ serve package installed');
  }
  
  if (!packageJson.dependencies) {
    console.error('❌ No dependencies found');
    hasErrors = true;
  } else {
    console.log('✅ Dependencies:', Object.keys(packageJson.dependencies).length, 'packages');
  }
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
  hasErrors = true;
}

// Check 2: railway.json
console.log('\n🚂 Checking railway.json...');
const railwayJsonPath = path.join(__dirname, 'railway.json');
if (fs.existsSync(railwayJsonPath)) {
  try {
    const railwayJson = JSON.parse(fs.readFileSync(railwayJsonPath, 'utf8'));
    console.log('✅ railway.json found');
    
    if (railwayJson.build && railwayJson.build.buildCommand) {
      console.log('✅ Build command:', railwayJson.build.buildCommand);
    }
    
    if (railwayJson.deploy && railwayJson.deploy.startCommand) {
      console.log('✅ Start command:', railwayJson.deploy.startCommand);
    } else {
      console.warn('⚠️  No start command in railway.json');
      hasWarnings = true;
    }
  } catch (error) {
    console.error('❌ Error reading railway.json:', error.message);
    hasErrors = true;
  }
} else {
  console.warn('⚠️  railway.json not found (optional)');
  hasWarnings = true;
}

// Check 3: .env
console.log('\n📝 Checking .env...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  console.log('✅ .env found');
  
  if (envContent.includes('REACT_APP_API_URL')) {
    const match = envContent.match(/REACT_APP_API_URL=(.+)/);
    if (match) {
      const apiUrl = match[1].trim();
      console.log('✅ REACT_APP_API_URL:', apiUrl);
      
      if (apiUrl.includes('localhost')) {
        console.warn('⚠️  API URL still pointing to localhost');
        console.log('💡 Update to Railway backend URL before deploy');
        hasWarnings = true;
      }
    }
  } else {
    console.error('❌ REACT_APP_API_URL not found in .env');
    hasErrors = true;
  }
} else {
  console.error('❌ .env not found');
  console.log('💡 Create .env with: REACT_APP_API_URL=https://your-backend.railway.app/api');
  hasErrors = true;
}

// Check 4: .env.production
console.log('\n🌍 Checking .env.production...');
const envProdPath = path.join(__dirname, '.env.production');
if (fs.existsSync(envProdPath)) {
  console.log('✅ .env.production found');
  const envProdContent = fs.readFileSync(envProdPath, 'utf8');
  
  if (envProdContent.includes('REACT_APP_API_URL')) {
    console.log('✅ REACT_APP_API_URL configured for production');
  }
} else {
  console.warn('⚠️  .env.production not found (optional)');
  hasWarnings = true;
}

// Check 5: public/index.html
console.log('\n📄 Checking public/index.html...');
const indexPath = path.join(__dirname, 'public/index.html');
if (fs.existsSync(indexPath)) {
  console.log('✅ public/index.html found');
} else {
  console.error('❌ public/index.html not found');
  hasErrors = true;
}

// Check 6: src/index.js or src/index.jsx
console.log('\n⚛️  Checking React entry point...');
const indexJsPath = path.join(__dirname, 'src/index.js');
const indexJsxPath = path.join(__dirname, 'src/index.jsx');

if (fs.existsSync(indexJsPath)) {
  console.log('✅ src/index.js found');
} else if (fs.existsSync(indexJsxPath)) {
  console.log('✅ src/index.jsx found');
} else {
  console.error('❌ React entry point not found');
  hasErrors = true;
}

// Check 7: API configuration
console.log('\n🔌 Checking API configuration...');
const utilsPath = path.join(__dirname, 'src/utils');
if (fs.existsSync(utilsPath)) {
  const files = fs.readdirSync(utilsPath);
  const apiFiles = files.filter(f => f.includes('api') || f.includes('axios'));
  
  if (apiFiles.length > 0) {
    console.log('✅ API utility files found:', apiFiles.join(', '));
    
    apiFiles.forEach(file => {
      const content = fs.readFileSync(path.join(utilsPath, file), 'utf8');
      if (content.includes('REACT_APP_API_URL')) {
        console.log(`✅ ${file} uses REACT_APP_API_URL`);
      } else if (content.includes('localhost')) {
        console.warn(`⚠️  ${file} has hardcoded localhost`);
        hasWarnings = true;
      }
    });
  } else {
    console.warn('⚠️  No API utility files found');
    hasWarnings = true;
  }
} else {
  console.warn('⚠️  src/utils directory not found');
  hasWarnings = true;
}

// Check 8: Build directory
console.log('\n🏗️  Checking build directory...');
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
  console.warn('⚠️  build/ directory exists (should be in .gitignore)');
  console.log('💡 Run: npm run build to create fresh build');
  hasWarnings = true;
} else {
  console.log('✅ No build directory (will be created during deployment)');
}

// Check 9: .gitignore
console.log('\n🙈 Checking .gitignore...');
const gitignorePath = path.join(__dirname, '../.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignore = fs.readFileSync(gitignorePath, 'utf8');
  
  console.log('✅ .gitignore found');
  
  if (gitignore.includes('build')) {
    console.log('✅ build/ directory ignored');
  } else {
    console.warn('⚠️  build/ not in .gitignore');
    hasWarnings = true;
  }
  
  if (gitignore.includes('.env')) {
    console.log('✅ .env files ignored');
  } else {
    console.error('❌ .env files not in .gitignore');
    hasErrors = true;
  }
} else {
  console.warn('⚠️  .gitignore not found');
  hasWarnings = true;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 VALIDATION SUMMARY');
console.log('='.repeat(50));

if (hasErrors) {
  console.log('\n❌ VALIDATION FAILED');
  console.log('Please fix the errors above before deploying to Railway.');
  console.log('\n💡 Common fixes:');
  console.log('- npm install serve');
  console.log('- Add "serve" script to package.json');
  console.log('- Create .env with REACT_APP_API_URL');
  console.log('- Update API URL to Railway backend');
  process.exit(1);
} else if (hasWarnings) {
  console.log('\n⚠️  VALIDATION PASSED WITH WARNINGS');
  console.log('You can deploy, but consider fixing the warnings.');
  console.log('\n✅ Ready for Railway deployment!');
  console.log('\n💡 Before deploying:');
  console.log('1. Update REACT_APP_API_URL to Railway backend URL');
  console.log('2. Commit and push to GitHub');
  console.log('3. Deploy to Railway');
  process.exit(0);
} else {
  console.log('\n✅ ALL CHECKS PASSED!');
  console.log('Your frontend is ready for Railway deployment.');
  console.log('\n📚 Next steps:');
  console.log('1. Update REACT_APP_API_URL in .env');
  console.log('2. Commit and push to GitHub');
  console.log('3. Deploy frontend service in Railway');
  console.log('4. Set root directory to "frontend"');
  console.log('\n📖 See DEPLOY_RAILWAY.md for detailed instructions.');
  process.exit(0);
}
