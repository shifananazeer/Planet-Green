import { Request, Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middlewares/authMiddleware";
import Order from "../models/Order";
import Cart from "../models/Cart";
import PurchaseSetting from "../models/PurchaseSetting";
import Razorpay from "razorpay";
import crypto from "crypto";
import { distributeCommission } from "../utils/commisionService";


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret:
    process.env.RAZORPAY_KEY_SECRET!,
});


export const getDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = await User.findById(
      req.userId
    )
      .populate(
        "directReferrals",
        "name email createdAt"
      )
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const directReferralsCount =
      user.directReferrals.length;

    const recentReferrals =
      [...user.directReferrals]
        .sort(
          (a: any, b: any) =>
            new Date(
              b.createdAt
            ).getTime() -
            new Date(
              a.createdAt
            ).getTime()
        )
        .slice(0, 5);

    return res.status(200).json({
      success: true,

      user: {
        name: user.name,
        email: user.email,
        referralCode:
          user.referralCode,
        level: user.level,
      },

      stats: {
        directReferrals:
          directReferralsCount,

        totalReferrals:
          user.totalReferrals,

        totalEarnings:
          user.totalEarnings,

        teamSize:
          user.totalReferrals,
      },

      recentReferrals,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};



export const checkout = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const cart = await Cart.findOne({
      user: req.userId,
    }).populate("items.product");

    if (
      !cart ||
      cart.items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const setting =
      await PurchaseSetting.findOne();

    let totalAmount = 0;

    const orderItems =
      cart.items.map((item: any) => {
        totalAmount +=
          item.product.price *
          item.quantity;

        return {
          product:
            item.product._id,
          quantity:
            item.quantity,
          price:
            item.product.price,
        };
      });

    const minimumPurchaseAmount =
      setting?.minimumPurchaseAmount ||
      0;

    if (
      totalAmount <
      minimumPurchaseAmount
    ) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase amount is ₹${minimumPurchaseAmount}`,
      });
    }

    // Create Razorpay Order
    const razorpayOrder =
      await razorpay.orders.create({
        amount: totalAmount * 100, // paise
        currency: "INR",
        receipt: `PG_${Date.now()}`,
      });

    // Save Order as Pending
    const order =
      await Order.create({
        user: req.userId,
        items: orderItems,
        totalAmount,

        paymentStatus:
          "pending",

        orderStatus:
          "pending",

        razorpayOrderId:
          razorpayOrder.id,
      });

    return res.status(201).json({
      success: true,
      order,
      razorpayOrder,
      key:
        process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log(
      "Checkout Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const verifyPayment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const order =
      await Order.findOneAndUpdate(
        {
          razorpayOrderId:
            razorpay_order_id,
        },
        {
          paymentStatus: "paid",
          orderStatus:
            "processing",
          razorpayPaymentId:
            razorpay_payment_id,
        },
        {
          new: true,
        }
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // MLM Commission Distribution
   if (
  !order.commissionDistributed &&
  order.user
) {
  await distributeCommission(
    order.user.toString(),
    order._id.toString()
  );

  order.commissionDistributed = true;
  await order.save();
}

    // Clear Cart
    await Cart.findOneAndUpdate(
      {
        user: req.userId,
      },
      {
        $set: {
          items: [],
        },
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Payment verified successfully",
      order,
    });

  } catch (error) {
    console.log(
      "Verify Payment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const getMyOrders =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const orders =
        await Order.find({
          user: req.userId,
        })
          .populate(
            "items.product"
          )
          .sort({
            createdAt: -1,
          });

      return res.json({
        success: true,
        orders,
      });

    } catch (error) {
      return res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

