import { redis } from "../../config/redis.js";
import { RedisKeys } from "../keys/redisKeys.js";
import { RedisTTL } from "../ttl/ttl.js";

// type OTPScope = "email_verification" | "password_reset" | "two_factor";
// const otpKey = (scope: OTPScope, email: string) => `otp:${scope}:${email}`;

// const saveOTP = async (scope: OTPScope, email: string, hashedOTP: string) => {
//   return await redis.set(otpKey(scope, email), hashedOTP, { EX: 300 });
// };

// const getOTP = async (scope: OTPScope, email: string) => {
//   return await redis.get(otpKey(scope, email));
// };

// const deleteOTP = async (scope: OTPScope, email: string) => {
//   return await redis.del(otpKey(scope, email));
// };

const saveOTP = async (email: string, hashedOTP: string) => {
  return await redis.set(RedisKeys.otpEmail(email), hashedOTP, {
    EX: RedisTTL.OTP,
  });
};

const getOTP = async (email: string) => {
  return await redis.get(RedisKeys.otpEmail(email));
};

const deleteOTP = async (email: string) => {
  return await redis.del(RedisKeys.otpEmail(email));
};

export const OTPServices = {
  saveOTP,
  getOTP,
  deleteOTP,
};
