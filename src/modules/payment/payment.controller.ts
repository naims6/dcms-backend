import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { PaymentService } from "./payment.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import config from "../../config/env.js";

// initiate payment
const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.initiatePayment(req.body);
  ApiResponse.success(res, result, "Payment initiated successfully");
});

//  redirect to frontend when frontend is ready
const successPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.successPayment(req.body);
  res.redirect(
    `${config.frontend_url}/payment/success?status=${result.status}&transactionId=${result.transactionId}`,
  );
});

// fail payment
const failPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.failPayment(req.body);
  if (!result) {
    return;
  }

  res.redirect(
    `${config.frontend_url}/payment/fail?status=${result.status}&transactionId=${result.transactionId}`,
  );
});

// cancel payment
const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.cancelPayment(req.body);
  if (!result) {
    return;
  }

  res.redirect(
    `${config.frontend_url}/payment/cancel?status=${result.status}&transactionId=${result.transactionId}`,
  );
});

export const PaymentController = {
  initiatePayment,
  successPayment,
  failPayment,
  cancelPayment,
};
