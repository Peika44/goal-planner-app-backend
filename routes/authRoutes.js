const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getCurrentUser, 
  updateProfile, 
  resetPassword 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/user', protect, getCurrentUser);
router.put('/user', protect, updateProfile);

module.exports = router;