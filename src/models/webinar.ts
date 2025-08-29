import mongoose, { Schema, Types } from "mongoose";

interface IEnrolledUser {
  email: string;
}

export interface IWebinar {
  _id?: Types.ObjectId;
  webinarName: string;
  webinarLinkUserLink: string;
  webinarHostLink: string;
  webinarDate: Date;
  webinarDuration: number; 
  enrolledUser: IEnrolledUser[];
}

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

const enrolledUserSchema = new Schema<IEnrolledUser>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [emailRegex, "Please enter a valid email"],
    },
  },
  { _id: false } 
);

const webinarSchema = new Schema<IWebinar>(
  {
    webinarName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    webinarLinkUserLink: {
      type: String,
      required: true,
      trim: true,
    },
    webinarHostLink: {
      type: String,
      required: true,
      trim: true,
    },
    webinarDate: {
      type: Date,
      required: true,
    },
    webinarDuration: {
      type: Number,
      required: true,
      min: [1, "Duration must be at least 1 minute"],
    },
    enrolledUser: {
      type: [enrolledUserSchema],
      default: [],
      validate: {
        validator: function (v: IEnrolledUser[]) {
          const emails = v.map((u) => u.email.toLowerCase());
          return emails.length === new Set(emails).size;
        },
        message: "Duplicate emails found in enrolledUser",
      },
    },
  },
  { timestamps: true }
);

webinarSchema.index({ webinarDate: 1 });
webinarSchema.index({ webinarName: 1 });

const Webinar = mongoose.model<IWebinar>("Webinar", webinarSchema);
export default Webinar;
