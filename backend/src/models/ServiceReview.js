const mongoose = require('mongoose');

// ServiceReview schema for user reviews of service providers
const ServiceReviewSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
  // TODO: Add moderation, response from provider, etc.
});

module.exports = mongoose.model('ServiceReview', ServiceReviewSchema); 