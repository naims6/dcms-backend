import { Request } from "express";
import { CreateRoleInput } from "./role.validation.js";
import { prisma } from "../../lib/prisma.js";
import { getUserId } from "../../utils/requestUser.js";
import { AuditAction } from "../../constants/auditAction.js";

// create role
const createRole = async (data: CreateRoleInput, userId: string) => {
  const { name, description, permissionIds } = data;

  if (permissionIds.length === 0) {
    throw new Error("Role must have at least one permission");
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create the role
    const role = await tx.role.create({
      data: {
        name,
        description,
      },
      select: {
        id: true,
        name: true,
      },
    });

    // 2. Create role permissions
    await tx.rolePermission.createMany({
      data: permissionIds.map((id: number) => ({
        roleId: role.id,
        permissionId: id,
      })),
    });

    // 3. Create audit log
    await tx.auditLog.create({
      data: {
        action: AuditAction.CREATE_ROLE,
        userId: userId,
        description: `Role created with id: ${role.id}, name: ${name}`,
      },
    });

    return role;
  });
  return result;
};

// get all role
const getAllRole = async () => {
  const result = await prisma.role.findMany();
  return result;
};

// TODO: optimize it
// update role
const updateRole = async (
  data: CreateRoleInput,
  roleId: string,
  userId: string,
) => {
  const { name, description, permissionIds } = data;

  const updatedRole = await prisma.$transaction(async (tx) => {
    // 1. Update the role
    const role = await tx.role.update({
      where: {
        id: Number(roleId),
      },
      data: {
        name,
        description,
      },
      select: {
        id: true,
        name: true,
      },
    });

    // 2. Update role permissions
    await tx.rolePermission.deleteMany({
      where: {
        roleId: Number(roleId),
      },
    });
    await tx.rolePermission.createMany({
      data: permissionIds.map((id: number) => ({
        roleId: Number(roleId),
        permissionId: id,
      })),
    });

    // 3. Create audit log
    // await tx.auditLog.create({
    //   data: {
    //     action: AuditAction.UPDATE_ROLE,
    //     userId: userId,
    //     description: `Role updated with id: ${roleId}, name: ${name}`,
    //   },
    // });

    return role;
  });
  return updatedRole;
};

// delete role
const deleteRole = async (id: number, req: Request) => {
  const userId = getUserId(req);

  const result = await prisma.$transaction(async (tx) => {
    // 1. Delete the role
    await tx.role.delete({
      where: {
        id,
      },
    });

    // 2. Delete role permissions
    await tx.rolePermission.deleteMany({
      where: {
        roleId: id,
      },
    });

    // 3. Create audit log
    // await tx.auditLog.create({
    //   data: {
    //     action: AuditAction.DELETE_ROLE,
    //     userId: userId,
    //     description: `Role deleted with id: ${id}`,
    //   },
    // });

    return;
  });
  return result;
};

// get role permissions by role id
const getPermissionsByRoleId = async (roleId: number) => {
  const permissions = await prisma.rolePermission.findMany({
    where: { roleId },
    select: {
      permission: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return permissions;
};

export const roleService = {
  createRole,
  getAllRole,
  deleteRole,
  updateRole,
  getPermissionsByRoleId,
};
