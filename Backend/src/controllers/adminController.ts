import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import PurchaseSetting from "../models/PurchaseSetting";
import Order from "../models/Order";
import User from "../models/User";
import CommissionHistory from "../models/CommissionHistory";
import Product from "../models/Product";
import Category from "../models/Category";

export const updatePurchaseSetting =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const {
        minimumPurchaseAmount,
      } = req.body;

      let setting =
        await PurchaseSetting.findOne();

      if (!setting) {
        setting =
          await PurchaseSetting.create({
            minimumPurchaseAmount,
          });
      } else {
        setting.minimumPurchaseAmount =
          minimumPurchaseAmount;

        await setting.save();
      }

      return res.json({
        success: true,
        setting,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server Error",
      });
    }
  };


  export const getPurchaseSetting =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const setting =
        await PurchaseSetting.findOne();

      return res.json({
        success: true,
        setting,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server Error",
      });
    }
  };


 export const getAllOrders = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      paymentStatus,
      orderStatus,
    } = req.query;

    const filter: any = {};

    if (paymentStatus) {
      filter.paymentStatus =
        paymentStatus;
    }

    if (orderStatus) {
      filter.orderStatus =
        orderStatus;
    }

    const orders = await Order.find(
      filter
    )
      .populate(
        "user",
        "name email mobile referralCode"
      )
      .populate({
        path: "items.product",
        select:
          "name images price",
      })
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


  export const updateOrderStatus =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const { orderId } =
        req.params;

      const {
        orderStatus,
      } = req.body;

      const order =
        await Order.findByIdAndUpdate(
          orderId,
          {
            orderStatus,
          },
          {
            new: true,
          }
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Order status updated",
        order,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };


  export const getDashboardStats = async (
  req: Request,
  res: Response
) => {
  try {
  const [
  totalUsers,
  activeUsers,
  totalOrders,
  totalProducts,
  totalCategories,
] = await Promise.all([
  User.countDocuments(),
  User.countDocuments({
    isActive: true,
  }),
  Order.countDocuments(),
  Product.countDocuments(),
  Category.countDocuments(),
]);

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
        total: {
          $sum: "$totalAmount",
        },
      },
    },
  ]);

const commissionData =
  await CommissionHistory.aggregate([
    {
      $group: {
        _id: null,
        total: {
          $sum: "$amount",
        },
      },
    },
  ]);

const totalWalletBalance =
  await User.aggregate([
    {
      $group: {
        _id: null,
        total: {
          $sum:
            "$walletBalance",
        },
      },
    },
  ]);
    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalOrders,
        totalProducts,
        totalCategories,

        totalSales:
          salesData[0]?.total || 0,

        totalCommissionPaid:
          salesData.length >= 0
            ? salesData[0]?.total || 0
            : 0,

        totalWalletBalance:
          totalWalletBalance[0]
            ?.total || 0,

      
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



export const getSalesChart =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const sales =
        await Order.aggregate([
          {
            $match: {
              paymentStatus:
                "paid",
            },
          },
          {
            $group: {
              _id: {
                month: {
                  $month:
                    "$createdAt",
                },
                year: {
                  $year:
                    "$createdAt",
                },
              },
              totalSales: {
                $sum:
                  "$totalAmount",
              },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
            },
          },
        ]);

      return res.status(200).json({
        success: true,
        data: sales,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
      });
    }
  };


  export const getRecentOrders =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const orders =
        await Order.find()
          .populate(
            "user",
            "name"
          )
          .sort({
            createdAt: -1,
          })
          .limit(10);

      return res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
      });
    }
  };



  export const getRecentUsers =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const users =
        await User.find()
          .select(
            "name email referralCode createdAt"
          )
          .sort({
            createdAt: -1,
          })
          .limit(10);

      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
      });
    }
  };


  export const getRecentCommissions =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const commissions =
        await CommissionHistory.find()
          .populate(
            "user",
            "name"
          )
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
        data: commissions,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
      });
    }
  };