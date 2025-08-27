import { Router } from "express";
import { subscriberController } from "../controllers/subscriber.controller";
import { loginRequired } from "../middleware/auth.middleware";

const subscriberRouter = Router();

subscriberRouter.post("/", subscriberController.create);

subscriberRouter.get("/", [loginRequired], subscriberController.findAll);

subscriberRouter.get("/:id", [loginRequired], subscriberController.findOneById);

subscriberRouter.get(
  "/by-email/search",
  [loginRequired],
  subscriberController.findOneByEmail
);

export default subscriberRouter;
