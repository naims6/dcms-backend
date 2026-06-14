import { Request, Response } from "express";
import { roleService } from "./role.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import catchAsync from "../../utils/catchAsync.js";
import { StatusCodes } from "http-status-codes";
import { getUserId } from "../../utils/requestUser.js";

// create role
const createRole = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const userId = getUserId(req);

  const result = await roleService.createRole(data, userId);
  return ApiResponse.success(
    res,
    result,
    "New role created successfully",
    StatusCodes.CREATED,
  );
});

// get all role
const getAllRole = catchAsync(async (_req: Request, res: Response) => {
  const result = await roleService.getAllRole();
  return ApiResponse.success(res, result, "All roles fetched successfully");
});

// update role
const updateRole = catchAsync(async (req: Request, res: Response) => {
  const roleId = req.params.roleId as string;
  const data = req.body;
  const userId = getUserId(req);

  const result = await roleService.updateRole(data, roleId, userId);
  return ApiResponse.success(res, result, "Role updated successfully");
});

// delete role
const deleteRole = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.roleId);
  const result = await roleService.deleteRole(id, req);

  return ApiResponse.success(res, result, "Role deleted successfully");
});

// get role permissions by role id
const getPermissionsByRoleId = catchAsync(
  async (req: Request, res: Response) => {
    const { roleId } = req.params;

    const result = await roleService.getPermissionsByRoleId(Number(roleId));
    return ApiResponse.success(
      res,
      result,
      "Role permissions fetched successfully",
    );
  },
);

export const roleController = {
  createRole,
  getAllRole,
  updateRole,
  deleteRole,
  getPermissionsByRoleId,
};
