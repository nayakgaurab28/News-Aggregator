const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// User registration (signup)
router.post('/signup', registerUser);

// User login
router.post('/login', loginUser);

// User profile (protected routes)
router.route('/profile')
    .get(protect, getUserProfile)   // Fetch user profile (JWT protected)
    .put(protect, updateUserProfile); // Update user profile (JWT protected)

module.exports = router;
