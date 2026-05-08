import { randomUUID } from "crypto";
import { renderEmailTemplate } from "../../../utils/renderEmailTemplate";
import { sendEmail } from "../../../utils/sendEmail";

const generateApplicationId = () => {
  return `APP-${randomUUID()}`;
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
};
