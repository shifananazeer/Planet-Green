import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IUser
  extends Document {
  name: string;
  email: string;
  mobile: string;
  password: string;

  profileImage?: string;

  referralCode: string;

  referredBy?: mongoose.Types.ObjectId;

  directReferrals: mongoose.Types.ObjectId[];

  level: number;

  totalReferrals: number;

  totalEarnings: number;

  walletBalance: number;

  isActive: boolean;

  role: "admin" | "user";

  address?: string;
  city?: string;
  state?: string;
  pincode?: string;

  upiId?: string;

  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;

  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema =
  new Schema<IUser>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },

      mobile: {
        type: String,
       default:""
       
      },

      password: {
        type: String,
        required: true,
      },

      profileImage: {
        type: String,
        default: "",
      },

      referralCode: {
        type: String,
        required: true,
        unique: true,
      },

      // Sponsor
      referredBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      // Direct Team
      directReferrals: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      level: {
        type: Number,
        default: 0,
      },

      totalReferrals: {
        type: Number,
        default: 0,
      },

      totalEarnings: {
        type: Number,
        default: 0,
      },

      walletBalance: {
        type: Number,
        default: 0,
      },

      role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      address: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      pincode: {
        type: String,
        default: "",
      },
      upiId: {
  type: String,
  default: "",
},

accountHolderName: {
  type: String,
  default: "",
},

bankName: {
  type: String,
  default: "",
},

accountNumber: {
  type: String,
  default: "",
},

ifscCode: {
  type: String,
  default: "",
},

      resetPasswordToken: {
        type: String,
        default: null,
      },

      resetPasswordExpires: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<IUser>(
  "User",
  userSchema
);