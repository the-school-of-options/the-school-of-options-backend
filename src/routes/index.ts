import { Router } from "express";
import authRouter from "./auth.router";
import healthRouter from "./health.route";
import subscriberRouter from "./subscriber.router";

const Routers = Router();

Routers.use("/health", healthRouter);
Routers.use("/auth", authRouter);
Routers.use("/subscriber", subscriberRouter);

export default Routers;
