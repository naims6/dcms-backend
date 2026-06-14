import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import {
  changePasswordSchema,
  loginSchema,
  resendVerificationEmailSchema,
  verifyEmailSchema,
} from "./auth.validation.js";
import { AuthController } from "./auth.controller.js";
import isAuthanticated from "../../middlewares/isAuthenticated.js";

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

router.patch(
  "/change-password",
  isAuthanticated,
  validateRequest(changePasswordSchema),
  AuthController.changePassword,
);

router.post("/refresh-token", AuthController.refreshToken);

router.post("/logout", isAuthanticated, AuthController.logout);

export const AuthRoutes = router;
