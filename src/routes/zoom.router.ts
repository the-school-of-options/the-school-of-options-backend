import { Router } from "express";
import { zoomController } from "../controllers/zoom.controller";

const zoomRouter = Router();

zoomRouter.post("/meeting", zoomController.createMeeting);
zoomRouter.post("/webinar-signature", zoomController.createWebinarSignature);
zoomRouter.post("/webinar/:webinarId/panelistsr", zoomController.addWebinarPanelists);


export default zoomRouter;
