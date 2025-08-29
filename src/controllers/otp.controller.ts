import { Request, Response } from "express";
import User from "../models/user.model";
import { OTPService } from "../utils/otp";
import { authService } from "../services/auth.service";
import { EmailService } from "../utils/emailService";

const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({
        error: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        error: "Email is already verified",
      });
    }

    if (user.otp) {
      user.otp.attempts += 1;
    }

    const validation = OTPService.validateOTP(user.otp, otp);

    if (!validation.valid) {
      await user.save();
      return res.status(400).json({
        error: validation.message,
        attemptsRemaining: user.otp ? 5 - user.otp.attempts : 0,
      });
    }

    user.isVerified = true;
    if (user.otp) {
      user.otp.verified = true;
    }
    await user.save();

    const tokens = await authService.loginUser(user.email, password);

    res.json({
      message: "Email verified successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isVerified: user.isVerified,
      },
      tokens,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      error: "An error occurred during verification",
    });
  }
};

const resendOTP = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        error: "Email is already verified",
      });
    }

    // Check rate limiting
    if (user.otp && !OTPService.canResendOTP(user.otp.lastSentAt)) {
      return res.status(429).json({
        error: "Please wait before requesting another OTP",
      });
    }

    // Generate new OTP
    const otpData = OTPService.createOTPData("email_verification");
    user.otp = otpData;
    await user.save();

    // Send OTP
    const emailSent = await EmailService.sendOTP(
      user.email,
      otpData.code,
      user.fullName,
      "email_verification"
    );

    if (!emailSent) {
      return res.status(500).json({
        error: "Failed to send OTP. Please try again.",
      });
    }

    res.json({
      message: "OTP resent successfully",
      otpSent: true,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      error: "An error occurred while resending OTP",
    });
  }
};

export const otpController = {
  verifyOTP,
  resendOTP,
};
