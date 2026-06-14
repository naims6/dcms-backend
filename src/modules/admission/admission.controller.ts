import { Request, Response } from "express";
import { AdmissionService } from "./admission.service.js";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import ApiResponse from "../../utils/ApiResponse.js";

const createAdmission = catchAsync(async (req: Request, res: Response) => {
  const result = await AdmissionService.createAdmission(req.body);

  return ApiResponse.success(
    res,
    result,
    "Admission created successfully",
    StatusCodes.CREATED,
  );
});

const verifyAdmissionEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await AdmissionService.verifyAdmissionEmail(req.body);
  return ApiResponse.success(
    res,
    result,
    "Admission email verified successfully",
    StatusCodes.OK,
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

const activeStudent = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await AdmissionService.activeStudent(id);

  return ApiResponse.success(
    res,
    result,
    "Student activated successfully",
    StatusCodes.OK,
  );
});

const rejectApplication = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await AdmissionService.rejectApplication(id);

  return ApiResponse.success(
    res,
    result,
    "Application rejected successfully",
    StatusCodes.OK,
  );
});

export const AdmissionController = {
  createAdmission,
  verifyAdmissionEmail,
  getAllAdmissions,
  getSingleAdmission,
  activeStudent,
  rejectApplication,
};
