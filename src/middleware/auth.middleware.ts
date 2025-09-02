import { RequestHandler } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function validateGoogleAccessToken(token: string) {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return {
        sub: response.data.id,
        email: response.data.email,
        name: response.data.name,
        picture: response.data.picture,
        email_verified: response.data.verified_email,
        token_type: "google_access_token",
      };
    } else {
      throw new Error("Invalid response from Google userinfo");
    }
  } catch {
    try {
      const tokenInfoResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
      );

      if (tokenInfoResponse.status === 200) {
        const tokenInfo = tokenInfoResponse.data;
        return {
          sub: tokenInfo.user_id,
          email: tokenInfo.email,
          name: tokenInfo.email,
          email_verified: true,
          token_type: "google_access_token",
        };
      }
    } catch {
      // Fall through to error below
    }

    throw new Error("Invalid Google access token");
  }
}

function isGoogleAccessToken(token: string): boolean {
  return token.startsWith("ya29.") || token.startsWith("1//");
}

function isJWT(token: string): boolean {
  return token.split(".").length === 3;
}

export const getTokenFromHeader = async (token: string) => {
  if (isGoogleAccessToken(token)) {
    return await validateGoogleAccessToken(token);
  }

  if (!isJWT(token)) {
    throw new Error("Token is neither a Google access token nor a valid JWT");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decodedToken = jwt.decode(token, { complete: true }) as any;
  if (!decodedToken || !decodedToken.payload) {
    throw new Error("Invalid JWT structure");
  }

  let tokenData;
  const iss = decodedToken.payload.iss;

  if (iss.startsWith("https://cognito-idp.")) {
    try {
      const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
        tokenUse: "access",
        clientId: process.env.AWS_COGNITO_CLIENT_ID!,
      });
      tokenData = await verifier.verify(token);
    } catch {
      throw new Error("Invalid Cognito token");
    }
  } else if (iss === "https://accounts.google.com") {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      tokenData = ticket.getPayload();
    } catch {
      throw new Error("Invalid Google ID token");
    }
  } else {
    throw new Error(`Unknown token issuer: ${iss}`);
  }

  return tokenData;
};

export const loginRequired: RequestHandler = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization || "";
    if (!authorizationHeader) {
      return res
        .status(401)
        .json({ error: "No authorization header provided" });
    }

    const token = authorizationHeader.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ error: "No token found in authorization header" });
    }

    const tokenData = await getTokenFromHeader(token);
    req["user"] = tokenData;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Unauthorized",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
