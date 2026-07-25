import { Request, Response } from "express";
import CommissionPlan from "../models/CommissionPlan";
import CommissionHistory from "../models/CommissionHistory";

// Create Level
export const createCommissionLevel = async (
  req: Request,
  res: Response
) => {
  try {
    const { level, amount } = req.body;

    const exists = await CommissionPlan.findOne({ level });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Level already exists",
      });
    }

    const commission = await CommissionPlan.create({
      level,
      amount,
    });

    res.status(201).json({
      success: true,
      data: commission,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Levels
export const getCommissionLevels = async (
  req: Request,
  res: Response
) => {
  try {
    const commissions = await CommissionPlan.find()
      .sort({ level: 1 });

    res.status(200).json({
      success: true,
      data: commissions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Level
export const updateCommissionLevel = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { amount, isActive } = req.body;

    const commission =
      await CommissionPlan.findByIdAndUpdate(
        id,
        {
          amount,
          isActive,
        },
        { new: true }
      );

    if (!commission) {
      return res.status(404).json({
        success: false,
        message: "Commission level not found",
      });
    }

    res.status(200).json({
      success: true,
      data: commission,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Level
export const deleteCommissionLevel = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const commission =
      await CommissionPlan.findByIdAndDelete(id);

    if (!commission) {
      return res.status(404).json({
        success: false,
        message: "Commission level not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Commission level deleted",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getCommissionReport =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const commissions =
        await CommissionHistory.find()
          .populate(
            "user",
            "name referralCode"
          )
          .populate(
            "buyer",
            "name referralCode"
          )
          .populate(
            "order",
            "orderNumber totalAmount"
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
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };