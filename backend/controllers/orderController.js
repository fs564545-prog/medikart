import Order from '../models/Order.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    throw new ApiError(400, "No order items");
  } else {
    // In a real application, req.user._id would be set by the auth middleware
    // We'll mock the user ID if it's not present for now, or assume it's passed in body if no auth
    const userId = req.user ? req.user._id : req.body.userId; 

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const order = new Order({
      orderItems,
      user: userId,
      shippingAddress,
      totalPrice
    });

    const createdOrder = await order.save();

    res.status(201).json(new ApiResponse(201, createdOrder, "Order placed successfully"));
  }
});

export const getMyOrders = asyncHandler(async (req, res) => {
    const userId = req.user ? req.user._id : req.query.userId;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }
    const orders = await Order.find({ user: userId });
    res.json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
        res.json(new ApiResponse(200, order, "Order fetched successfully"));
    } else {
        throw new ApiError(404, "Order not found");
    }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(new ApiResponse(200, orders, "All orders fetched successfully"));
});
