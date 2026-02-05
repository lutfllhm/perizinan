#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Railway Deployment Script');
console.log('============================');

// Check if we're in Railway environment
const isRailway = process.env.RAILWAY_ENVIRONMENT;
console.log(`📍 Environment: ${isRailway ? 'Railway' : 'Local'}`);

// Check required environment variables
const requiredEnvVars = [
  'MYSQLHOST',
  'MYSQLPORT', 
  'MYSQLUSER',
  'MYSQLPASSWORD',
  'MYSQLDATABASE'
];

console.log('🔍 Checking environment variables...');
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('⚠️  Missing environment variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('');
  console.log('💡 Make sure MySQL plugin is installed in Railway');
  console.log('💡 Check Railway Dashboard > Variables');
} else {
  console.log('✅ All required environment variables found');
}

// Display database configuration (without password)
console.log('');
console.log('🔧 Database Configuration:');
console.log(`   Host: ${process.env.MYSQLHOST || 'Not set'}`);
console.log(`   Port: ${process.env.MYSQLPORT || 'Not set'}`);
console.log(`   User: ${process.env.MYSQLUSER || 'Not set'}`);
console.log(`   Database: ${process.env.MYSQLDATABASE || 'Not set'}`);
console.log(`   Password: ${process.env.MYSQLPASSWORD ? '***' : 'Not set'}`);

console.log('');
console.log('🎯 Starting application...');

// Start the server
try {
  require('./server.js');
} catch (error) {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
}