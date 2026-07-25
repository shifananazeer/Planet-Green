import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import User from "../models/User";
import { buildTree , buildFullTree } from "../utils/referralService";
import Order from "../models/Order";
import CommissionHistory from "../models/CommissionHistory";
import { getMaxDepth } from "../utils/helpers";

export const getMyReferrals = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = await User.findById(
      req.userId
    ).populate(
      "directReferrals",
      "name email mobile profileImage createdAt"
    );

    return res.status(200).json({
      success: true,
      count: user?.directReferrals.length || 0,
      referrals:
        user?.directReferrals || [],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
};



export const getReferralTree = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const tree = await buildTree(
      req.userId!
    );

    return res.status(200).json({
      success: true,
      data: tree,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



export const getFullNetworkTree =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      // Find the root admin
      const admin =
        await User.findOne({
          role: "admin",
        });

      if (!admin) {
        return res.status(404).json({
          success: false,
          message:
            "Admin not found",
        });
      }

      const tree =
        await buildFullTree(
          admin._id.toString()
        );

      return res.status(200).json({
        success: true,
        data: tree,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };


  export const getNetworkStats =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const totalUsers =
        await User.countDocuments();

      const activeUsers =
        await User.countDocuments({
          isActive: true,
        });

      const totalOrders =
        await Order.countDocuments({
          paymentStatus: "paid",
        });

      const salesData =
        await Order.aggregate([
          {
            $match: {
              paymentStatus: "paid",
            },
          },
          {
            $group: {
              _id: null,
              totalSales: {
                $sum: "$totalAmount",
              },
            },
          },
        ]);

      const totalSales =
        salesData[0]?.totalSales || 0;

      // Direct referrals from root admin
      const admin =
        await User.findOne({
          role: "admin",
        });

      const directReferrals =
        admin?.directReferrals
          ?.length || 0;

      const maximumDepth = admin
        ? await getMaxDepth(
            admin._id.toString()
          )
        : 0;

      // Commission Stats
      const commissionData =
        await CommissionHistory.aggregate(
          [
            {
              $group: {
                _id: null,
                totalCommissionsPaid:
                  {
                    $sum: "$amount",
                  },
              },
            },
          ]
        );

      const totalCommissionsPaid =
        commissionData[0]
          ?.totalCommissionsPaid ||
        0;

      // Wallet Distributed
      const walletData =
        await User.aggregate([
          {
            $group: {
              _id: null,
              walletDistributed:
                {
                  $sum:
                    "$walletBalance",
                },
            },
          },
        ]);

      const walletDistributed =
        walletData[0]
          ?.walletDistributed || 0;

      return res.status(200).json({
        success: true,
        data: {
          totalUsers,
          activeUsers,
          totalOrders,
          totalSales,

          directReferrals,
          maximumDepth,

          totalCommissionsPaid,
          walletDistributed,
        },
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };