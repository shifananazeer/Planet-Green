import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IProduct
  extends Document {
  name: string;
  description: string;

  price: number;

 category: mongoose.Types.ObjectId;

  images: string[];

  stock: number;

  isActive: boolean;
}

const productSchema =
  new Schema<IProduct>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        },

     images: [
        {
            type: String,
        },
        ],
      stock: {
        type: Number,
        default: 0,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<IProduct>(
  "Product",
  productSchema
);