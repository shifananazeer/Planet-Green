import WalletTransaction from "../models/WalletTransaction";

export const createWalletTransaction =
  async ({
    user,
    amount,
    transactionType,
    type,
    description,
    referenceId,
    balanceAfter,
  }: any) => {
    await WalletTransaction.create({
      user,
      amount,
      transactionType,
      type,
      description,
      referenceId,
      balanceAfter,
    });
  };