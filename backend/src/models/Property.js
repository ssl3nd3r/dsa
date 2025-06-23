const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Location
  area: {
    type: String,
    required: [true, 'Area is required'],
    enum: [
      'Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'JBR', 'Business Bay',
      'Dubai Hills Estate', 'Arabian Ranches', 'Emirates Hills', 'Meadows',
      'Springs', 'Lakes', 'JLT', 'DIFC', 'Sheikh Zayed Road', 'Al Barsha',
      'Jumeirah', 'Umm Suqeim', 'Al Sufouh', 'Al Quoz', 'Al Khail', 'Other'
    ]
  },
  address: {
    street: String,
    building: String,
    floor: String,
    apartment: String,
    fullAddress: {
      type: String,
      required: [true, 'Full address is required']
    }
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  
  // Property Details
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['Studio', '1BR', '2BR', '3BR', '4BR+', 'Shared Room', 'Private Room']
  },
  roomType: {
    type: String,
    required: [true, 'Room type is required'],
    enum: ['Entire Place', 'Private Room', 'Shared Room']
  },
  size: {
    type: Number, // in sq ft
    required: [true, 'Property size is required']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Number of bathrooms is required'],
    min: [0, 'Bathrooms cannot be negative']
  },
  
  // Pricing
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'AED',
    enum: ['AED', 'USD', 'EUR']
  },
  billingCycle: {
    type: String,
    required: [true, 'Billing cycle is required'],
    enum: ['Monthly', 'Quarterly', 'Yearly']
  },
  utilitiesIncluded: {
    type: Boolean,
    default: false
  },
  utilitiesCost: {
    type: Number,
    default: 0
  },
  
  // Amenities
  amenities: [{
    type: String,
    enum: [
      'WiFi', 'AC', 'Heating', 'Kitchen', 'Washing Machine', 'Dryer',
      'Parking', 'Gym', 'Pool', 'Garden', 'Balcony', 'Terrace',
      'Security', 'Concierge', 'Cleaning Service', 'Furnished',
      'Pet Friendly', 'Smoking Allowed', 'Wheelchair Accessible'
    ]
  }],
  
  // Availability
  availableFrom: {
    type: Date,
    required: [true, 'Available from date is required']
  },
  minimumStay: {
    type: Number, // in months
    default: 1
  },
  maximumStay: {
    type: Number, // in months
    default: 12
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  
  // Images
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Owner Information
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  
  // Roommate Preferences (for shared accommodations)
  roommatePreferences: {
    gender: {
      type: String,
      enum: ['Any', 'Male', 'Female']
    },
    ageRange: {
      min: Number,
      max: Number
    },
    lifestyle: [String],
    languages: [String],
    dietary: [String],
    religion: [String],
    workSchedule: [String]
  },
  
  // AI Matching Score (computed)
  matchingScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Rented', 'Inactive'],
    default: 'Active'
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
propertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search optimization
propertySchema.index({ area: 1, price: 1, propertyType: 1, isAvailable: 1 });
propertySchema.index({ coordinates: '2dsphere' });

// Virtual for formatted price
propertySchema.virtual('formattedPrice').get(function() {
  return `${this.price} ${this.currency}`;
});

// Method to get public data (without sensitive info)
propertySchema.methods.toPublicJSON = function() {
  const propertyObject = this.toObject();
  delete propertyObject.owner;
  return propertyObject;
};

module.exports = mongoose.model('Property', propertySchema); 