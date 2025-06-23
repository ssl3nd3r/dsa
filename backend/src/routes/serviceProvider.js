const express = require('express');
const ServiceProvider = require('../models/ServiceProvider');
const ServiceReview = require('../models/ServiceReview');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all service providers with filtering
router.get('/', async (req, res) => {
  try {
    const {
      category,
      area,
      minRating,
      maxPrice,
      emergency,
      verified,
      page = 1,
      limit = 10,
      sortBy = 'rating',
      sortOrder = 'desc'
    } = req.query;

    const filter = { isActive: true };
    
    // Apply filters
    if (category) {
      filter['services.category'] = category;
    }
    
    if (area) {
      filter.serviceAreas = { $in: [new RegExp(area, 'i')] };
    }
    
    if (minRating) {
      filter['rating.average'] = { $gte: parseFloat(minRating) };
    }
    
    if (maxPrice) {
      filter['services.priceRange.max'] = { $lte: parseFloat(maxPrice) };
    }
    
    if (emergency === 'true') {
      filter.emergencyService = true;
    }
    
    if (verified === 'true') {
      filter.isVerified = true;
    }

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const providers = await ServiceProvider.find(filter)
      .populate('user', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await ServiceProvider.countDocuments(filter);

    res.json({
      providers,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        hasMore: skip + providers.length < total
      }
    });
  } catch (error) {
    console.error('Get service providers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get service provider by ID
router.get('/:id', async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id)
      .populate('user', 'name email')
      .lean();

    if (!provider) {
      return res.status(404).json({ error: 'Service provider not found' });
    }

    // Get reviews for this provider
    const reviews = await ServiceReview.find({ 
      serviceProvider: req.params.id,
      isApproved: true 
    })
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({
      provider,
      reviews
    });
  } catch (error) {
    console.error('Get service provider error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new service provider profile
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      businessName,
      businessDescription,
      phone,
      email,
      website,
      serviceAreas,
      address,
      services,
      businessType,
      licenseNumber,
      insurance,
      operatingHours,
      emergencyService
    } = req.body;

    // Check if user already has a service provider profile
    const existingProvider = await ServiceProvider.findOne({ user: req.user._id });
    if (existingProvider) {
      return res.status(400).json({ error: 'You already have a service provider profile' });
    }

    const provider = new ServiceProvider({
      user: req.user._id,
      businessName,
      businessDescription,
      phone,
      email,
      website,
      serviceAreas,
      address,
      services,
      businessType,
      licenseNumber,
      insurance,
      operatingHours,
      emergencyService
    });

    await provider.save();

    const populatedProvider = await ServiceProvider.findById(provider._id)
      .populate('user', 'name email');

    res.status(201).json({
      message: 'Service provider profile created successfully',
      provider: populatedProvider
    });
  } catch (error) {
    console.error('Create service provider error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Update service provider profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    
    if (!provider) {
      return res.status(404).json({ error: 'Service provider not found' });
    }

    // Check if user owns this profile
    if (provider.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    const updatedProvider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.json({
      message: 'Service provider profile updated successfully',
      provider: updatedProvider
    });
  } catch (error) {
    console.error('Update service provider error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete service provider profile
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    
    if (!provider) {
      return res.status(404).json({ error: 'Service provider not found' });
    }

    // Check if user owns this profile
    if (provider.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this profile' });
    }

    await ServiceProvider.findByIdAndDelete(req.params.id);

    res.json({ message: 'Service provider profile deleted successfully' });
  } catch (error) {
    console.error('Delete service provider error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get my service provider profile
router.get('/profile/me', authenticateToken, async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ user: req.user._id })
      .populate('user', 'name email');

    if (!provider) {
      return res.status(404).json({ error: 'Service provider profile not found' });
    }

    res.json({ provider });
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add review to service provider
router.post('/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const {
      rating,
      title,
      content,
      serviceCategory,
      serviceDate,
      qualityOfWork,
      professionalism,
      valueForMoney,
      timeliness,
      images
    } = req.body;

    // Check if user already reviewed this provider
    const existingReview = await ServiceReview.findOne({
      serviceProvider: req.params.id,
      reviewer: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this service provider' });
    }

    const review = new ServiceReview({
      serviceProvider: req.params.id,
      reviewer: req.user._id,
      rating,
      title,
      content,
      serviceCategory,
      serviceDate,
      qualityOfWork,
      professionalism,
      valueForMoney,
      timeliness,
      images
    });

    await review.save();

    // Update provider's average rating
    const provider = await ServiceProvider.findById(req.params.id);
    if (provider) {
      await provider.updateRating(rating);
    }

    const populatedReview = await ServiceReview.findById(review._id)
      .populate('reviewer', 'name');

    res.status(201).json({
      message: 'Review added successfully',
      review: populatedReview
    });
  } catch (error) {
    console.error('Add review error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Get reviews for a service provider
router.get('/:id/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await ServiceReview.find({
      serviceProvider: req.params.id,
      isApproved: true
    })
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await ServiceReview.countDocuments({
      serviceProvider: req.params.id,
      isApproved: true
    });

    res.json({
      reviews,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        hasMore: skip + reviews.length < total
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search service providers
router.get('/search', async (req, res) => {
  try {
    const { q, category, area } = req.query;
    
    const filter = { isActive: true };
    
    if (q) {
      filter.$or = [
        { businessName: { $regex: q, $options: 'i' } },
        { businessDescription: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter['services.category'] = category;
    }
    
    if (area) {
      filter.serviceAreas = { $in: [new RegExp(area, 'i')] };
    }

    const providers = await ServiceProvider.find(filter)
      .populate('user', 'name email')
      .sort({ 'rating.average': -1 })
      .limit(20)
      .lean();

    res.json({ providers });
  } catch (error) {
    console.error('Search service providers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 