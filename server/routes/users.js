const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Trip = require('../models/Trip');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/users/:username/profile
 * @desc    Get user public profile and their trips
 * @access  Public
 */
router.get('/:username/profile', async (req, res) => {
  try {
    const username = req.params.username;
    
    // Find user by username, only return safe fields
    const user = await User.findOne({ username }).select('name username bio createdAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's trips, only return safe fields
    const trips = await Trip.find({ user: user._id })
      .select('title destination startDate endDate rating coverImage photos createdAt')
      .sort({ createdAt: -1 });

    res.json({
      user,
      trips
    });
  } catch (error) {
    console.error('Error fetching public profile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile (username, bio)
 * @access  Private
 */
router.put('/profile', protect, async (req, res) => {
  try {
    const { username, bio } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if new username is already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      user.username = username;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username is already taken' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
