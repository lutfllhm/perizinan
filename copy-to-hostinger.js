const fs = require('fs');
const path = require('path');

console.log('🚀 Copying build files to hostinger-deploy folder...\n');

const sourceDir = path.join(__dirname, 'frontend', 'build');
const targetDir = path.join(__dirname, 'hostinger-deploy', 'public_html');

// Check if build folder exists
if (!fs.existsSync(sourceDir)) {
  console.error('❌ Error: Build folder not found!');
  console.log('Please run: cd frontend && npm run build');
  process.exit(1);
}

// Create target directory if not exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Function to copy directory recursively
function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursive(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy all files from build to public_html (except .htaccess)
console.log('📦 Copying files...');
fs.readdirSync(sourceDir).forEach(item => {
  const srcPath = path.join(sourceDir, item);
  const destPath = path.join(targetDir, item);
  
  console.log(`   Copying: ${item}`);
  copyRecursive(srcPath, destPath);
});

// Verify .htaccess exists
const htaccessPath = path.join(targetDir, '.htaccess');
if (fs.existsSync(htaccessPath)) {
  console.log('   ✓ .htaccess already exists');
} else {
  console.log('   ⚠️  .htaccess not found (should be created separately)');
}

console.log('\n✅ Done! Files copied to: hostinger-deploy/public_html/');
console.log('\n📋 Next steps:');
console.log('   1. Open hostinger-deploy/public_html/');
console.log('   2. Upload all files to Hostinger via File Manager or FTP');
console.log('   3. Make sure .htaccess is uploaded (show hidden files)');
console.log('\n📖 Read: hostinger-deploy/README.md for detailed instructions');
