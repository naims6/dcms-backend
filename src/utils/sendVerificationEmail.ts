import { renderEmailTemplate } from "./renderEmailTemplate.js";
import { sendEmail } from "./sendEmail.js";

export const sendVerificationEmail = async (
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
