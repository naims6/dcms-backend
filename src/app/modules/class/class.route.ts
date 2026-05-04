import { Router } from "express";
import { ClassController } from "./class.controller";

export const classRoutes: Router = Router();

classRoutes.post("/", ClassController.createClass);
classRoutes.get("/", ClassController.getAllClasses);
classRoutes.post("/seed-class", ClassController.seedClass);
