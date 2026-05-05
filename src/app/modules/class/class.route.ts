import { Router } from "express";
import { ClassController } from "./class.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createClassValidationSchema } from "./class.validation";

const router: Router = Router();

router.post(
  "/",
  validateRequest(createClassValidationSchema),
  ClassController.createClass,
);
router.get("/", ClassController.getAllClasses);
router.post("/seed-class", ClassController.seedClass);

export const classRoutes = router;
