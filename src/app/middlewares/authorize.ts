import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";

const authorize = (roles: string[]) => {
  return (req: Request, _res: Response, Next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You don't have permission to access this resource",
      );
    }
    Next();
  };
};

export default authorize;
