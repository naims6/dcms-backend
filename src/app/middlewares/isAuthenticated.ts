import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/AppError";
import { TJWTPayload } from "../../types";
import { AuthHelper } from "../modules/auth/auth.helper";

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
      role: decoded.role,
    };
    console.log("what the f");
    next();
  } catch (error) {
    throw new AppError(401, "Unauthorized");
  }
};

export default isAuthenticated;
