import { Router } from "express";
import { ClassController } from "./class.controller";

const router: Router = Router();

router.post("/", ClassController.createClass);
router.get("/", ClassController.getAllClasses);
router.post("/seed-class", ClassController.seedClass);

export const classRoutes = router;
