import { Brand } from "../models/brand.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createBrand = asyncHandler(async (req, res) => {
  const { label, value } = req.body
  if (!label && !value) {
    throw new ApiError(401, "label and value field is required")
  }
  const brand = await Brand.create({ label, value })
  if (!brand) {
    throw new ApiError(500, "Something went wrong while creating a Brand")
  }
  return res
    .status(201)
    .json(new ApiResponse(200, brand, "Brand created Successfully"))
})

const fetchAllBrands = asyncHandler(async (req, res) => {
  const fetchBrand = await Brand.find({})
  if (!fetchBrand) {
    throw new ApiError(404, "Brand not found!!")
  }
  return res
    .status(201)
    .json(new ApiResponse(200, fetchBrand, "Successfully fetched Brand"))
})

export {
  createBrand,
  fetchAllBrands,
}