import bcrypt from "bcrypt";
import config from "../../../config/env";
import jwt from "jsonwebtoken";
import { TJWTPayload } from "../../../types";
import crypto from "crypto";

const checkPassword = async (password: string, hashPassword: string) => {
  return await bcrypt.compare(password, hashPassword);
};

const createAccessToken = (payload: TJWTPayload) => {
  return jwt.sign(payload, config.jwt_secret, { expiresIn: "1d" });
};

const createRefreshToken = (payload: TJWTPayload) => {
  return jwt.sign(payload, config.jwt_secret, { expiresIn: "7d" });
};

const generateSessionId = () => {
  return crypto.randomBytes(36).toString("hex");
};

export const AuthHelper = {
  checkPassword,
  createAccessToken,
  createRefreshToken,
  generateSessionId
};
