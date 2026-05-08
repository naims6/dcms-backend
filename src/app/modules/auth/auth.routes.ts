import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { loginSchema, verifyEmailSchema } from "./auth.validation";
import { AuthController } from "./auth.controller";

const router: Router = Router();

router.post("/login", validateRequest(loginSchema), AuthController.login);
router.post(
  "/verify-email",
  validateRequest(verifyEmailSchema),
  AuthController.verifyEmail,
);

export const AuthRoutes = router;
