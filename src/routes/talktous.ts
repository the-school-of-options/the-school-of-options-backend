import { Router } from "express";
import { talkToUsController } from "../controllers/talktous.controller";

const talkToUsRouter = Router();

talkToUsRouter.post("/", talkToUsController.createTalkToUsData);

export default talkToUsRouter;
