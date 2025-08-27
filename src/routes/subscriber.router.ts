import { Router } from "express";
import { subscriberController } from "../controllers/subscriber.controller";

const router = Router();

router.post("/", subscriberController.create);

router.get("/", subscriberController.findAll);

router.get("/:id", subscriberController.findOneById);

router.get("/by-email/search", subscriberController.findOneByEmail);

export default router;
