const mongoose = require('mongoose');

// ServiceProvider schema for maintenance/home service providers
const ServiceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessDetails: { type: String },
  services: [{ type: String }], // e.g., ['Plumbing', 'Cleaning']
  rating: { type: Number, default: 0 },
  contactInfo: { type: String },
  // TODO: Add location, availability, pricing, etc.
});

module.exports = mongoose.model('ServiceProvider', ServiceProviderSchema); 