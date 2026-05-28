import { Router } from "express";
import { ClassController } from "./class.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { createClassValidationSchema } from "./class.validation.js";

const router: Router = Router();

router.post(
  "/",
  validateRequest(createClassValidationSchema),
  ClassController.createClass,
);
router.get("/", ClassController.getAllClasses);
router.post("/seed-class", ClassController.seedClass);

export const classRoutes = router;
