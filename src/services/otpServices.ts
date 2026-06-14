import { redis } from "../config/redis.js";

type OTPScope = "email_verification" | "password_reset" | "two_factor";
const otpKey = (scope: OTPScope, email: string) => `otp:${scope}:${email}`;

const saveOTP = async (scope: OTPScope, email: string, hashedOTP: string) => {
  return await redis.set(otpKey(scope, email), hashedOTP, { EX: 300 });
};

const getOTP = async (scope: OTPScope, email: string) => {
  return await redis.get(otpKey(scope, email));
};

const deleteOTP = async (scope: OTPScope, email: string) => {
  return await redis.del(otpKey(scope, email));
};

export const OTPServices = {
  saveOTP,
  getOTP,
  deleteOTP,
};
