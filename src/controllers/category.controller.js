import { Category } from "../models/category.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  const { label, value } = req.body
  if (!label && !value) {
    throw new ApiError(401, "label and value field is required")
  }
  const category = await Category.create({ label, value })
  if (!category) {
    throw new ApiError(500, "Something went wrong while creating a categor")
  }
  return res
    .status(201)
    .json(new ApiResponse(200, category, "category created Successfully"))
})

const fetchAllCategories = asyncHandler(async (req, res) => {
  const fetchCategory = await Category.find({})
  if (!fetchCategory) {
    throw new ApiError(404, "Category not found!!")
  }
  return res
    .status(201)
    .json(new ApiResponse(200, fetchCategory, "Successfully fetched Category"))
})

export {
  createCategory,
  fetchAllCategories,
}