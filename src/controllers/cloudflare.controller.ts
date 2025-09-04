import { Request, Response } from "express";
import axios from "axios";

const CF_ACCOUNT_ID = "b5363f7e371d20a49d2ca4a628f4fddf";
const CF_API_TOKEN = "Od8AXI2HG29UCAvgC6aZgk3E4Y3OWw2SGccOpwxN";
const uploadToCloudFlare = async (req: Request, res: Response) => {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
    console.error("Missing CF_ACCOUNT_ID or CF_API_TOKEN in environment.");
    process.exit(1);
  }
  try {
    const resp = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/direct_upload`,
      {
        // Optional knobs:
        requireSignedURLs: true,
        maxDurationSeconds: 1, // 0 = no explicit limit
      },
      {
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!resp.data?.success) {
      return res
        .status(500)
        .json({ error: "Cloudflare API error", details: resp.data });
    }

    // Returns: { uploadURL, uid, ... }
    res.json(resp.data.result);
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to create upload URL" });
  }
};

export default { uploadToCloudFlare };
