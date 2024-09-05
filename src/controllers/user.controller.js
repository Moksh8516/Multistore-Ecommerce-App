import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findOne(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, "something went wrong while to generate a Token")
  }
}

const options = {
  httpOnly: true,
  secure: true
}

const register = asyncHandler(async (req, res) => {
  // Recieve Data from Frontend
  const { username, email, password, mobileNo } = req.body;
  // Check validation of userfield
  if (email === "") {
    throw new ApiError(400, "Email  field is required")
  }
  else if (mobileNo === "") {
    throw new ApiError(400, "mobile Number field is required")

  } else if (password === "") {
    throw new ApiError(400, "Password field is required")
  }
  // Check user authentication 
  const existingUser = await User.findOne({
    $or: [{ email: email }, { mobileNo: mobileNo }]
  })

  if (existingUser) {
    throw new ApiError(409, "Email or Mobile number already exists, Please try another Email or Mobile number")
  }

  // Image
  let avatarLoacalPath;
  if (req.files && Array.isArray(req.files.avatar)) {
    if (req.files.avatar.length > 0) {
      avatarLoacalPath = req.files.avatar[0].path
    }
  }
  // if (!avatarLoacalPath) {
  //   return console.log('File is not found', null, avatarLoacalPath)
  // }

  // Create a new user
  const user = await User.create({
    username,
    email,
    mobileNo,
    avatar: avatarLoacalPath || "",
    password,
  })

  const createUser = await User.findById(user._id).select("-password -refreshToken")
  // console.log("create user", createUser)

  if (!createUser) {
    throw new ApiError(500, "Something went wrong while to register a user")
  }

  return res
    .status(201)
    .json(new ApiResponse(200, { createUser }, "User Registered Sccuessfully"))
})

const login = asyncHandler(async (req, res) => {
  const { email, mobileNo, password } = req.body
  // Recieve Data from Frontend
  if (!(email || mobileNo)) {
    throw new ApiError(400, "Username or Mobile Number field is required")
  }
  // check user
  const user = await User.findOne({
    $or: [{ email }, { mobileNo }]
  })

  if (!user) {
    throw new ApiError(401, "Invalid username or mobile number")
  }

  // check user password
  const isPasswordValid = await user.comparePassword(password)
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password, Please provide Valid Password")
  }

  // provide Tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const userLoggedIn = await User.findById(user._id).select("-password -refreshToken")

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, { user: userLoggedIn, accessToken, refreshToken }, "User Login Successfully")
    )
})

const logout = asyncHandler(async (req, res) => {
  // require users user Id
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    })

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logout Successfully"))
})

const refreshAndAccessToken = asyncHandler(async (req, res) => {
  // send Token Request in cookies 
  const incomingRefreshToken = await req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "If you are New user, first Register your Account")
  }

  try {
    // decode Token
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)

    const user = await User.findById(decodedToken?._id)
    if (!user) {
      throw new ApiError(401, "Invalid Request Token")
    }
    // check token Validation
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "unauthorized Request, Refresh token is expired or used")
    }
    // Re-generate Token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    console.log(refreshToken)
    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken }, "Successfully refresh Access Token"))
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token")
  }
})

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  const user = await User.findById(req.user?._id)
  if (!user) {
    throw new ApiError(401, "user not authenticate")
  }
  const isPasswordValid = user.comparePassword(oldPassword)
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Old Password")
  }
  // update password
  user.password = newPassword;
  await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed Succesfully"))
})

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email) {
    throw new ApiError(400, "Email is required")
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(401, "User not found")
  }
  // generate Rest password token 
  const resetFieldToken = jwt.sign({
    _id: user._id,
    email: user.email,
    username: user.username
  }, process.env.RESET_PASSWORD_TOKEN_SECRET_KEY, {
    expiresIn: process.env.RESET_PASSWORD_TOKEN_EXPIRY
  })
  const resetPasswordLink = `http://localhost:5173/reset-Password/${resetFieldToken}`

  // send email with reset password via link
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // or 'STARTTLS'
    auth: {
      user: process.env.NODIMAILER_EMAIL,
      pass: process.env.NODIMAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NODIMAILER_EMAIL,
    to: user.email,
    subject: "Reset Password",
    text: `Reset your password: ${resetPasswordLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  console.log(resetPasswordLink)
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset link sent to your email "))
})

const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params
  if (!newPassword) {
    throw new ApiError(400, "New Password is required")
  }

  try {
    const decodedToken = jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET_KEY)
    if (!decodedToken) {
      throw new ApiError(401, "Unauthorized Request, Invalid user Token")
    }
    // update password
    const user = await User.findById(decodedToken?._id)
    user.password = newPassword;
    if (!user) {
      throw new ApiError(401, "user unauthorized")
    }
    await user.save({ validateBeforeSave: false })
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Password reset successfully"));

  } catch (error) {
    throw new ApiError(401, "Invalid Reset Token")
  }
})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Fetch user Successfull"))
})

const getUpdateAccountDetails = asyncHandler(async (req, res) => {
  const { username, email, mobileNo } = req.body

  if (!username && !email && !mobileNo) {
    throw new ApiError(400, "filled is required")
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        username: username,
        email: email,
        mobileNo: mobileNo,
      }
    },
    {
      new: true,
    }).select("-password")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile Changing successfully"))
})

const getUpdateAvatarImg = asyncHandler(async (req, res) => {
  const avtarLocalPath = req.file?.path
  if (!avtarLocalPath) {
    throw new ApiError(400, "Please upload an image")
  }
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { avatar: avtarLocalPath }
    },
    {
      new: true
    }
  ).select("-password")

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Avatar Image changed successfully")
    )
})

export {
  register,
  login,
  logout,
  refreshAndAccessToken,
  changePassword,
  forgetPassword,
  resetPassword,
  getCurrentUser,
  getUpdateAccountDetails,
  getUpdateAvatarImg,
}