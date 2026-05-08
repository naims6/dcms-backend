import { randomUUID } from "crypto";
import { renderEmailTemplate } from "../../../utils/renderEmailTemplate";
import { sendEmail } from "../../../utils/sendEmail";
import bcrypt from "bcrypt";

const generateApplicationId = () => {
  return `APP-${randomUUID()}`;
};

const hashOTP = async (otp: string) => {
  return bcrypt.hash(otp, 10);
};

const generateVerifyOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationEmail = async (
  fullName: string,
  email: string,
  otp: string,
) => {
  const htmlTemplate = await renderEmailTemplate("verifyAccountOTP", {
    fullName: fullName,
    email: email,
    otp: otp,
  });

  const emailData = {
    to: email,
    subject: "Verify your account",
    html: htmlTemplate as string,
  };

  await sendEmail(emailData);
};

export const AdmissionHelpers = {
  generateApplicationId,
  sendVerificationEmail,
  generateVerifyOTP,
  hashOTP,
};
