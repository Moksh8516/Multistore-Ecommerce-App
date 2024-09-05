import { Cart } from "../models/cart.models.js"
import { CartItem } from "../models/cartItem.models.js"
import { Product } from "../models/product.models.js"
import { ApiError } from "../utils/ApiErrors.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const addToCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity, price, discount, thumbnail, title } = req.body;
  const userId = req.user?._id;

  let cart = await Cart.findOne({ user_id: userId });
  if (!cart) {
    cart = new Cart({ user_id: userId });
    await cart.save();
  }

  let cartItem = await CartItem.findOne({ product_id: productId });
  if (cartItem) {
    const oldQuantity = cartItem.quantity;
    cartItem.quantity = quantity;
    cartItem.price = price;  // Update price if needed
    await cartItem.save();
    cart.totalAmount += (cartItem.quantity - oldQuantity) * price;
  } else {
    cartItem = new CartItem({ user_id: userId, product_id: productId, quantity, price, thumbnail, discount, title });
    await cartItem.save();
    cart.cartItem.push(cartItem._id);
    cart.totalAmount += quantity * price;
  }
  await cart.save();
  return res.status(200)
    .json(new ApiResponse(200, cartItem, "Product added to cart"));
});

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  let cart = await Cart.findOne({ user_id: userId })
  if (!cart) {
    cart = new Cart({ user_id: userId })
    await cart.save();
  }
  const cartItems = await CartItem.find({ user_id: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, cartItems, "Cart retrieved successfully"))
})

const updateCartItem = asyncHandler(async (req, res) => {
  const { cartItemId } = req.params
  const { quantity } = req.body
  const userId = req.user?._id;
  const cart = await Cart.findOne({ user_id: userId })
  if (!cart) {
    throw new ApiError(404, "cart not find Something went wrong!!")
  }
  const cartItem = await CartItem.findById(cartItemId)
  if (!cartItem) {
    throw new ApiError(404, "cart item not find Something went wrong!!")
  }
  const oldQuantity = cartItem.quantity
  cartItem.quantity = quantity;
  cartItem.amount = (quantity) * cartItem.price;
  await cartItem.save();
  cart.totalAmount += (quantity - oldQuantity) * cartItem.price;
  await cart.save();
  return res
    .status(200)
    .json(new ApiResponse(200, cartItem, "cart updated successfully"))
})

const removeCartItem = asyncHandler(async (req, res) => {
  const { cartItemId } = req.params
  const userId = req.user?._id;
  const cart = await Cart.findOne({ user_id: userId });
  if (!cart) {
    throw new ApiError(404, "cart not find Something went wrong!!")
  }

  const cartItemIndex = cart.cartItem.indexOf(cartItemId);
  if (cartItemIndex === -1) {
    throw new ApiError(404, "cart item not find Something went wrong!!")
  }

  cart.cartItem.splice(cartItemIndex, 1);
  const cartItem = await CartItem.findById(cartItemId);
  cart.totalAmount -= cartItem.price * cartItem.quantity;

  await cart.save({ validateBeforeSave: false });
  await CartItem.findByIdAndDelete(cartItemId);
  return res
    .status(200)
    .json(new ApiResponse(200, { cart }, "cart item removed successfully"))
})

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const cart = await Cart.find({ user_id: userId })
  if (!cart) {
    throw new ApiError(404, "cart not find Something went wrong!!")
  }
  await Cart.deleteMany();

  const items = await CartItem.find({ user_id: userId })
  await CartItem.deleteMany();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "cart cleared successfully"))
})


export {
  addToCartItem,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
}