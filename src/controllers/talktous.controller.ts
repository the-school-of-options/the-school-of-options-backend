import { Request, Response } from "express";
import TalkToUs from "../models/talktous";
import { EmailService } from "../utils/emailService";

const createTalkToUsData = async (req: Request, res: Response) => {
  const { email, fullName, mobileNumber } = req.body;

  try {
    if (!email || !fullName || !mobileNumber) {
      return res.status(400).json({
        error: "Email, full name, and mobile number are required",
      });
    }

    const talkToUsData = new TalkToUs({
      email: email.toLowerCase(),
      fullName,
      mobileNumber,
    });

    await talkToUsData.save();

    await EmailService.sendTalkToCounsellorEmail(fullName, email, mobileNumber);

    res.status(200).json({});
  } catch (error) {
    console.error("CreateTalkToUsData error:", error);
    res.status(500).json({
      error: "An error occurred during creation",
    });
  }
};

export const talkToUsController = {
  createTalkToUsData,
};
