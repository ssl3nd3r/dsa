const express = require('express');
const Property = require('../models/Property');
const User = require('../models/User');
const { authenticateToken, requireOwnership } = require('../middleware/auth');
const router = express.Router();

// Get all properties with filters
router.get('/', async (req, res) => {
  try {
    const {
      area, minPrice, maxPrice, propertyType, roomType, 
      bedrooms, amenities, availableFrom, page = 1, limit = 10
    } = req.query;

    const filter = { isAvailable: true, status: 'Active' };

    if (area) filter.area = area;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (propertyType) filter.propertyType = propertyType;
    if (roomType) filter.roomType = roomType;
    if (bedrooms) filter.bedrooms = Number(bedrooms);
    if (amenities) {
      filter.amenities = { $in: amenities.split(',') };
    }
    if (availableFrom) {
      filter.availableFrom = { $lte: new Date(availableFrom) };
    }

    const skip = (page - 1) * limit;
    const properties = await Property.find(filter)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Property.countDocuments(filter);

    res.json({
      properties,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        hasMore: skip + properties.length < total
      }
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone')
      .lean();

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ property });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new property
router.post('/', authenticateToken, async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      owner: req.user._id
    };

    const property = new Property(propertyData);
    await property.save();

    const populatedProperty = await Property.findById(property._id)
      .populate('owner', 'name email');

    res.status(201).json({
      message: 'Property created successfully',
      property: populatedProperty
    });
  } catch (error) {
    console.error('Create property error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Update property
router.put('/:id', authenticateToken, requireOwnership('Property'), async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'name email');

    res.json({
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    console.error('Update property error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete property
router.delete('/:id', authenticateToken, requireOwnership('Property'), async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's properties
router.get('/user/my-properties', authenticateToken, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ properties });
  } catch (error) {
    console.error('Get user properties error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- AI-powered property matching ---
// Matching criteria and weights (total 100):
// - Lifestyle: 15
// - Work schedule: 10
// - Language: 10
// - Personality traits: 10
// - Budget: 15
// - Area: 10
// - Amenities: 20
// - Lease terms (move-in date, min/max stay, billing cycle): 10

router.get('/match/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const availableProperties = await Property.find({ 
      isAvailable: true, 
      status: 'Active' 
    }).populate('owner', 'name email');

    // User preferences for new criteria
    const userBudget = user.budget || { min: 0, max: Infinity };
    const userAreas = user.preferredAreas || [];
    const userAmenities = user.amenities || [];
    const userMoveInDate = user.moveInDate ? new Date(user.moveInDate) : null;
    const userLeaseDuration = user.leaseDuration || null; // in months
    const userBillingCycle = user.billingCycle || null;

    // Calculate matching scores
    const propertiesWithScores = availableProperties.map(property => {
      let score = 0;
      // Lifestyle (15)
      if (property.roommatePreferences?.lifestyle?.includes(user.lifestyle)) {
        score += 15;
      }
      // Work schedule (10)
      if (property.roommatePreferences?.workSchedule?.includes(user.workSchedule)) {
        score += 10;
      }
      // Language (10)
      const userLangs = user.culturalPreferences?.languages || [];
      const propLangs = property.roommatePreferences?.languages || [];
      if (userLangs.length > 0) {
        const commonLanguages = userLangs.filter(lang => propLangs.includes(lang));
        score += (commonLanguages.length / userLangs.length) * 10;
      }
      // Personality traits (10)
      const userTraits = user.personalityTraits || [];
      const propTraits = property.roommatePreferences?.lifestyle || [];
      if (userTraits.length > 0) {
        const commonTraits = userTraits.filter(trait => propTraits.includes(trait));
        score += (commonTraits.length / userTraits.length) * 10;
      }
      // Budget (15)
      if (property.price >= userBudget.min && property.price <= userBudget.max) {
        score += 15;
      } else if (property.price <= userBudget.max * 1.1) {
        score += 7.5; // Slightly over budget
      }
      // Area (10)
      if (userAreas.includes(property.area)) {
        score += 10;
      }
      // Amenities (20)
      const propAmenities = property.amenities || [];
      if (userAmenities.length > 0) {
        const matchedAmenities = userAmenities.filter(a => propAmenities.includes(a));
        score += (matchedAmenities.length / userAmenities.length) * 20;
      }
      // Lease terms (10)
      let leaseScore = 0;
      // Move-in date
      if (userMoveInDate && property.availableFrom) {
        const propAvailable = new Date(property.availableFrom);
        if (propAvailable <= userMoveInDate) {
          leaseScore += 3;
        }
      }
      // Lease duration
      if (userLeaseDuration && property.minimumStay && property.maximumStay) {
        if (
          userLeaseDuration >= property.minimumStay &&
          userLeaseDuration <= property.maximumStay
        ) {
          leaseScore += 4;
        }
      }
      // Billing cycle
      if (userBillingCycle && property.billingCycle) {
        if (userBillingCycle === property.billingCycle) {
          leaseScore += 3;
        }
      }
      score += leaseScore;

      return {
        ...property.toObject(),
        matchingScore: Math.round(score)
      };
    });

    // Sort by matching score (highest first)
    propertiesWithScores.sort((a, b) => b.matchingScore - a.matchingScore);

    // Return top 10 matches
    const topMatches = propertiesWithScores.slice(0, 10);

    res.json({
      matches: topMatches,
      userPreferences: {
        lifestyle: user.lifestyle,
        workSchedule: user.workSchedule,
        languages: user.culturalPreferences.languages,
        personalityTraits: user.personalityTraits,
        budget: user.budget,
        preferredAreas: user.preferredAreas,
        amenities: user.amenities,
        moveInDate: user.moveInDate,
        leaseDuration: user.leaseDuration,
        billingCycle: user.billingCycle
      }
    });
  } catch (error) {
    console.error('Property matching error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search properties by area
router.get('/search/area/:area', async (req, res) => {
  try {
    const { area } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const properties = await Property.find({ 
      area: { $regex: area, $options: 'i' },
      isAvailable: true,
      status: 'Active'
    })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Property.countDocuments({ 
      area: { $regex: area, $options: 'i' },
      isAvailable: true,
      status: 'Active'
    });

    res.json({
      properties,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        hasMore: skip + properties.length < total
      }
    });
  } catch (error) {
    console.error('Search properties error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 