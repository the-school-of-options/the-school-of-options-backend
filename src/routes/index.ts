import { Router } from "express";
import authRouter from "./auth.router";
import healthRouter from "./health.route";
import subscriberRouter from "./subscriber.router";
// import { loginRequired } from "../middleware/auth.middleware";
import zoomRouter from "./zoom.router";
import webinarRouter from "./webinar.router";
import otpRouter from "./otp.route";
import talkToUsRouter from "./talktous";

const Routers = Router();

Routers.use("/health", healthRouter);
Routers.use("/auth", authRouter);
Routers.use("/subscriber", subscriberRouter);
Routers.use("/zoom", zoomRouter);
Routers.use("/webinar", webinarRouter);
Routers.use("/otp", otpRouter);
Routers.use("/talktous", talkToUsRouter);


export default Routers;
