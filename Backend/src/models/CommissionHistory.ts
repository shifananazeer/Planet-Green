import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface ICommissionHistory
  extends Document {
  user: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;

  level: number;
  amount: number;

  status:
    | "credited"
    | "withdrawn";

  createdAt: Date;
  updatedAt: Date;
}

const commissionHistorySchema =
  new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      buyer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      order: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },

      level: {
        type: Number,
        required: true,
      },

      amount: {
        type: Number,
        required: true,
      },

      status: {
        type: String,
        enum: [
          "credited",
          "withdrawn",
        ],
        default: "credited",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<ICommissionHistory>(
  "CommissionHistory",
  commissionHistorySchema
);