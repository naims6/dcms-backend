import { Request, Response } from "express";
import { ClassService } from "./class.service.js";

import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import ApiResponse from "../../utils/ApiResponse.js";

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
