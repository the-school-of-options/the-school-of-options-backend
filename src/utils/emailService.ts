import { AWSUtils } from "./aws";

export class EmailService {
  static async sendOTP(
    email: string,
    otp: string,
    name: string,
    type: "email_verification" | "password_reset",
    expiryMinutes: number = 10
  ) {
    const templates = {
      email_verification: {
        subject: "Verify Your Email",
        template: "EmailVerificationOTP",
      },
      password_reset: {
        subject: "Reset Your Password",
        template: "PasswordResetOTP",
      },
    };

    const config = templates[type];

    if (!config) {
      throw new Error(`Invalid OTP type: ${type}`);
    }

    try {
      await AWSUtils.sendEmail(
        "hello@atomclass.com",
        [email],
        config.template,
        {
          name,
          otp,
          expiryMinutes: expiryMinutes.toString(),
        }
      );
      return { success: true, message: "OTP email sent successfully" };
    } catch (error: any) {
      console.error("Failed to send OTP email:", error);
      return { success: false, message: "Failed to send OTP email", error };
    }
  }
}
