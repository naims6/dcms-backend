import bcrypt from "bcrypt";
import config from "../../../config/env.js";
import jwt from "jsonwebtoken";
import { IRefreshTokenPayload, TJWTPayload } from "../../../types/index.js";
import crypto from "crypto";

const checkPassword = async (password: string, hashPassword: string) => {
  return await bcrypt.compare(password, hashPassword);
};

const createAccessToken = (payload: TJWTPayload) => {
  return jwt.sign(payload, config.jwt_secret, { expiresIn: "1d" });
};

const createRefreshToken = (payload: IRefreshTokenPayload) => {
  return jwt.sign(payload, config.refresh_jwt_secret, { expiresIn: "7d" });
};

const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.jwt_secret) as TJWTPayload;
};

const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.refresh_jwt_secret) as IRefreshTokenPayload;
};

const generateSessionId = () => {
  return crypto.randomBytes(36).toString("hex");
};

const checkOTP = async (otp: string, hashOtp: string) => {
  return await bcrypt.compare(otp, hashOtp);
};

export const AuthHelper = {
  checkPassword,
  createAccessToken,
  createRefreshToken,
  generateSessionId,
  checkOTP,
  verifyAccessToken,
  verifyRefreshToken,
};
