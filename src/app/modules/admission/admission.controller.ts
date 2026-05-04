import { Request, Response } from "express";
import ApiResponse from "../../../utils/ApiResponse";
import { AdmissionService } from "./admission.service";
import catchAsync from "../../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";

const createAdmission = catchAsync(async (req: Request, res: Response) => {
  const result = await AdmissionService.createAdmission(req.body);

  return ApiResponse.success(
    res,
    result,
    "Admission created successfully",
    StatusCodes.CREATED,
  );
});

export const AdmissionController = {
  createAdmission,
};
