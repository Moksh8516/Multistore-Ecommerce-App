import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  thumbnail: {
    type: String,
  },
  title: {
    type: String,
  },
  brand: {
    type: String,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
    default: 0,
  },
  amount: {
    type: Number,
  }
}, { timestamps: true });

export const CartItem = mongoose.model("CartItem", CartItemSchema);