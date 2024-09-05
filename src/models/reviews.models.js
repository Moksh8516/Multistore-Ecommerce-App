import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  Productid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  reviews: {
    type: String,
  }
}, { timestamps: true });

export const Review = mongoose.model("Review", reviewSchema)