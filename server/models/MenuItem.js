const mongoose = require('mongoose');

const customizationOptionSchema = new mongoose.Schema({
  name: String,
  options: [{
    label: String,
    price: { type: Number, default: 0 }
  }],
  required: { type: Boolean, default: false },
  maxSelection: { type: Number, default: 1 }
});

const menuItemSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide item name'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Salads', 'Sides', 'Specials']
  },
  images: [{
    type: String
  }],
  dietaryTags: [{
    type: String,
    enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal', 'Kosher']
  }],
  spiceLevel: {
    type: Number,
    min: 0,
    max: 3,
    default: 0
  },
  preparationTime: {
    type: Number,
    default: 15
  },
  customizationOptions: [customizationOptionSchema],
  isAvailable: {
    type: Boolean,
    default: true
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  calories: Number,
  orderCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);