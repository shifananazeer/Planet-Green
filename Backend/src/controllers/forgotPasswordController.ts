import { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/User";
import bcrypt from "bcrypt";

export const forgotPassword = async (
  req: Request,
  res: Response
) => {
    console.log("forgot")
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpires = new Date(
      Date.now() + 60 * 60 * 1000 // 1 hour
    );

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    return res.status(200).json({
      success: true,
      message: "Reset token generated",
      resetUrl,
      resetToken,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};


export const resetPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { token } = req.params;
  console.log(
  "TOKEN FROM URL:",
  JSON.stringify(token)
);
console.log(
  "TOKEN LENGTH:",
  token.length
);
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};