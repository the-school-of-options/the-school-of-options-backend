import { Router } from "express";
import cloudflareController from "../controllers/cloudflare.controller";

const cloudFlareRouter = Router();

cloudFlareRouter.get("/signed-url", cloudflareController.uploadToCloudFlare);

export default cloudFlareRouter;
