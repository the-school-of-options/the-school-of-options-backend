import mongoose, { Schema, Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  cognitoId?: string;
  email: string;
  fullName: string;
  googleId?: string;
  isGoogleAcc?: boolean;
  role: "admin" | "user";
  isInstructor: boolean;
  otp?: {
    code: string;
    expiresAt: Date;
    attempts: number;
    lastSentAt?: Date;
    verified: boolean;
    type: "email_verification" | "password_reset";
  };
  enrolledCourses: {
    courseId: Types.ObjectId;
    enrolledAt: Date;
    progress: number;
    completedLectures: Types.ObjectId[];
    lastAccessedAt?: Date;
    completedAt?: Date;
    certificateIssued?: boolean;
  }[];
  wishlist: Types.ObjectId[];
  cart: Types.ObjectId[];
  purchasedCourses: {
    courseId: Types.ObjectId;
    purchasedAt: Date;
    price: number;
    currency: string;
    paymentMethod: string;
  }[];
  instructorProfile?: {
    approved: boolean;
    rating: number;
    totalStudents: number;
    totalReviews: number;
    totalCourses: number;
    totalRevenue: number;
    teachingExperience?: string;
    expertise: string[];
    payoutMethod?: "upi" | "bank" | "stripe";
    payoutDetails?: {
      paypalEmail?: string;
      bankAccount?: string;
    };
    monthlyEarnings: {
      month: string;
      amount: number;
      currency: string;
    }[];
  };
  reviewsGiven: {
    courseId: Types.ObjectId;
    rating: number;
    review: string;
    createdAt: Date;
  }[];

  certificates: {
    courseId: Types.ObjectId;
    issuedAt: Date;
    certificateUrl?: string;
  }[];
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  loginCount: number;
  profileVisibility: "public" | "private";
  showCourses: boolean;
  showCertificates: boolean;
}

const otpSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
    max: 5, // Maximum attempts allowed
  },
  lastSentAt: Date,
  verified: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ["email_verification", "password_reset", "login"],
    required: true,
  },
});

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
      enum: ["user", "admin"],
      default: "user",
    },
    isInstructor: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: otpSchema
    },
    enrolledCourses: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
        progress: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        completedLectures: [
          {
            type: Schema.Types.ObjectId,
            ref: "Lecture",
          },
        ],
        lastAccessedAt: Date,
        completedAt: Date,
        certificateIssued: {
          type: Boolean,
          default: false,
        },
      },
    ],

    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    purchasedCourses: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        purchasedAt: {
          type: Date,
          default: Date.now,
        },
        price: {
          type: Number,
          required: true,
        },
        currency: {
          type: String,
          default: "USD",
        },
        paymentMethod: String,
      },
    ],

    instructorProfile: {
      approved: {
        type: Boolean,
        default: false,
      },
      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalStudents: {
        type: Number,
        default: 0,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
      totalCourses: {
        type: Number,
        default: 0,
      },
      totalRevenue: {
        type: Number,
        default: 0,
      },

      teachingExperience: String,
      expertise: [String],

      payoutMethod: {
        type: String,
        enum: ["upi", "bank", "stripe"],
      },
      payoutDetails: {
        paypalEmail: String,
        bankAccount: String,
        stripeAccountId: String,
      },

      monthlyEarnings: [
        {
          month: String,
          amount: Number,
          currency: {
            type: String,
            default: "USD",
          },
        },
      ],
    },

    reviewsGiven: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        review: {
          type: String,
          maxlength: 500,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        helpful: {
          type: Number,
          default: 0,
        },
      },
    ],

    certificates: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
        },
        issuedAt: {
          type: Date,
          default: Date.now,
        },
        certificateUrl: String,
      },
    ],

    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    loginCount: {
      type: Number,
      default: 0,
    },

    showCourses: {
      type: Boolean,
      default: true,
    },
    showCertificates: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.index({ email: 1 });
userSchema.index({ cognitoId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isInstructor: 1 });
userSchema.index({ "instructorProfile.approved": 1 });
userSchema.index({ "instructorProfile.rating": -1 });
userSchema.index({ isActive: 1 });

userSchema.index({
  "enrolledCourses.courseId": 1,
  "enrolledCourses.progress": 1,
});
userSchema.index({
  "purchasedCourses.courseId": 1,
  "purchasedCourses.purchasedAt": -1,
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
