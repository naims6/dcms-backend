import { Router } from "express";
import { PaymentController } from "./payment.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { InitiatePaymentSchema } from "./payment.validation.js";

const router: Router = Router();

router.post(
  "/init",
  validateRequest(InitiatePaymentSchema),
  PaymentController.initiatePayment,
);

router.post("/success", PaymentController.successPayment);

router.post("/fail", PaymentController.failPayment);

router.post("/cancel", PaymentController.cancelPayment);

// router.post("/ipn", PaymentController.ipnPayment);

// router.get("/:transactionId", PaymentController.getOnePayment);


export const paymentRoutes = router;
