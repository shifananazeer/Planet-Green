import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";
import { AuthRequest } from "../middlewares/authMiddleware";
import { generateReferralCode } from "../utils/generateReferralCode";


export const signup = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      email,
    
      password,
      referralCode,
    } = req.body;

    // Check email
    const existingEmail =
      await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message:
          "Email already exists",
      });
    }

    // // Check mobile
    // const existingMobile =
    //   await User.findOne({ mobile });

    // if (existingMobile) {
    //   return res.status(400).json({
    //     success: false,
    //     message:
    //       "Mobile number already exists",
    //   });
    // }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    let referredBy = null;
    let level = 0;

    // Sponsor Validation
    if (referralCode) {
      const sponsor =
        await User.findOne({
          referralCode:
            referralCode.trim(),
        });

      if (!sponsor) {
        return res.status(404).json({
          success: false,
          message:
            "Invalid referral code",
        });
      }

      if (
          sponsor.directReferrals.length >= 10
        ) {
          return res.status(400).json({
            message:
              "Sponsor referral limit reached",
          });
        }

      referredBy = sponsor._id;
      level = sponsor.level + 1;
    }

    // Generate unique referral code
   let referralCodeGenerated;

let exists = true;

while (exists) {
  referralCodeGenerated =
    generateReferralCode();

  exists = !!(
    await User.findOne({
      referralCode:
        referralCodeGenerated,
    })
  );
}

    const user = await User.create({
      name,
      email,
    
      password: hashedPassword,

      referralCode:
         referralCodeGenerated,

      referredBy,

      level,

      directReferrals: [],

      totalReferrals: 0,

      totalEarnings: 0,

      walletBalance: 0,

      role: "user",

      isActive: true,
    });

    // Update Sponsor
    if (referredBy) {
      await User.findByIdAndUpdate(
        referredBy,
        {
          $push: {
            directReferrals: user._id,
          },

          $inc: {
            totalReferrals: 1,
          },
        }
      );
    }

    const token = generateToken(
      user._id.toString(),
      user.role
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "strict",
      maxAge:
        7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message:
        "Account created successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        referralCode:
          user.referralCode,
        walletBalance:
          user.walletBalance,
      },
    });

  } catch (error) {
    console.error(
      "Signup Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        message: "Account is inactive",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

   const token = generateToken(
  user._id.toString(),
  user.role
);

    res.cookie("token", token, {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite:
        process.env.NODE_ENV ===
        "production"
          ? "none"
          : "lax",
      maxAge:
        7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        referralCode:
          user.referralCode,
        totalReferrals:
          user.totalReferrals,
        totalEarnings:
          user.totalEarnings,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};



export const logout = (
  req: Request,
  res: Response
) => {
  res.clearCookie("token");

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};