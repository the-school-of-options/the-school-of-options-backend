import { Router } from "express";
import * as ctrl from "../controllers/webinar.controller";

const webinarRouter = Router();

webinarRouter.get("/", ctrl.list);
webinarRouter.get("/:id", ctrl.getById);
webinarRouter.post("/", ctrl.create);
webinarRouter.patch("/:id", ctrl.update);
webinarRouter.delete("/:id", ctrl.remove);

webinarRouter.post("/:id/enroll", ctrl.enroll);
webinarRouter.post("/:id/unenroll", ctrl.unenroll);

export default webinarRouter;
