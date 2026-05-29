import bcrypt from "bcrypt";

export const generateVerifyOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashOTP = async (otp: string) => {
  return bcrypt.hash(otp, 10);
};
