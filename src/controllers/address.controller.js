import { Address } from "../models/address.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";


const createAddress = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user?._id).populate("address").select("-password -refreshToken")

  if (!user) {
    throw new ApiError(400, "User not found!")
  }

  const { userName, email, mobile_no, building_no, street, city, pincode, state, landMark } = req.body

  if ([userName, email, mobile_no, building_no, street, city, pincode, state].some(field => field.trim() === "")) {
    throw new ApiError(400, "All fields are required!")
  }
  const address = await Address.create({
    userId: user._id,
    userName,
    email,
    mobile_no,
    building_no,
    street,
    city,
    pincode,
    state,
    landMark: landMark || "",
  })
  if (!address) {
    throw new ApiError(500, "Failed to create address")
  }
  await user.address.push(address)
  await user.save()
  return res
    .status(200)
    .json(new ApiResponse(200, address, "Address created successfully!"))
})

const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!id) {
    throw new ApiError(400, "Invalid address!")
  }

  const update = await Address.findByIdAndUpdate(id,
    {
      $set: req.body
    },
    {
      new: true,
    }
  )
  if (!update) {
    throw new ApiError(404, "Address not found!")
  }
  return res
    .status(200)
    .json(new ApiResponse(200, update, "address updated successfully"))
})

const readAddress = asyncHandler(async (req, res) => {
  const id = req.user?._id;
  console.log(id)
  const address = await Address.find({ userId: id })
  console.log(address)
  if (!address) {
    throw new ApiError(400, "address data is not found")
  }
  return res
    .status(200)
    .json(new ApiResponse(200, address, "address data fetched successfuly"))
})

const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params
  const User = req.user;
  if (!id) {
    throw new ApiError(400, "Invalid Address")
  }

  // Check if the address exists in the User's address array
  if (!User.address.includes(id)) {
    throw new ApiError(404, "Address not found, Something went wrong!!")
  }

  // Remove the address from the User's address array
  await User.updateOne({ $pull: { address: id } });

  // Delete the address from the database
  const deleteID = await Address.findByIdAndDelete(id)
  if (!deleteID) {
    throw new ApiError(404, "Address not found!")
  }

  // Save the updated User document
  await User.save({ validateBeforeSave: false });

  // Fetch the updated list of addresses
  const address = await Address.find({ userId: User._id })

  return res
    .status(200)
    .json(new ApiResponse(200, address, "address deleted Successfully"))
})

const getAddressById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const address = await Address.findById(id)
  if (!address) {
    throw new ApiError(404, "Address not found")
  }
  return res.status(200).json(new ApiResponse(200, address, "Address fetched successfully"))
})

// const deleteAddress = asyncHandler(async (req, res) => {
//   const { id } = req.params
//   const User = req.user;
//   if (!id) {
//     throw new ApiError(400, "Invalid Address")
//   }
//   console.log(User)
//   const deleteInUserIndex = User.address.indexOf(id);
//   console.log(deleteInUserIndex)
//   if (deleteInUserIndex === -1) {
//     throw new ApiError(400, "Address not found, Something went wrong!!")
//   }
//   User.address.splice(deleteInUserIndex, 1);
//   const deleteID = await Address.findByIdAndDelete(id)
//   if (!deleteID) {
//     throw new ApiError(404, "Address not found!")
//   }
//   await User.save({ validateBeforeSave: false });
//   const address = await Address.find({ userId: User._id })
//   return res
//     .status(200)
//     .json(new ApiResponse(200, address, "address deleted Successfully"))
// })

export {
  createAddress,
  updateAddress,
  readAddress,
  deleteAddress,
  getAddressById
}