import { Prisma, PrismaClient } from "@prisma/client";

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

export type PrismaClientOrTx = PrismaClient | Prisma.TransactionClient;