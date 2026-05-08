import { StatusCodes } from "http-status-codes";
import AppError from "../../../utils/AppError";
import { prisma } from "../../lib/prisma";
import { TLogin, TVerifyEmail } from "./auth.validation";
import { TJWTPayload } from "../../../types";
import { AuthHelper } from "./auth.helper";
import { OtpType } from "@prisma/client";

const login = async (payload: TLogin) => {
  if (!payload.email && !payload.phone) {
    throw new AppError(400, "Email or phone is required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      email: true,
      role: true,
      password: true,
      isActive: true,
      isVerified: true,
    },
  });

  //   if account is not found
  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  //   if account is not active

  // if (!user.isActive) {
  //   throw new AppError(StatusCodes.FORBIDDEN, "Account not active");
  // }

  if (!user.isVerified) {
    throw new AppError(StatusCodes.FORBIDDEN, "Account not verified");
  }

  //   check password
  const isMatched = await AuthHelper.checkPassword(
    payload.password,
    user.password,
  );

  if (!isMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const JWTPayload: TJWTPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = AuthHelper.createAccessToken(JWTPayload);
  const refreshToken = AuthHelper.createRefreshToken(JWTPayload);
  const sessionId = AuthHelper.generateSessionId();

  await prisma.session.create({
    data: {
      userId: user.id,
      sessionId: sessionId,
      expiresIn: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
      refreshToken: refreshToken,
    },
  });

  return { accessToken, refreshToken };
};

const verifyEmail = async (payload: TVerifyEmail) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const otp = await prisma.otp.findUnique({
    where: {
      userId_type: {
        userId: user.id,
        type: OtpType.VERIFY_EMAIL,
      },
    },
  });

  if (!otp) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  if (otp.expiresIn < new Date()) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "OTP expired");
  }

  const isMatched = await AuthHelper.checkOTP(payload.otp, otp.hashOtp);

  if (!isMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid otp");
  }

  // update isVerified
  const result = await prisma.user.update({
    where: {
      email: payload.email,
    },
    data: {
      isVerified: true,
    },
    select: {
      id: true,
      isVerified: true,
    },
  });

  await prisma.otp.delete({
    where: {
      userId_type: {
        userId: user.id,
        type: OtpType.VERIFY_EMAIL,
      },
    },
  });

  return result;
};

export const AuthService = {
  login,
  verifyEmail,
};
