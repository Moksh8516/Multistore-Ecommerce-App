import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
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

export const Category = mongoose.model("Category", CategorySchema);