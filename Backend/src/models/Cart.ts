import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface ICart
  extends Document {
  user: mongoose.Types.ObjectId;

  items: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];
}

const cartSchema =
  new Schema<ICart>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },

      items: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
          },

          quantity: {
            type: Number,
            default: 1,
          },
        },
      ],
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<ICart>(
  "Cart",
  cartSchema
);