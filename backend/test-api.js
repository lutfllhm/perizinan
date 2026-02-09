// Script sederhana untuk test API
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let token = '';

// Warna untuk console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test Login
async function testLogin() {
  try {
    log('\n📝 Testing Login...', 'blue');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    token = response.data.token;
    log('✅ Login berhasil!', 'green');
    log(`   Token: ${token.substring(0, 20)}...`, 'yellow');
    return true;
  } catch (error) {
    log(`❌ Login gagal: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

// Test Get Karyawan
async function testGetKaryawan() {
  try {
    log('\n📝 Testing Get Karyawan...', 'blue');
    const response = await axios.get(`${BASE_URL}/karyawan`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    log(`✅ Berhasil ambil ${response.data.length} karyawan`, 'green');
    if (response.data.length > 0) {
      log(`   Contoh: ${response.data[0].nama} - ${response.data[0].jabatan}`, 'yellow');
    }
    return true;
  } catch (error) {
    log(`❌ Get karyawan gagal: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

// Test Get Pengajuan
async function testGetPengajuan() {
  try {
    log('\n📝 Testing Get Pengajuan...', 'blue');
    const response = await axios.get(`${BASE_URL}/pengajuan`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    log(`✅ Berhasil ambil ${response.data.length} pengajuan`, 'green');
    return true;
  } catch (error) {
    log(`❌ Get pengajuan gagal: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

// Test Get Stats
async function testGetStats() {
  try {
    log('\n📝 Testing Get Stats...', 'blue');
    const response = await axios.get(`${BASE_URL}/pengajuan/stats/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const stats = response.data;
    log('✅ Berhasil ambil statistik', 'green');
    log(`   Total: ${stats.total}`, 'yellow');
    log(`   Pending: ${stats.pending}`, 'yellow');
    log(`   Approved: ${stats.approved}`, 'yellow');
    log(`   Rejected: ${stats.rejected}`, 'yellow');
    return true;
  } catch (error) {
    log(`❌ Get stats gagal: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

// Test Health Check
async function testHealth() {
  try {
    log('\n📝 Testing Health Check...', 'blue');
    const response = await axios.get(`${BASE_URL}/health`);
    
    log('✅ Server sehat!', 'green');
    log(`   Status: ${response.data.status}`, 'yellow');
    return true;
  } catch (error) {
    log(`❌ Health check gagal: ${error.message}`, 'red');
    return false;
  }
}

// Run All Tests
async function runAllTests() {
  log('='.repeat(50), 'blue');
  log('🧪 MEMULAI TEST API', 'blue');
  log('='.repeat(50), 'blue');
  
  const results = {
    health: await testHealth(),
    login: await testLogin()
  };
  
  if (results.login) {
    results.karyawan = await testGetKaryawan();
    results.pengajuan = await testGetPengajuan();
    results.stats = await testGetStats();
  }
  
  // Summary
  log('\n' + '='.repeat(50), 'blue');
  log('📊 RINGKASAN TEST', 'blue');
  log('='.repeat(50), 'blue');
  
  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(r => r).length;
  const failed = total - passed;
  
  log(`\nTotal Test: ${total}`, 'yellow');
  log(`✅ Berhasil: ${passed}`, 'green');
  log(`❌ Gagal: ${failed}`, 'red');
  log(`📈 Success Rate: ${Math.round((passed/total) * 100)}%`, 'yellow');
  
  if (passed === total) {
    log('\n🎉 SEMUA TEST BERHASIL!', 'green');
  } else {
    log('\n⚠️  ADA TEST YANG GAGAL!', 'red');
  }
  
  log('\n' + '='.repeat(50), 'blue');
}

// Run tests
runAllTests().catch(error => {
  log(`\n❌ Error menjalankan test: ${error.message}`, 'red');
  process.exit(1);
});
