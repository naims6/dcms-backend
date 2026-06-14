import { prisma } from "../lib/prisma.js";
import { AuditLog } from "../types/index.js";

export const logAction = (data: AuditLog) => {
  return prisma.auditLog.create({
    data: {
      action: data.action,
      userId: data.userId,
      description: data.description,
    },
  });
};
