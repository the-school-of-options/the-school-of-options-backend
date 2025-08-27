import { Router } from "express";
import authRouter from "./auth.router";
import healthRouter from "./health.route";

const Routers = Router();

Routers.use("/health", healthRouter);
Routers.use("/auth", authRouter);

export default Routers;
