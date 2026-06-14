import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync.js';
import { permissionService } from './permission.services.js';
import ApiResponse from '../../utils/ApiResponse.js';

const getAllPermissions = catchAsync(async (_req: Request, res: Response) => {
  const result = await permissionService.getAllPermissions();
  ApiResponse.success(res, {
    statusCode: 200,
    message: 'Permissions fetched successfully',
    data: result,
  });
});

export const permissionController = {
  getAllPermissions,
};
