import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IOrder
  extends Document {
  user: mongoose.Types.ObjectId;

  items: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  totalAmount: number;

  paymentStatus:
    | "pending"
    | "paid"
    | "failed";

  orderStatus:
    | "pending"
    | "processing"
    | "completed"
    | "cancelled";
   comssionDistributed:boolean;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
      },
    ],

    totalAmount: Number,

    paymentStatus: {
      type: String,
      default: "pending",
    },

    orderStatus: {
      type: String,
      default: "pending",
    },
    commissionDistributed: {
    type: Boolean,
    default: false,
  },

    razorpayOrderId: String,
    razorpayPaymentId: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Order",
  orderSchema
);