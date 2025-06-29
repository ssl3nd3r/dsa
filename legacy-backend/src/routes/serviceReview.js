const express = require('express');
const router = express.Router();
const ServiceReview = require('../models/ServiceReview');
const auth = require('../middleware/auth');

// Create a review for a service provider
router.post('/', auth, async (req, res) => {
  // TODO: Validate input
  try {
    const review = new ServiceReview({
      provider: req.body.provider,
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Get all reviews for a provider
router.get('/:providerId', async (req, res) => {
  try {
    const reviews = await ServiceReview.find({ provider: req.params.providerId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// TODO: Add endpoints for updating, deleting, moderation, etc.

module.exports = router; 