import { Router } from "express";
import { zoomController } from "../controllers/zoom.controller";

const zoomRouter = Router();

zoomRouter.get("/webinar-list", zoomController.getWebinarList);
zoomRouter.get("/single-webinar/:id", zoomController.getSingleWebinarInfo);
zoomRouter.post("/webinar-signature", zoomController.creatingJoingSignature);


export default zoomRouter;
