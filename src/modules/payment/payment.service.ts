// import { randomUUID } from "crypto";
import { prisma } from "../../lib/prisma.js";
import config from "../../config/env.js";
import { IInitiatePayment, SSLPaymentCallback } from "./payment.validation.js";
import AppError from "../../utils/AppError.js";
import { StatusCodes } from "http-status-codes";
import { PaymentStatus } from "../../generated/prisma/enums.js";
import { sslcommerz } from "./sslcommerz.client.js";

// initiate payment
const initiatePayment = async (payload: IInitiatePayment) => {
  //   const transactionId = randomUUID();
  const transactionId = "53ac47a0-bdc8-44a2-bee5-91fc44cfd2a4";

  // TODO: change hardcoded transaction id
  const payment = await prisma.payment.create({
    data: {
      transactionId,
      amount: payload.amount,
      purpose: payload.purpose,
      studentId: null,
    },
  });

  const data = {
    total_amount: payment.amount,
    tran_id: transactionId,
    currency: "BDT",
    success_url: config.ssl_success_url,
    fail_url: config.ssl_fail_url,
    cancel_url: config.ssl_cancel_url,
    ipn_url: config.ssl_ipn_url,

    shipping_method: "NO",
    product_name: payment.purpose,
    product_category: "School",
    product_profile: "general",
    cus_name: "Student",
    cus_email: "student@gmail.com",
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: "01908390036",
  };

  const apiResponse = await sslcommerz.init(data);

  console.log("apiResponse", apiResponse);

  return {
    paymentUrl: apiResponse.GatewayPageURL,
    transactionId,
  };
};

// handle success payment
const successPayment = async (payload: SSLPaymentCallback) => {
  const transactionId = payload.tran_id;

  const payment = await prisma.payment.findUnique({
    where: {
      transactionId,
    },
  });

  if (!payment) {
    throw new AppError(StatusCodes.NOT_FOUND, "Payment not found");
  }

  //   validate payment
  const validation = await sslcommerz.validate({
    val_id: payload.val_id,
  });

  if (!validation) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid payment");
  }

  if (validation.status !== "VALID") {
    throw new AppError(StatusCodes.BAD_REQUEST, "Payment validation failed");
  }

  // update payment status
  const updatePayment = await prisma.payment.update({
    where: {
      transactionId,
    },
    data: {
      status: PaymentStatus.SUCCESS,
    },
  });

  console.log("YOUR PAYMENT IS SUCCESS");

  console.log("validation", validation);

  return {
    transactionId,
    status: payload.status,
  };
};

// handle fail payment
const failPayment = async (payload: SSLPaymentCallback) => {
  const transactionId = payload.tran_id;
  const payment = await prisma.payment.findUnique({
    where: {
      transactionId,
    },
  });

  if (!payment) {
    throw new AppError(StatusCodes.NOT_FOUND, "Payment not found");
  }

  if (payment.status === "SUCCESS") {
    return;
  }

  //   update payment status to failed
  await prisma.payment.update({
    where: {
      transactionId: payload.tran_id,
    },
    data: {
      status: PaymentStatus.FAILED,
    },
  });

  return {
    transactionId,
    status: payload.status,
  };
};

// handle cancel payment
const cancelPayment = async (payload: SSLPaymentCallback) => {
  const transactionId = payload.tran_id;
  const payment = await prisma.payment.findUnique({
    where: {
      transactionId,
    },
  });

  if (!payment) {
    throw new AppError(StatusCodes.NOT_FOUND, "Payment not found");
  }

  if (payment.status === "SUCCESS") {
    return;
  }

  //   update payment status to failed
  await prisma.payment.update({
    where: {
      transactionId,
    },
    data: {
      status: PaymentStatus.CANCELLED,
    },
  });

  return {
    transactionId,
    status: payload.status,
  };
};

export const PaymentService = {
  initiatePayment,
  successPayment,
  failPayment,
  cancelPayment,
};
