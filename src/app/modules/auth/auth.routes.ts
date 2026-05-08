import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { loginSchema } from "./auth.validation";
import { AuthController } from "./auth.controller";

const router: Router = Router();

router.post("/login", validateRequest(loginSchema), AuthController.login);

export const AuthRoutes = router;
