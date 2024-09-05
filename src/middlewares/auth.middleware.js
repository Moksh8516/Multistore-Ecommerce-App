import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiErrors.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
      throw new ApiError(401, "Unauthorized Request")
    }
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
    if (!decodeToken) {
      throw new ApiError(401, "Unauthorized Request, Token is not valid!!")
    }
    const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Token")
  }
})

export { verifyJWT }