import { prisma } from "../../lib/prisma.js";

const getAllPermissions = async () => {
  const permissions = await prisma.permission.findMany();
  return permissions;
};

export const permissionService = {
  getAllPermissions,
};
