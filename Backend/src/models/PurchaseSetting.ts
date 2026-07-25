import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IPurchaseSetting
  extends Document {
  minimumPurchaseAmount: number;
}

const purchaseSettingSchema =
  new Schema(
    {
      minimumPurchaseAmount: {
        type: Number,
        default: 0,
      },
    },
    { timestamps: true }
  );

export default mongoose.model(
  "PurchaseSetting",
  purchaseSettingSchema
);