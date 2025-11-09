const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      profilePicture: req.body.profilePicture
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // If this is set as default, remove default from other addresses
    if (req.body.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(req.body);
    await user.save();

    res.status(201).json({
      success: true,
      data: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
exports.updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // If setting as default, remove default from other addresses
    if (req.body.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    Object.assign(address, req.body);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses.id(req.params.addressId).remove();
    await user.save();

    res.status(200).json({
      success: true,
      data: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add payment method
// @route   POST /api/users/payment-methods
// @access  Private
exports.addPaymentMethod = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // If this is set as default, remove default from other payment methods
    if (req.body.isDefault) {
      user.paymentMethods.forEach(pm => {
        pm.isDefault = false;
      });
    }

    user.paymentMethods.push(req.body);
    await user.save();

    res.status(201).json({
      success: true,
      data: user.paymentMethods
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete payment method
// @route   DELETE /api/users/payment-methods/:paymentId
// @access  Private
exports.deletePaymentMethod = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.paymentMethods.id(req.params.paymentId).remove();
    await user.save();

    res.status(200).json({
      success: true,
      data: user.paymentMethods
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorite restaurant
// @route   POST /api/users/favorites/:restaurantId
// @access  Private
exports.toggleFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const restaurantId = req.params.restaurantId;

    const index = user.favorites.indexOf(restaurantId);

    if (index > -1) {
      // Remove from favorites
      user.favorites.splice(index, 1);
    } else {
      // Add to favorites
      user.favorites.push(restaurantId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get favorite restaurants
// @route   GET /api/users/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');

    res.status(200).json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    next(error);
  }
};