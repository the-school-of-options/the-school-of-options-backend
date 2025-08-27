/* eslint-disable @typescript-eslint/ban-ts-comment */
import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";

interface DecodedTokenPayload extends JwtPayload {
  userId: string;
  email: string;
}

const secretKey = process.env.DOMAIN_SECRET_KEY;
if (!secretKey) {
  throw new Error("SECRET KEY NOT FOUND IN ENV");
}

export const createToken = (
  userId: string,
  email: string,
  expiry: string | number,
) => {
  const payload = { userId, email };
  const options = { expiresIn: expiry };

  //@ts-ignore
  return jwt.sign(payload, secretKey, options);
};

export const decodeTokenPayload = (
  token: string,
): DecodedTokenPayload | null => {
  try {
    const decodedPayload = jwt.decode(token) as DecodedTokenPayload;
    return decodedPayload;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error decoding token payload:", error.message);
    } else {
      console.error("An unknown error occurred while decoding token payload");
    }
    return null;
  }
};

export const verifyToken = (token: string): DecodedTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, secretKey) as DecodedTokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error decoding token payload:", error.message);
    } else {
      console.error("An unknown error occurred while decoding token payload");
    }
    return null;
  }
};

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    iv,
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (encryptedText: string) => {
  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex"); // Extract IV
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    iv,
  );

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
