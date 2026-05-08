import { StatusCodes } from "http-status-codes";
import AppError from "../../../utils/AppError";
import { prisma } from "../../lib/prisma";
import { TChangePassword, TLogin, TVerifyEmail } from "./auth.validation";
import { TJWTPayload } from "../../../types";
import { AuthHelper } from "./auth.helper";
import { OtpType } from "@prisma/client";
import { generateVerifyOTP } from "../../../utils/otp";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "../../../utils/sendVerificationEmail";

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

  if (!user.isActive) {
    throw new AppError(StatusCodes.FORBIDDEN, "Account not active");
  }

  if (!user.isVerified) {
    throw new AppError(StatusCodes.FORBIDDEN, "Account not verified");
  }

  // Add to auth.service.ts login function
  const admission = await prisma.admission.findFirst({
    where: { student: { userId: user.id } },
  });

  if (!admission || admission.status !== "APPROVED") {
    throw new AppError(StatusCodes.FORBIDDEN, "Admission not approved");
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
  const sessionId = AuthHelper.generateSessionId();
  const refreshToken = AuthHelper.createRefreshToken({
    userId: user.id,
    sessionId: sessionId,
  });

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

  const isMatched = await AuthHelper.checkOTP(payload.otp, otp.hashOtp);

  if (!isMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid otp");
  }

  if (otp.expiresIn < new Date()) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "OTP expired");
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

const resendVerificationOtp = async (email: string) => {
  const otp = generateVerifyOTP();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  });

  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const hashOtp = await bcrypt.hash(otp, 10);

  const result = await prisma.otp.upsert({
    where: {
      userId_type: {
        userId: user.id,
        type: OtpType.VERIFY_EMAIL,
      },
    },
    update: {
      hashOtp: hashOtp,
      expiresIn: new Date(Date.now() + 5 * 60 * 1000),
    },
    create: {
      userId: user.id,
      type: OtpType.VERIFY_EMAIL,
      hashOtp: hashOtp,
      expiresIn: new Date(Date.now() + 5 * 60 * 1000),
    },
    select: {
      expiresIn: true,
    },
  });

  await sendVerificationEmail(user.fullName, user.email, otp);

  return result;
};

const refreshToken = async (refreshToken: string) => {
  const payload = AuthHelper.verifyRefreshToken(refreshToken);

  if (!payload) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Refresh token is invalid");
  }

  const session = await prisma.session.findUnique({
    where: {
      sessionId: payload.sessionId,
    },
    select: {
      id: true,
      sessionId: true,
      expiresIn: true,
      refreshToken: true,
      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!session) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Refresh token is invalid");
  }

  if (session.expiresIn < new Date()) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Refresh token is expired");
  }

  const user = session.user;

  const JWTPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = AuthHelper.createAccessToken(JWTPayload);
  const newRefreshToken = AuthHelper.createRefreshToken({
    userId: user.id,
    sessionId: session.sessionId,
  });

  // update session with new refresh token
  await prisma.session.update({
    where: {
      sessionId: session.sessionId,
    },
    data: {
      refreshToken: newRefreshToken,
      expiresIn: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
    },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const changePassword = async (payload: TChangePassword, userId: string) => {
  const { oldPassword, newPassword, confirmPassword } = payload;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const isMatched = await AuthHelper.checkPassword(oldPassword, user.password);

  if (!isMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Old password is incorrect");
  }

  if (newPassword !== confirmPassword) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "New password and confirm password do not match",
    );
  }

  if (oldPassword === newPassword) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "New password and old password are same",
    );
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashPassword,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  return result;
};

const logout = async (refreshToken: string) => {
  const payload = AuthHelper.verifyRefreshToken(refreshToken);

  if (!payload) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const session = await prisma.session.findUnique({
    where: {
      sessionId: payload.sessionId,
    },
  });

  if (!session) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const result = await prisma.session.delete({
    where: {
      sessionId: payload.sessionId,
    },
  });

  return result;
};

export const AuthService = {
  login,
  verifyEmail,
  refreshToken,
  changePassword,
  resendVerificationOtp,
  logout,
};
