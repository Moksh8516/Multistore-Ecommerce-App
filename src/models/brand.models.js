import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
    required: true,
    unique: true,
  },

})

export const Brand = mongoose.model("Brand", brandSchema);