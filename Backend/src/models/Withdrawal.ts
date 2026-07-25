import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IWithdrawal
  extends Document {
  user: mongoose.Types.ObjectId;

  amount: number;

  paymentMethod:
    | "upi"
    | "bank";

  status:
    | "pending"
    | "approved"
    | "paid"
    | "rejected";

  adminRemark?: string;
 
    proofImage?: string;

    transactionId:string;
    
  approvedAt?: Date;

  paidAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const withdrawalSchema =
  new Schema<IWithdrawal>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      amount: {
        type: Number,
        required: true,
        min: 1,
      },

      paymentMethod: {
        type: String,
        enum: [
          "upi",
          "bank",
        ],
        required: true,
      },

      status: {
        type: String,
        enum: [
          "pending",
          "approved",
          "paid",
          "rejected",
        ],
        default: "pending",
      },

      adminRemark: {
        type: String,
        default: "",
      },
      proofImage: {
        type: String,
        default: "",
        },
        transactionId: {
            type: String,
            default: "",
            },

      approvedAt: {
        type: Date,
      },

      paidAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<IWithdrawal>(
  "Withdrawal",
  withdrawalSchema
);