import { Router } from "express";
import { AdmissionController } from "./admission.controller";
import validateRequest from "../../middlewares/validateRequest";
import { admissionSchema } from "./admission.validation";

const router: Router = Router();

router.post(
  "/create",
  validateRequest(admissionSchema),
  AdmissionController.createAdmission,
);

// admin routes
router.get("/", AdmissionController.getAllAdmissions);

router.get("/:admissionId", AdmissionController.getSingleAdmission);



export const admissionRoutes = router;
