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

const getAllAdmissions = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await AdmissionService.getAllAdmission(query);
  return ApiResponse.paginated(
    res,
    result.data,
    result.meta,
    "Admissions fetched successfully",
  );
});

const getSingleAdmission = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.admissionId as string;
  const result = await AdmissionService.getSingleAdmission(id);

  return ApiResponse.success(
    res,
    result,
    "Admission fetched successfully",
    StatusCodes.OK,
  );
});

export const AdmissionController = {
  createAdmission,
  getAllAdmissions,
  getSingleAdmission,
};
