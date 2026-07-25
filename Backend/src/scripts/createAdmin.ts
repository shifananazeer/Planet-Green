import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import User from "../models/User";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI as string
    );

    const existingAdmin =
      await User.findOne({
        email: "admin@greenplanet.com",
      });

    if (existingAdmin) {
      console.log(
        "Admin already exists"
      );
      process.exit(0);
    }

    const hashedPassword =
      await bcrypt.hash(
        "Admin@123",
        10
      );

    await User.create({
      name: "Admin",

      email: "admin@greenplanet.com",

      mobile: "9999999999",

      password: hashedPassword,

      referralCode: "ADMIN001",

      referredBy: null,

      directReferrals: [],

      level: 0,

      totalReferrals: 0,

      totalEarnings: 0,

      walletBalance: 0,

      role: "admin",

      isActive: true,

      address: "",

      city: "",

      state: "",

      pincode: "",
    });

    console.log(
      "Admin created successfully"
    );

    process.exit(0);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

createAdmin();