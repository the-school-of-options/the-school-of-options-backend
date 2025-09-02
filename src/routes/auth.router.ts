import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authService } from "../services/auth.service";
import { loginRequired } from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/signup", authController.signUp);
authRouter.post("/login", authController.login);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);
authRouter.get("/get-user", [loginRequired], authController.getUserById);
authRouter.post("/refresh-token", async (req, res, next) => {
  try {
    const tokens = await authService.refreshTokens(
      req.body.email,
      req.body.refreshToken
    );
    res.json({ payload: tokens });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default authRouter;
