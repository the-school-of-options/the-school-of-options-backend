import { Request, Response } from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import { zoomApi } from "../utils/zooomAuuth";

dotenv.config();

async function getWebinarList(req: Request, res: Response) {
  try {
    const hostEmail = "Kundan1kishore@gmail.com";

    const data = await zoomApi<{ webinars: any[] }>({
      method: "GET",
      url: `/users/${encodeURIComponent(hostEmail)}/webinars`,
      params: { page_size: 50, type: "upcoming" },
    });

    res.json(data.webinars || []);
  } catch (e: any) {
    res.status(500).json({ error: e.response?.data || e.message });
  }
}

async function getSingleWebinarInfo(req: Request, res: Response) {
  try {
    const data = await zoomApi({
      method: "GET",
      url: `/webinars/${encodeURIComponent(req.params.id)}`,
    });
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.response?.data || e.message });
  }
}

function base64url(input: Buffer | string) {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export async function creatingJoingSignature(req: Request, res: Response) {
  try {
    const rawMeetingNumber = (req.body?.meetingNumber ?? "").toString();
    const roleNum = Number(req.body?.role ?? 0); // 0 attendee, 1 host

    // 🔐 Read from env (rotate any secrets you’ve pasted publicly)
    const sdkKey = "VAe1HjQBRkqstu2HzLA1Dg";
    const sdkSecret = "nAb4XQg4K7XBhOXo4wLG98t21ePvj6TE";

    if (!sdkKey) {
      return res.status(500).json({ error: "ZOOM_SDK_KEY not set" });
    }
    if (!sdkSecret) {
      return res.status(500).json({ error: "ZOOM_SDK_SECRET not set" });
    }
    if (!rawMeetingNumber) {
      return res.status(400).json({ error: "Meeting number is required" });
    }

    // Digits only (Zoom rejects with hyphens/spaces)
    const meetingNumber = rawMeetingNumber.replace(/\D/g, "");
    if (!meetingNumber) {
      return res
        .status(400)
        .json({ error: "Meeting number must contain digits" });
    }

    // ⏱️ times in **seconds**
    const iat = Math.floor(Date.now() / 1000) - 30; // backdate 30s for skew
    const ttlSeconds = 60 * 60 * 2; // 2 hours
    const exp = iat + ttlSeconds;
    const tokenExp = exp;

    // JWT header & payload (Zoom v2 format)
    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
      sdkKey,
      mn: meetingNumber,
      role: roleNum, // ✅ use caller’s role
      iat,
      exp,
      appKey: sdkKey,
      tokenExp,
    };

    const encHeader = base64url(JSON.stringify(header));
    const encPayload = base64url(JSON.stringify(payload));
    const data = `${encHeader}.${encPayload}`;

    const signature = crypto
      .createHmac("sha256", sdkSecret)
      .update(data)
      .digest();

    const encSignature = base64url(signature);
    const jwt = `${data}.${encSignature}`;

    return res.status(200).json({
      signature: jwt,
      sdkKey, // optional: return so client can assert equality
      meetingNumber,
      role: roleNum,
      exp,
    });
  } catch (error: any) {
    console.error("[SIG] Error creating signature:", error);
    return res.status(500).json({
      error: "Failed to create signature",
      details: error?.message ?? "Unknown error",
    });
  }
}

export const zoomController = {
  getWebinarList,
  getSingleWebinarInfo,
  creatingJoingSignature,
};
