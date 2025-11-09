const mongoose = require('mongoose');

const operatingHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  open: String,
  close: String,
  isClosed: { type: Boolean, default: false }
});

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide restaurant name'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  cuisineTypes: [{
    type: String,
    required: true
  }],
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/800x400'
  },
  logoImage: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  location: {
    address: {
      street: String,
      city: String,
      state: String,
      zipcode: String
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      }
    }
  },
  contact: {
    phone: String,
    email: String
  },
  operatingHours: [operatingHoursSchema],
  deliveryFee: {
    type: Number,
    default: 2.99
  },
  minimumOrder: {
    type: Number,
    default: 10
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  estimatedDeliveryTime: {
    type: String,
    default: '30-40 min'
  },
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    default: '$$'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFreeDelivery: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);