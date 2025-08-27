import { Request, Response } from "express";
import mongoose from "mongoose";

export const healthCheck = (_req: Request, res: Response) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ message: "Server connection is healthy" });
  } else {
    res.status(500).json({ message: "Server connection is unhealthy" });
  }
};