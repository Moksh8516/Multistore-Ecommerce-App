import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cartItem: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "cartItem",
  }],
  totalPrice: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    min: [0, "wrong min discount"],
    max: [99, "wrong max discount"],
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  totalItems: {
    type: Number,
    default: 0,
  }
});

export const Cart = mongoose.model("Cart", cartSchema);