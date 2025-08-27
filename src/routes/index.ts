import { Router } from "express";
import authRouter from "./auth.router";
import healthRouter from "./health.route";
import otpRouter from "./otp.routes";

const Routers = Router();

Routers.use("/health", healthRouter);
Routers.use("/auth", authRouter);
Routers.use("/otp", otpRouter);

export default Routers;
