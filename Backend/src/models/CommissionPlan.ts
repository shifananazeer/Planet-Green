import mongoose, { Schema, Document } from "mongoose";

export interface ICommissionPlan extends Document {
  level: number;
  amount: number;
  isActive: boolean;
}

const CommissionPlanSchema = new Schema(
  {
    level: {
      type: Number,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICommissionPlan>(
  "CommissionPlan",
  CommissionPlanSchema
);