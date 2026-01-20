#!/usr/bin/env node

/**
 * Script untuk validasi konfigurasi Railway sebelum deployment
 * Jalankan: node scripts/validate-railway-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Railway Configuration...\n');

let hasErrors = false;
let hasWarnings = false;

// Check 1: package.json
console.log('📦 Checking package.json...');
try {
  const packageJson = require('../package.json');
  
  if (!packageJson.scripts || !packageJson.scripts.start) {
    console.error('❌ Missing "start" script in package.json');
    hasErrors = true;
  } else {
    console.log('✅ Start script found:', packageJson.scripts.start);
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
const railwayJsonPath = path.join(__dirname, '../railway.json');
if (fs.existsSync(railwayJsonPath)) {
  try {
    const railwayJson = JSON.parse(fs.readFileSync(railwayJsonPath, 'utf8'));
    console.log('✅ railway.json found');
    
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

// Check 3: .env.example
console.log('\n📝 Checking .env.example...');
const envExamplePath = path.join(__dirname, '../.env.example');
if (fs.existsSync(envExamplePath)) {
  const envExample = fs.readFileSync(envExamplePath, 'utf8');
  const requiredVars = [
    'PORT',
    'NODE_ENV',
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET',
    'FRONTEND_URL'
  ];
  
  console.log('✅ .env.example found');
  
  requiredVars.forEach(varName => {
    if (envExample.includes(varName)) {
      console.log(`✅ ${varName} documented`);
    } else {
      console.error(`❌ ${varName} missing in .env.example`);
      hasErrors = true;
    }
  });
} else {
  console.error('❌ .env.example not found');
  hasErrors = true;
}

// Check 4: .env.production
console.log('\n🌍 Checking .env.production...');
const envProdPath = path.join(__dirname, '../.env.production');
if (fs.existsSync(envProdPath)) {
  console.log('✅ .env.production found');
  console.log('💡 Remember to set these in Railway Dashboard > Variables');
} else {
  console.warn('⚠️  .env.production not found (optional)');
  hasWarnings = true;
}

// Check 5: server.js
console.log('\n🖥️  Checking server.js...');
const serverPath = path.join(__dirname, '../server.js');
if (fs.existsSync(serverPath)) {
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  console.log('✅ server.js found');
  
  if (serverContent.includes('require(\'dotenv\')')) {
    console.log('✅ dotenv configured');
  } else {
    console.error('❌ dotenv not configured');
    hasErrors = true;
  }
  
  if (serverContent.includes('process.env.PORT')) {
    console.log('✅ PORT environment variable used');
  } else {
    console.error('❌ PORT not using environment variable');
    hasErrors = true;
  }
  
  if (serverContent.includes('0.0.0.0') || serverContent.includes('HOST')) {
    console.log('✅ Host binding configured');
  } else {
    console.warn('⚠️  Consider binding to 0.0.0.0 for Railway');
    hasWarnings = true;
  }
} else {
  console.error('❌ server.js not found');
  hasErrors = true;
}

// Check 6: Database config
console.log('\n🗄️  Checking database configuration...');
const dbConfigPath = path.join(__dirname, '../config/mysql.js');
if (fs.existsSync(dbConfigPath)) {
  const dbConfig = fs.readFileSync(dbConfigPath, 'utf8');
  
  console.log('✅ mysql.js found');
  
  if (dbConfig.includes('process.env.DB_HOST')) {
    console.log('✅ DB_HOST from environment');
  } else {
    console.error('❌ DB_HOST not using environment variable');
    hasErrors = true;
  }
  
  if (dbConfig.includes('process.env.DB_PORT')) {
    console.log('✅ DB_PORT from environment');
  } else {
    console.warn('⚠️  DB_PORT should use environment variable');
    hasWarnings = true;
  }
} else {
  console.error('❌ config/mysql.js not found');
  hasErrors = true;
}

// Check 7: CORS configuration
console.log('\n🔐 Checking CORS configuration...');
if (fs.existsSync(serverPath)) {
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  if (serverContent.includes('cors')) {
    console.log('✅ CORS configured');
    
    if (serverContent.includes('FRONTEND_URL')) {
      console.log('✅ FRONTEND_URL in CORS config');
    } else {
      console.warn('⚠️  Consider adding FRONTEND_URL to CORS');
      hasWarnings = true;
    }
  } else {
    console.error('❌ CORS not configured');
    hasErrors = true;
  }
}

// Check 8: .gitignore
console.log('\n🙈 Checking .gitignore...');
const gitignorePath = path.join(__dirname, '../../.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignore = fs.readFileSync(gitignorePath, 'utf8');
  
  console.log('✅ .gitignore found');
  
  if (gitignore.includes('.env')) {
    console.log('✅ .env files ignored');
  } else {
    console.error('❌ .env files not in .gitignore');
    hasErrors = true;
  }
  
  if (gitignore.includes('node_modules')) {
    console.log('✅ node_modules ignored');
  } else {
    console.error('❌ node_modules not in .gitignore');
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
  process.exit(1);
} else if (hasWarnings) {
  console.log('\n⚠️  VALIDATION PASSED WITH WARNINGS');
  console.log('You can deploy, but consider fixing the warnings.');
  console.log('\n✅ Ready for Railway deployment!');
  process.exit(0);
} else {
  console.log('\n✅ ALL CHECKS PASSED!');
  console.log('Your backend is ready for Railway deployment.');
  console.log('\n📚 Next steps:');
  console.log('1. Push code to GitHub');
  console.log('2. Create Railway project');
  console.log('3. Deploy MySQL service');
  console.log('4. Deploy backend service');
  console.log('5. Set environment variables in Railway');
  console.log('\n📖 See DEPLOY_RAILWAY.md for detailed instructions.');
  process.exit(0);
}
