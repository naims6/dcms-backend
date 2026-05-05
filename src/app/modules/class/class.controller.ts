import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { ClassService } from "./class.service";
import ApiResponse from "../../../utils/ApiResponse";
import { StatusCodes } from "http-status-codes";

const createClass = catchAsync(async (req: Request, res: Response) => {
  const result = await ClassService.createClass(req.body);

  return ApiResponse.success(
    res,
    result,
    "Class created successfully",
    StatusCodes.CREATED,
  );
});

const getAllClasses = catchAsync(async (req: Request, res: Response) => {
  const result = await ClassService.getAllClasses();

  return ApiResponse.success(res, result, "Classes fetched successfully");
});

const seedClass = catchAsync(async (req: Request, res: Response) => {
  const result = await ClassService.seedClass();
  return ApiResponse.success(res, result, "Class seeded successfully");
});

export const ClassController = {
  createClass,
  getAllClasses,
  seedClass,
};
