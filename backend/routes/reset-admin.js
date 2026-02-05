const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/mysql');

// TEMPORARY ENDPOINT - REMOVE AFTER USE!
// Reset admin password endpoint
router.post('/reset-admin-password-temp', async (req, res) => {
  try {
    const { secret } = req.body;
    
    // Simple secret key untuk keamanan
    if (secret !== 'reset-iware-2026') {
      return res.status(403).json({ message: 'Invalid secret key' });
    }

    console.log('🔄 Resetting admin password...');

    // Generate new password hash
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log('New hash:', hashedPassword);

    // Update admin password
    const [result] = await db.query(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashedPassword, 'admin']
    );

    if (result.affectedRows === 0) {
      // Admin doesn't exist, create it
      await db.query(
        'INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)',
        ['admin', hashedPassword, 'Administrator', 'admin']
      );
      
      console.log('✅ Admin user created');
      
      return res.json({
        success: true,
        message: 'Admin user created successfully',
        credentials: {
          username: 'admin',
          password: 'admin123'
        }
      });
    }

    console.log('✅ Admin password reset successfully');

    res.json({
      success: true,
      message: 'Admin password reset successfully',
      credentials: {
        username: 'admin',
        password: 'admin123'
      }
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error resetting password',
      error: error.message 
    });
  }
});

// Get current admin info (for debugging)
router.get('/check-admin', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, nama, role, created_at FROM users WHERE username = ?',
      ['admin']
    );

    if (rows.length === 0) {
      return res.json({ 
        exists: false,
        message: 'Admin user not found' 
      });
    }

    res.json({ 
      exists: true,
      admin: rows[0] 
    });

  } catch (error) {
    console.error('❌ Check admin error:', error);
    res.status(500).json({ 
      error: error.message 
    });
  }
});

module.exports = router;
