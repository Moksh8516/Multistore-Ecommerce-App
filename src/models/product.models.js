import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  Productname: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    min: [1, "wrong min discount"],
    max: [99, "wrong max discount"],
  },
  amount: {
    type: Number,
  },
  size: [{
    name: { type: String },
    quantity: { type: Number }
  }],
  color: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  ProductImages: {
    type: [String],
    required: true,
  },
  stock: {
    type: Number,
    min: [0, "wrong min stock"],
    default: 0,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false
  },
  rating: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
    }
  ],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  }],
}, { timestamps: true });

export const Product = mongoose.model("Product", ProductSchema);