import { Router } from "express";
import { AdmissionController } from "./admission.controller";
import validateRequest from "../../middlewares/validateRequest";
import { admissionSchema } from "./admission.validation";
import isAuthanticated from "../../middlewares/isAuthenticated";
import authorize from "../../middlewares/authorize";

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

export const admissionRoutes = router;
