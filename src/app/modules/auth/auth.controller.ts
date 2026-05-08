import ApiResponse from "../../../utils/ApiResponse";
import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { AuthService } from "./auth.service";
import config from "../../../config/env";

const login = catchAsync(async (req: Request, res: Response) => {
  const isProduction = config.node_env === "production";
  const { accessToken, refreshToken } = await AuthService.login(req.body);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 1000 * 60 * 60,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  ApiResponse.success(
    res,
    { accessToken, refreshToken },
    "User login successfully",
  );
});

export const AuthController = {
  login,
};
