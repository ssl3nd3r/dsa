const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  // Profile Information
  phone: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String
  },
  // AI Matching Fields
  lifestyle: {
    type: String,
    enum: ['Quiet', 'Active', 'Smoker', 'Non-smoker', 'Pet-friendly', 'No pets'],
    required: [true, 'Lifestyle preference is required']
  },
  personalityTraits: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 8; // Max 8 personality traits
      },
      message: 'Cannot select more than 8 personality traits'
    }
  },
  workSchedule: {
    type: String,
    enum: ['9-5', 'Night shift', 'Remote', 'Flexible', 'Student'],
    required: [true, 'Work schedule is required']
  },
  culturalPreferences: {
    languages: {
      type: [String],
      required: [true, 'At least one language is required']
    },
    dietary: {
      type: String,
      trim: true
    },
    religion: {
      type: String,
      trim: true
    }
  },
  // Accommodation Preferences
  budget: {
    min: { type: Number },
    max: { type: Number }
  },
  preferredAreas: [String],
  moveInDate: Date,
  leaseDuration: {
    type: String,
    enum: ['1-3 months', '3-6 months', '6-12 months', '1+ years']
  },
  // Account Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without password)
userSchema.methods.toPublicJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema); 