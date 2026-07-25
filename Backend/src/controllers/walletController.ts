import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import User from "../models/User";
import CommissionHistory from "../models/CommissionHistory";

export const getWalletSummary = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = await User.findById(
      req.userId
    ).select(
      "name walletBalance totalEarnings"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        walletBalance:
          user.walletBalance || 0,
        totalEarnings:
          user.totalEarnings || 0,
      },
    });
  } catch (error) {
    console.error(
      "Get Wallet Summary Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getCommissionHistory =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const commissions =
        await CommissionHistory.find({
          user: req.userId,
        })
          .populate(
            "buyer",
            "name referralCode"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        count: commissions.length,
        data: commissions,
      });
    } catch (error) {
      console.error(
        "Commission History Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };


  export const getWalletDashboard =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const user = await User.findById(
        req.userId
      ).select(
        "walletBalance totalEarnings totalReferrals"
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const recentCommissions =
        await CommissionHistory.find({
          user: req.userId,
        })
          .populate(
            "buyer",
            "name"
          )
          .sort({
            createdAt: -1,
          })
          .limit(10);

      return res.status(200).json({
        success: true,
        data: {
          walletBalance:
            user.walletBalance || 0,
          totalEarnings:
            user.totalEarnings || 0,
          totalReferrals:
            user.totalReferrals || 0,
          recentCommissions,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };