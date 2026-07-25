import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IWalletTransaction
  extends Document {
  user: mongoose.Types.ObjectId;

  type:
    | "commission"
    | "withdrawal"
    | "withdrawal_rejected"
    | "refund"
    | "admin_adjustment";

  amount: number;

  transactionType:
    | "credit"
    | "debit";

  description: string;

  referenceId?: mongoose.Types.ObjectId;

  balanceAfter: number;
}

const walletTransactionSchema =
  new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      type: {
        type: String,
        enum: [
          "commission",
          "withdrawal",
          "withdrawal_rejected",
          "refund",
          "admin_adjustment",
        ],
        required: true,
      },

      amount: {
        type: Number,
        required: true,
      },

      transactionType: {
        type: String,
        enum: [
          "credit",
          "debit",
        ],
        required: true,
      },

      description: {
        type: String,
        default: "",
      },

      referenceId: {
        type: Schema.Types.ObjectId,
      },

      balanceAfter: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<IWalletTransaction>(
  "WalletTransaction",
  walletTransactionSchema
);