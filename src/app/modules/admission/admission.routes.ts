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

// admin rotes
router.get("/", (req, res) => {
  res.json({
    message: "Admission list",
  });
});

export const admissionRoutes = router;
