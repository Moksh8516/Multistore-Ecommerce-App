import { Review } from "../models/reviews.models.js"
import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createReview = asyncHandler(async (req, res) => {
  const { reviews } = req.body;
  const { userid, Productid } = req.params;
  if (!reviews) {
    return res.status(400).json({ message: "Field required" })
  }
  const reviewCreateController = (await Review.create({
    reviews,
    userid,
    Productid
  })).populate("userid Productid")
  if (!reviewCreateController) {
    throw new ApiError(404, "something went wrong while sending a review")
  }
  res.status(201).json(
    new ApiResponse(200,
      { reviewCreateController }, "review send Successfully ")
  )
})

const getAllProductReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await Review.find({ Productid: id }).populate("userid Productid")
  if (!review) {
    throw new ApiError(404, "something went wrong while sending a review")
  }
  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    review = review.skip(pageSize * (page - 1)).limit(pageSize)
  }
  res.status(200)
    .json(new ApiResponse(200, { review }, "fecthed review successfully"))
})

const deleteReview = asyncHandler(async (req, res) => {
  const { reviewid } = req.params;
  const cleanReview = await Review.findByIdAndDelete(reviewid)
  if (!cleanReview) {
    throw new ApiError(500, "Something went wrong while deleting review")
  }
  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Review deleted successfully"))
})

export {
  createReview,
  getAllProductReview,
  deleteReview
}