import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.models.js"

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, totalAmount, address, userId, totalDiscount, totalItems } = req.body
  const order = new Order(
    { orderItems, totalAmount, address, user_id: userId, totalDiscount, totalItem: totalItems }
  )
  if (!order) {
    throw new ApiError(404, "Something went wrong")
  }
  const success = await order.save({ validateBeforeSave: false });
  return res.status(201).json(new ApiResponse(200, success, "create order"))
})

const fetchOrder = asyncHandler(async (req, res) => {
  const { id } = req.body
  const order = await Order.findById(id).populate("address")
  if (!order) {
    throw new ApiError(404, "Order not found")
  }
  return res.status(200).json(new ApiResponse(200, order, "fetch order"))
})

export {
  createOrder,
  fetchOrder
}