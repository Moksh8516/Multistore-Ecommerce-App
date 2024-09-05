import mongoose from "mongoose";

const DeliveryInstructionSchema = new mongoose.Schema({
  addressType: {
    type: ["House", "Apartment", "Business", "Other"],
    default: "House",
  },
  deliveredDay: {
    type: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  additional_info: {
    type: String,
  },
})

const AddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userName: {
    type: String,
    required: true,
    uppercase: true,
  },
  mobile_no: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  building_no: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  landMark: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  instructions: [DeliveryInstructionSchema],
}, { timestamps: true })

export const Address = mongoose.model("Address", AddressSchema);