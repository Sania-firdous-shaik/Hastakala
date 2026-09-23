const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const Order = require("../models/Order");
const Payment = require("../models/Payment");
const { optionalAuthenticate } = require("../middleware/auth");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
router.post("/create-order", optionalAuthenticate, async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        error: "Order ID is required"
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        error: "Order not found"
      });
    }

    // Check ownership for logged-in users
    if (
      req.user &&
      order.user &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        error: "Not authorized to pay for this order"
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        error: "Order is not pending"
      });
    }

    const amount = Math.round(Number(order.totalAmount) * 100);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: "Invalid order amount"
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: order._id.toString(),
      notes: {
        orderId: order._id.toString()
      }
    });

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);

    res.status(500).json({
      error: "Failed to create Razorpay order"
    });
  }
});

// Verify Razorpay payment
router.post("/verify", optionalAuthenticate, async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (
      !orderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        error: "Payment verification details are required"
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        error: "Order not found"
      });
    }

    // Check ownership for logged-in users
    if (
      req.user &&
      order.user &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        error: "Not authorized to verify this payment"
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(razorpay_signature)
      )
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid payment signature"
      });
    }

    // Prevent duplicate payment records
    const existingPayment = await Payment.findOne({
      transactionId: razorpay_payment_id
    });

    if (existingPayment) {
      return res.json({
        success: true,
        message: "Payment already verified",
        payment: existingPayment
      });
    }

    const payment = new Payment({
      order: order._id,
      amount: order.totalAmount,
      method: "razorpay",
      status: "paid",
      transactionId: razorpay_payment_id
    });

    await payment.save();

    order.status = "confirmed";
    await order.save();

    res.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: payment._id,
      orderId: order._id
    });
  } catch (error) {
    console.error("Razorpay verification error:", error);

    res.status(500).json({
      error: "Payment verification failed"
    });
  }
});

// Get payment history
router.get("/history", optionalAuthenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required"
      });
    }

    const orders = await Order.find({
      user: req.user._id
    }).select("_id");

    const orderIds = orders.map((order) => order._id);

    const payments = await Payment.find({
      order: { $in: orderIds }
    })
      .populate("order")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
  console.error("Create Razorpay order error:", error);
  console.error("Razorpay error details:", error?.error || error);

  res.status(500).json({
    error: error?.error?.description || error.message || "Failed to create Razorpay order"
  });
}
});

module.exports = router;

