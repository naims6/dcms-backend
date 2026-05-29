import { Router } from "express";
import { AdmissionController } from "./admission.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { admissionSchema } from "./admission.validation.js";
import isAuthanticated from "../../middlewares/isAuthenticated.js";
import authorize from "../../middlewares/authorize.js";

const router: Router = Router();

router.post(
  "/create",
  validateRequest(admissionSchema),
  AdmissionController.createAdmission,
);

router.use(isAuthanticated);
// admin routes
router.get("/", authorize(["ADMIN"]), AdmissionController.getAllAdmissions);

router.get(
  "/:admissionId",
  authorize(["ADMIN"]),
  AdmissionController.getSingleAdmission,
);

router.patch(
  "/active-student/:id",
  authorize(["ADMIN"]),
  AdmissionController.activeStudent,
);

router.patch(
  "/reject-application/:id",
  authorize(["ADMIN"]),
  AdmissionController.rejectApplication,
);

export const admissionRoutes = router;
