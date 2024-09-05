import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  status: {
    type: ["pending", "delivered", "cancelled"],
    default: "pending",
  },
  order_date: {
    type: Date,
    default: Date.now(),
  },
  delivered_date: {
    type: Date,
  },
  paymentDetails: {
    paymentMethod: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    paymentId: {
      type: String,
    },
    paymentStatus: {
      type: ["pending", "confirmed", "failed"],
      default: "pending",
    }
  },
  orderItems: {
    type: [mongoose.Schema.Types.Mixed],
    required: true
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  totalItem: {
    type: Number,
  }
}, { timestamps: true });

export const Order = mongoose.model("Order", OrderSchema);