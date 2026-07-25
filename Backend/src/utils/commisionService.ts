import CommissionPlan from "../models/CommissionPlan";
import User from "../models/User";
import CommissionHistory from "../models/CommissionHistory";
import WalletTransaction from "../models/WalletTransaction";

export const distributeCommission = async (
  buyerId: string,
  orderId: string
) => {
  const plans =
    await CommissionPlan.find({
      isActive: true,
    }).sort({ level: 1 });

  let currentUser =
    await User.findById(buyerId);

  for (const plan of plans) {
    if (
      !currentUser?.referredBy
    )
      break;

    const sponsor =
      await User.findById(
        currentUser.referredBy
      );

    if (!sponsor) break;

    // Credit Wallet
    sponsor.walletBalance =
      (sponsor.walletBalance || 0) +
      plan.amount;

    sponsor.totalEarnings =
      (sponsor.totalEarnings || 0) +
      plan.amount;

    await sponsor.save();

    // Commission History
    await CommissionHistory.create({
      user: sponsor._id,
      buyer: buyerId,
      order: orderId,
      level: plan.level,
      amount: plan.amount,
      status: "credited",
    });

    // Wallet Transaction
    await WalletTransaction.create({
      user: sponsor._id,
      amount: plan.amount,
      transactionType:
        "credit",
      type: "commission",
      description: `Level ${plan.level} commission`,
      referenceId: orderId,
      balanceAfter:
        sponsor.walletBalance,
    });

    currentUser = sponsor;
  }
};