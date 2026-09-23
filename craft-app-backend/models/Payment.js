const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  method: {
    type: String,
    enum: [
      "razorpay",
      "card",
      "cash_on_delivery",
      "bank_transfer"
    ],
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending"
  },

  transactionId: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Payment", paymentSchema);