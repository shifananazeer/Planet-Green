
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import User from "../models/User";
import cloudinary from "../config/cloudinary";


export const getMe = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = await User.findById(
      req.userId
    )
      .populate(
        "referredBy",
        "name email referralCode"
      )
      .populate(
        "directReferrals",
        "name email mobile profileImage createdAt"
      )
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = await User.findById(
      req.userId
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      name,
      mobile,
      address,
      city,
      state,
      pincode,

      // Withdrawal Details
      upiId,
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
    } = req.body;

    let profileImage =
      user.profileImage;

    if (req.file) {
      const result =
        await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString(
            "base64"
          )}`,
          {
            folder:
              "green-planet/profile",
          }
        );

      profileImage =
        result.secure_url;
    }

    // Profile Details
    user.name =
      name || user.name;

    user.mobile =
      mobile || user.mobile;

    user.address =
      address || user.address;

    user.city =
      city || user.city;

    user.state =
      state || user.state;

    user.pincode =
      pincode || user.pincode;

    user.profileImage =
      profileImage;

    // Withdrawal Details
    user.upiId =
      upiId ?? user.upiId;

    user.accountHolderName =
      accountHolderName ??
      user.accountHolderName;

    user.bankName =
      bankName ??
      user.bankName;

    user.accountNumber =
      accountNumber ??
      user.accountNumber;

    user.ifscCode =
      ifscCode ??
      user.ifscCode;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};