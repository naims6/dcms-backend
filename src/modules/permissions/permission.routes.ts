import { Router } from "express";
import { permissionController } from "./permission.controller.js";

const router: Router = Router();

// get all permissions
router.get("/get-all", permissionController.getAllPermissions);

export const PermissionRoutes = router;
