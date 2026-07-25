import { Request, Response } from "express";
import Withdrawal from "../models/Withdrawal";
import User from "../models/User";
import { AuthRequest } from "../middlewares/authMiddleware";
import cloudinary from "../config/cloudinary";
import WalletTransaction from "../models/WalletTransaction";

export const createWithdrawalRequest =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const {
        amount,
        paymentMethod,
      } = req.body;

      const user =
        await User.findById(
          req.userId
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (
        !amount ||
        amount <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid amount",
        });
      }

      if (
        user.walletBalance <
        amount
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Insufficient wallet balance",
        });
      }

      if (
        paymentMethod ===
          "upi" &&
        !user.upiId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please add UPI details",
        });
      }

      if (
        paymentMethod ===
          "bank" &&
        (!user.accountNumber ||
          !user.ifscCode)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please add bank details",
        });
      }

      const withdrawal =
        await Withdrawal.create({
          user: user._id,
          amount,
          paymentMethod,
        });

      // Deduct wallet immediately
      user.walletBalance =
        user.walletBalance -
        amount;

      await user.save();

      // Wallet transaction
      await WalletTransaction.create({
        user: user._id,
        amount,
        transactionType:
          "debit",
        type: "withdrawal",
        description:
          "Withdrawal request submitted",
        referenceId:
          withdrawal._id,
        balanceAfter:
          user.walletBalance,
      });

      return res.status(201).json({
        success: true,
        message:
          "Withdrawal request submitted",
        data: withdrawal,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };


  export const getMyWithdrawals =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const withdrawals =
        await Withdrawal.find({
          user: req.userId,
        }).sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        count:
          withdrawals.length,
        data: withdrawals,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };



  export const getAllWithdrawals =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const withdrawals =
        await Withdrawal.find()
          .populate(
            "user",
            "name email mobile walletBalance upiId accountHolderName bankName accountNumber ifscCode"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        count:
          withdrawals.length,
        data: withdrawals,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };



  export const approveWithdrawal =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const withdrawal =
        await Withdrawal.findById(
          req.params.id
        );

      if (!withdrawal) {
        return res.status(404).json({
          success: false,
          message:
            "Withdrawal not found",
        });
      }

      if (
        withdrawal.status !==
        "pending"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Request already processed",
        });
      }

      const user =
        await User.findById(
          withdrawal.user
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      if (
        user.walletBalance <
        withdrawal.amount
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Insufficient wallet balance",
        });
      }

      user.walletBalance -=
        withdrawal.amount;

      await user.save();

      withdrawal.status =
        "approved";

      withdrawal.approvedAt =
        new Date();

      await withdrawal.save();

      return res.status(200).json({
        success: true,
        message:
          "Withdrawal approved",
        data: withdrawal,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };



  export const rejectWithdrawal =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const withdrawal =
        await Withdrawal.findById(
          req.params.id
        );

      if (!withdrawal) {
        return res.status(404).json({
          success: false,
          message:
            "Withdrawal not found",
        });
      }

      withdrawal.status =
        "rejected";

      withdrawal.adminRemark =
        req.body.remark || "";

      await withdrawal.save();

      return res.status(200).json({
        success: true,
        message:
          "Withdrawal rejected",
        data: withdrawal,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };



  export const markWithdrawalPaid =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const withdrawal =
        await Withdrawal.findById(
          req.params.id
        );

      if (!withdrawal) {
        return res.status(404).json({
          success: false,
          message:
            "Withdrawal not found",
        });
      }

      if (
        withdrawal.status !==
        "approved"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only approved requests can be marked paid",
        });
      }

      let proofImage = "";

      if (req.file) {
        const result =
          await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString(
              "base64"
            )}`,
            {
              folder:
                "green-planet/withdrawals",
            }
          );

        proofImage =
          result.secure_url;
      }

      withdrawal.status =
        "paid";

      withdrawal.paidAt =
        new Date();

      withdrawal.proofImage =
        proofImage;

      withdrawal.transactionId =
        req.body.transactionId ||
        "";

      await withdrawal.save();

      return res.status(200).json({
        success: true,
        message:
          "Withdrawal marked as paid",
        data: withdrawal,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };






  