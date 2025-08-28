import { Router } from "express";
import { zoomController } from "../controllers/zoom.controller";

const zoomRouter = Router();

zoomRouter.post("/meeting", zoomController.createMeeting);
zoomRouter.post("/webinar", zoomController.createWebinar);
zoomRouter.post("/webinar/:webinarId/panelistsr", zoomController.addWebinarPanelists);


export default zoomRouter;
