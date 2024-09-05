import { Rating } from "../models/rating.models.js"
import { ApiError } from "../utils/ApiErrors.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const RatingCreateController = asyncHandler(async (req, res) => {
  const { rating } = req.body
  const { user_id, product_id } = req.params
  if (!rating) {
    throw new ApiError(400, "rating field is required")
  }
  const ratingCreated = (await Rating.create({
    rating,
    user_id: user_id._id,
    product_id: product_id._id,
  })).populate("user_id product_id")

  if (!ratingCreated) {
    throw new ApiError(400, "Something went worong while sending a Rating request")
  }
  return res
    .status(201)
    .json(new ApiResponse(200, ratingCreated, "Successfully passed rating"))
})

export {
  RatingCreateController
}