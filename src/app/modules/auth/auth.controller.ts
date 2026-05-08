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

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.verifyEmail(req.body);
  ApiResponse.success(res, result, "User verified successfully");
});

const resendVerificationOtp = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.resendVerificationOtp(req.body.email);
    ApiResponse.success(res, result, "OTP sent successfully");
  },
);

const logout = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.logout(req.cookies.refreshToken);

  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");

  ApiResponse.success(res, result, "User logged out successfully");
});

export const AuthController = {
  login,
  verifyEmail,
  resendVerificationOtp,
  logout,
};
