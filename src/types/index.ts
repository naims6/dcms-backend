import { Prisma, PrismaClient } from "@prisma/client";
import { AuditAction } from "../constants/auditAction.js";

export interface ErrorResponse {
  success: boolean;
  message: string;
  stack?: string;
  error?: string;
}

export interface TPaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}

export type TJWTPayload = {
  id: string;
  roleId: number;
  email: string;
};

export interface IRefreshTokenPayload {
  sessionId: string;
  userId: string;
}

export interface AuditLog {
  req: Request;
  action: AuditAction;
  userId: string | null;
  description: string | null;
}

export type PrismaClientOrTx = PrismaClient | Prisma.TransactionClient;
