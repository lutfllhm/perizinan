const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/mysql');

// SIMPLE RESET - No authentication needed
// DELETE THIS FILE AFTER USE!

router.get('/reset-now', async (req, res) => {
  try {
    console.log('🔄 Starting password reset...');

    // Password yang akan diset
    const username = 'admin';
    const newPassword = 'admin123';
    
    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    console.log('Generated hash:', hashedPassword);

    // Cek apakah admin ada
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    let result;
    
    if (existingUsers.length > 0) {
      // Update existing admin
      [result] = await db.query(
        'UPDATE users SET password = ? WHERE username = ?',
        [hashedPassword, username]
      );
      
      console.log('✅ Admin password updated');
      
      res.json({
        success: true,
        action: 'updated',
        message: 'Admin password has been reset',
        credentials: {
          username: username,
          password: newPassword
        },
        hash: hashedPassword,
        affectedRows: result.affectedRows
      });
    } else {
      // Create new admin
      [result] = await db.query(
        'INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)',
        [username, hashedPassword, 'Administrator', 'admin']
      );
      
      console.log('✅ Admin user created');
      
      res.json({
        success: true,
        action: 'created',
        message: 'Admin user has been created',
        credentials: {
          username: username,
          password: newPassword
        },
        hash: hashedPassword,
        insertId: result.insertId
      });
    }

  } catch (error) {
    console.error('❌ Reset error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Test login dengan password
router.post('/test-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('🔐 Testing login for:', username);

    // Get user
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.json({
        success: false,
        message: 'User not found',
        username: username
      });
    }

    const user = users[0];
    
    // Test password
    const isValid = await bcrypt.compare(password, user.password);
    
    console.log('Password valid:', isValid);

    res.json({
      success: isValid,
      message: isValid ? 'Password is correct!' : 'Password is incorrect',
      user: {
        id: user.id,
        username: user.username,
        nama: user.nama,
        role: user.role
      },
      passwordHash: user.password,
      testedPassword: password
    });

  } catch (error) {
    console.error('❌ Test login error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// List all users
router.get('/list-users', async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, nama, role, created_at FROM users ORDER BY id'
    );

    res.json({
      success: true,
      count: users.length,
      users: users
    });

  } catch (error) {
    console.error('❌ List users error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
