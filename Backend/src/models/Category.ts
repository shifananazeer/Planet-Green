import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface ICategory
  extends Document {
  name: string;
  description?: string;
  image?: string;
}

const categorySchema =
  new Schema<ICategory>(
    {
      name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      description: {
        type: String,
        default: "",
      },

      image: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<ICategory>(
  "Category",
  categorySchema
);