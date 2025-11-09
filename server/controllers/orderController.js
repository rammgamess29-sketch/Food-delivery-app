const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      restaurant,
      items,
      deliveryAddress,
      deliveryInstructions,
      paymentMethod,
      tip,
      promoCode
    } = req.body;

    // Calculate subtotal
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item ${item.menuItem} not found`
        });
      }

      let itemTotal = menuItem.price * item.quantity;
      
      // Add customization prices
      if (item.customizations) {
        for (const customization of item.customizations) {
          itemTotal += customization.additionalPrice * item.quantity;
        }
      }

      orderItems.push({
        menuItem: item.menuItem,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        customizations: item.customizations || [],
        itemTotal
      });

      subtotal += itemTotal;
    }

    // Get restaurant details for delivery fee
    const restaurantData = await require('../models/Restaurant').findById(restaurant);
    const deliveryFee = restaurantData.deliveryFee;
    
    // Calculate tax (assuming 8%)
    const tax = subtotal * 0.08;
    
    // Apply discount if promo code exists
    let discount = 0;
    // In a real app, you would validate the promo code here
    
    const total = subtotal + deliveryFee + tax + (tip || 0) - discount;

    // Create order
    const order = await Order.create({
      user: req.user.id,
      restaurant,
      items: orderItems,
      subtotal,
      deliveryFee,
      tax,
      discount,
      tip: tip || 0,
      total,
      deliveryAddress,
      deliveryInstructions,
      paymentMethod,
      promoCode,
      statusHistory: [{
        status: 'placed',
        timestamp: new Date()
      }]
    });

    // Populate order details
    await order.populate('restaurant', 'name logoImage contact');

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = { user: req.user.id };
    
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('restaurant', 'name logoImage')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name logoImage contact location')
      .populate('driver', 'name phone profilePicture');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns order
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note
    });

    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns order
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Can only cancel if order is not too far along
    if (['picked-up', 'out-for-delivery', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order at this stage'
      });
    }

    order.orderStatus = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: 'Cancelled by user'
    });

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};