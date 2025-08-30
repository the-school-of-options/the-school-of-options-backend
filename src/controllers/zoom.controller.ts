import axios from "axios";
import { Request, Response } from "express";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const clientId = process.env.ZOOM_CLIENT_ID!;
const accountId = process.env.ZOOM_ACCOUNT_ID!;
const clientSecret = process.env.ZOOM_CLIENT_SECRET!;
const AUTH_URL = "https://zoom.us/oauth/token";
const API = "https://api.zoom.us/v2";

async function getAccessToken(): Promise<string> {
  const base64 = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const url = `${AUTH_URL}?grant_type=account_credentials&account_id=${accountId}`;
  const { data } = await axios.post(url, null, {
    headers: { Authorization: `Basic ${base64}` },
  });
  return data.access_token as string;
}

function bearerHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function createMeeting(req: Request, res: Response) {
  try {
    const token = await getAccessToken();

    const payload = req.body?.zoomData ?? {
      topic: "Demo Application",
      type: 2,
      start_time: "2025-09-22T10:00:00+05:30",
      password: "12334",
      duration: 60,
      timezone: "Asia/Kolkata",
      settings: {
        join_before_host: true,
        waiting_room: false,
      },
    };

    const { status, data } = await axios.post(
      `${API}/users/me/meetings`,
      payload,
      { headers: bearerHeaders(token) }
    );

    if (status !== 201) {
      return res.status(400).send({ message: "Meeting creation failed" });
    }

    return res.status(201).send({
      message: "meeting created",
      data: {
        meeting_id: data.id,
        meeting_url: data.join_url,
        host_start_url: data.start_url,
        meetingTime: data.start_time,
        purpose: data.topic,
        duration: data.duration,
        password: data.password,
        status: 1,
      },
    });
  } catch (err: any) {
    const detail = err?.response?.data ?? err?.message ?? "Unknown error";
    const code = err?.response?.status ?? 500;
    return res
      .status(code)
      .json({ message: "Failed to create meeting", detail });
  }
}

async function createWebinarSignature(req: Request, res: Response) {
  try {
    const { meetingNumber, role } = req.body;
    const sdkKey = process.env.ZOOM_SDK_KEY;
    const sdkSecret = process.env.ZOOM_SDK_SECRET;

    const header = { alg: "HS256", typ: "JWT" };
    const iat = Math.round(Date.now() / 1000) - 30;
    const exp = iat + 60 * 2;
    const payload = {
      sdkKey,
      mn: meetingNumber,
      role,
      iat,
      exp,
      appKey: sdkKey,
      tokenExp: exp,
    };

    const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
    const data = `${b64(header)}.${b64(payload)}`;
    const signature = `${data}.${crypto
      .createHmac("sha256", sdkSecret)
      .update(data)
      .digest("base64url")}`;

    res.json({ signature });
  } catch (err: any) {
    const detail = err?.response?.data ?? err?.message ?? "Unknown error";
    const code = err?.response?.status ?? 500;
    return res
      .status(code)
      .json({ message: "Failed to create webinar", detail });
  }
}

async function addWebinarPanelists(req: Request, res: Response) {
  try {
    const { webinarId } = req.params;
    const { panelists } = req.body as {
      panelists: Array<{ name: string; email: string }>;
    };
    if (!webinarId || !Array.isArray(panelists) || panelists.length === 0) {
      return res
        .status(400)
        .json({ message: "Provide webinarId and panelists[]" });
    }

    const token = await getAccessToken();
    const { status, data } = await axios.post(
      `${API}/webinars/${encodeURIComponent(webinarId)}/panelists`,
      { panelists },
      { headers: bearerHeaders(token) }
    );

    if (status !== 201) {
      return res.status(400).send({ message: "Adding panelists failed" });
    }

    return res.status(201).json({ message: "panelists added", data });
  } catch (err: any) {
    const detail = err?.response?.data ?? err?.message ?? "Unknown error";
    const code = err?.response?.status ?? 500;
    return res
      .status(code)
      .json({ message: "Failed to add panelists", detail });
  }
}

export const zoomController = {
  createMeeting,
  createWebinarSignature,
  addWebinarPanelists,
};
