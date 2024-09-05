import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  rating: {
    type: Number,
    min: [0, "minmum rating value is 0"],
    max: [5, "maximum rating value is 5"],
    default: 0
  },
}, { timestamps: true });

export const Rating = mongoose.model("Rating", RatingSchema);