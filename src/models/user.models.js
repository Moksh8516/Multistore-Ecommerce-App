import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNo: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    default: "User",
    required: true,
  },
  address: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    }
  ],
  paymentInfo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment-Info"
  }],
  rating: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rating'
    }
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],
  refreshToken: {
    type: String,
  },
}, { timestamps: true })

// pre middlewares

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next();
})

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

// Tokens 
userSchema.methods.generateAccessToken = function () {
  return jwt.sign({
    _id: this._id,
    email: this.email,
    mobileNo: this.mobileNo
  },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    })
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({
    _id: this._id,
  },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    })
}

export const User = mongoose.model("User", userSchema);