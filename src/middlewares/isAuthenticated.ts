import { NextFunction, Request, Response } from "express";
import { AuthHelper } from "../modules/auth/auth.helper.js";
import AppError from "../utils/AppError.js";
import { TJWTPayload } from "../types/index.js";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookieToken = req.cookies.accessToken;
    const headerToken = req.headers.authorization?.split(" ")[1];

    const token = headerToken || cookieToken;

    if (!token) {
      throw new AppError(401, "Unauthorized");
    }

    const decoded = AuthHelper.verifyAccessToken(token) as TJWTPayload;

    if (!decoded) {
      throw new AppError(401, "Unauthorized");
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      roleId: decoded.roleId,
    };

    next();
  } catch {
    throw new AppError(401, "Unauthorized");
  }
};

export default isAuthenticated;
