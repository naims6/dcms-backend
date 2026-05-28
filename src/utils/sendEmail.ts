import nodemailer from "nodemailer";
import config from "../config/env.js";
import AppError from "./AppError.js";
import { StatusCodes } from "http-status-codes";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.smtp_user,
    pass: config.smtp_pass,
  },
});

export const sendEmail = async (data: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const result = await transporter.sendMail(data);
    console.log("Email sent successfully");
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};
