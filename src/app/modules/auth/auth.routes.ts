import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { loginSchema, resendVerificationEmailSchema, verifyEmailSchema } from "./auth.validation";
import { AuthController } from "./auth.controller";

const router: Router = Router();

router.post("/login", validateRequest(loginSchema), AuthController.login);
router.post(
  "/verify-email",
  validateRequest(verifyEmailSchema),
  AuthController.verifyEmail,
);

router.post(
  "/resend-verification-otp",
  validateRequest(resendVerificationEmailSchema),
  AuthController.resendVerificationOtp,
);

export const AuthRoutes = router;
