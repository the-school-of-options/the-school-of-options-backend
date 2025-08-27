import { Request, Response } from "express";
import { IUser } from "../models/user.model";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";
import { OTPService } from "../utils/otp";
import { EmailService } from "../utils/emailservice";
import {
  createToken,
  decodeTokenPayload,
  verifyToken,
} from "../utils/bcryptUtils";

const signUp = async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({
        error: "Email, password, and full name are required",
      });
    }

    const cognitoUserId = await authService.createUserInCognito(
      email,
      password
    );

    const userData: Partial<IUser> = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      cognitoId: cognitoUserId,
      role: "user",
      isInstructor: false,
      isVerified: false,
      isActive: true,
      loginCount: 0,
      enrolledCourses: [],
      wishlist: [],
      cart: [],
      purchasedCourses: [],
      reviewsGiven: [],
      certificates: [],
      profileVisibility: "public",
      showCourses: true,
      showCertificates: true,
    };

    const user = await userService.createUserData(userData);

    const otpData = OTPService.createOTPData("email_verification");
    user.otp = otpData;
    await user.save();

    // const emailSent = await EmailService.sendOTP(
    //   user.email,
    //   otpData.code,
    //   user.fullName,
    //   "email_verification"
    // );

    // if (!emailSent) {
    //   return res.status(500).json({
    //     error: "Failed to send verification email. Please try again.",
    //   });
    // }

    const responseUser = {
      _id: user._id,
      email: user.email,
      otpData: otpData,
      fullName: user.fullName,
      role: user.role,
      isVerified: user.isVerified,
      needsVerification: true,
    };

    res.status(200).json({
      message:
        "OTP sent to your email. Please verify to complete registration.",
      user: responseUser,
      otpSent: true,
    });
  } catch (err: unknown) {
    console.error("Signup error:", err);
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userInfo = await userService.getUserByEmail(email);
    if (userInfo.isVerified === false) {
      res.status(403).json({ error: "Please verify your email." });
      return;
    }
    const tokens = await authService.loginUser(email, password);
    userInfo.lastLogin = new Date();
    await userInfo.save();
    const decodedToken = decodeTokenPayload(tokens.AccessToken);
    res.json({
      tokens,
      user: userInfo,
      username: decodedToken?.username,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "An unexpected error occurred" });
    }
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await userService.getUserByEmail(email);

    console.log(user);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.cognitoId) {
      res
        .status(400)
        .json({ message: "Password reset not applicable for this account." });
      return;
    }

    const resetToken = createToken(user.cognitoId, user.email, "1h");

    const resetLink = `${process.env.PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

    const emailSent = await EmailService.sendOTP(
      user.email,
      resetLink,
      user.fullName,
      "password_reset"
    );

    if (!emailSent) {
      return res.status(500).json({
        error: "Failed to send verification email. Please try again.",
      });
    }

    // res
    //   .status(200)
    //   .json({ message: "Password reset process initiated successfully." });

    res.status(200).json({ resetLink: resetLink });
  } catch (error) {
    console.error("Error during forgot password request:", error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  try {
    if (verifyToken(token)) {
      const decodedToken = decodeTokenPayload(token);
      const userId = decodedToken!.userId;

      await authService.resetPassword(userId, password);
      res.json({ message: "Password reset successful" });
    } else {
      res.status(500).json({ message: "Error verifying token" });
      throw new Error("Error verifying token");
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const authController = {
  signUp,
  login,
  forgotPassword,
  resetPassword,
};
