const express = require('express');
const { register, login, getProfile, editProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Register a new user
router.post('/register', register);

// Login an existing user and get a token
router.post('/login', login);

// Get the user profile (protected route)
router.get('/profile', authMiddleware, getProfile);

router.patch('/profile', authMiddleware, editProfile);

module.exports = router;
