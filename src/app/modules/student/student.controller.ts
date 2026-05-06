// import { Request, Response } from "express";
// import catchAsync from "../../../utils/catchAsync";
// import ApiResponse from "../../../utils/ApiResponse";
// import { StudentService } from "./student.service";

// const createProfile = catchAsync(async (req: Request, res: Response) => {
//   const result = await StudentService.createProfile(req.body);
//   return ApiResponse.success(res, result, "Profile created successfully");
// });

// const createAddress = catchAsync(async (req: Request, res: Response) => {
//   const result = await StudentService.createAddress(req.body);
//   return ApiResponse.success(res, result, "Student created successfully");
// });

// const createGuardian = catchAsync(async (req: Request, res: Response) => {
//   const result = await StudentService.createGuardian(req.body);
//   return ApiResponse.success(res, result, "Student created successfully");
// });

// const createAdditional = catchAsync(async (req: Request, res: Response) => {
//   const result = await StudentService.createAdditional(req.body);
//   return ApiResponse.success(res, result, "Student created successfully");
// });

// const updateStudent = catchAsync(async (req: Request, res: Response) => {
//   const userId = req.params.userId as string;
//   const payload = req.body;
//   const result = await StudentService.updateStudent(userId, payload);
//   return ApiResponse.success(res, result, "Student updated successfully");
// });

// export const StudentController = {
//   updateStudent,
// };
