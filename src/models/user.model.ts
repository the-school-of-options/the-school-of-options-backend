import mongoose, { Schema, Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  cognitoId?: string;
  email: string;
  fullName: string;
  googleId?: string;
  isGoogleAcc?: boolean;
  role: "super-admin";
}

const userSchema = new Schema<IUser>(
  {
    cognitoId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    isGoogleAcc: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["super-admin"],
      // default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.index({ email: 1 });
// userSchema.index({ cognitoId: 1 });
// userSchema.index({ role: 1 });

const User = mongoose.model<IUser>("User", userSchema);

export default User;
