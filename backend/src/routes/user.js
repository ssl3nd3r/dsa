const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken, requireVerification } = require('../middleware/auth');
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, name, password, lifestyle, personalityTraits, workSchedule, culturalPreferences } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      email,
      name,
      password,
      lifestyle,
      personalityTraits,
      workSchedule,
      culturalPreferences
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const {
      name, phone, lifestyle, personalityTraits, workSchedule,
      culturalPreferences, budget, preferredAreas, moveInDate, leaseDuration
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (lifestyle) updateData.lifestyle = lifestyle;
    if (personalityTraits) updateData.personalityTraits = personalityTraits;
    if (workSchedule) updateData.workSchedule = workSchedule;
    if (culturalPreferences) updateData.culturalPreferences = culturalPreferences;
    if (budget) updateData.budget = budget;
    if (preferredAreas) updateData.preferredAreas = preferredAreas;
    if (moveInDate) updateData.moveInDate = moveInDate;
    if (leaseDuration) updateData.leaseDuration = leaseDuration;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user preferences (for onboarding)
router.post('/preferences', async (req, res) => {
  try {
    const { email, name, password, lifestyle, personalityTraits, workSchedule, culturalPreferences } = req.body;
    
    let user = await User.findOne({ email });
    
    if (user) {
      // Update existing user
      user.name = name || user.name;
      if (password) user.password = password;
      user.lifestyle = lifestyle || user.lifestyle;
      user.personalityTraits = personalityTraits || user.personalityTraits;
      user.workSchedule = workSchedule || user.workSchedule;
      user.culturalPreferences = culturalPreferences || user.culturalPreferences;
      await user.save();
      
      return res.json({ 
        message: 'Preferences updated successfully', 
        user: user.toPublicJSON() 
      });
    } else {
      // Create new user
      user = new User({ 
        email, 
        name, 
        password, 
        lifestyle, 
        personalityTraits, 
        workSchedule, 
        culturalPreferences 
      });
      await user.save();
      
      return res.status(201).json({ 
        message: 'User created successfully', 
        user: user.toPublicJSON() 
      });
    }
  } catch (error) {
    console.error('Preferences update error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    const user = await User.findById(req.user._id);
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID (public profile)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name lifestyle personalityTraits workSchedule culturalPreferences createdAt')
      .lean();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 