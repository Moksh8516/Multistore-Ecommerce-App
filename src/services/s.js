async function createOrder(userId, shippingAddress) {
  const cart = await findUserCart(userId);
  const address = await Address.find({ userId: userId });
  if (userId.address.toString() !== address.toString()) {
    throw new ApiError(404, "address not found")
  }
  const orderItem = [];
  for (items of cart.cartItem) {
    const orderItems = new OrderItem({
      price: items.price,
      product_id: items.product_id,
      user_id: items.user_id,
      quantity: items.quantity,
      size: items.size,
      discount: items.discount,
    })
    const createdOrderItem = await orderItems.save()
    await Order.push(createdOrderItem)
  }
  const createdCart = await Order.create({
    user_id: userId,
    orderItems: orderItem,
    discount: cart.discount,
    totalPrice: cart.totalPrice,
    totalDiscount: cart.totalDiscount,
    totalItem: cart.totalItem,
    address: address,
  })

  const savedCartOrder = await createdCart.save();
  return savedCartOrder;
}

async function findOrderById(orderId) {
  const order = await Order.findById(id).populate("user_id").populate({ path: "orderItems", populate: { path: "product" } }).populate("address")
  return order;
}

async function findOrderHistory(userId) {

  try {
    const orderHistory = await Order.find({ user_id: userId, orderStatus: "Placed" }).populate({ path: "orderItems", populate: { path: "product" } }).lean()
    return orderHistory;
  } catch (error) {
    throw new ApiError(500, "Something went wrong while searching order history of user")
  }
}

async function placeOrder(orderId) {
  const order = findOrderById(orderId)
  if (!order) {
    throw new ApiError(404, "Order not found")
  }
  order.orderStatus = "Placed";
  order.paymentDetails.paymentStatus = "COMPLETED"
  // order.paymentDetails.paymentMethod = req.body
  return await order.save();
}
export {
  createOrder,
}