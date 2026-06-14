import { Request } from "express";
import AppError from "./AppError.js";
import { StatusCodes } from "http-status-codes";

export const getUser = (req: Request) => {
  if (!req.user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User not found in request");
  }
  return req.user;
};

export const getUserId = (req: Request) => {
  if (!req.user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User not found in request");
  }
  return req.user.id;
};
