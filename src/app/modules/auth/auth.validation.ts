import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.string().optional(),
    phone: z.string().optional(),
    password: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.email || data.phone, {
    message: "Email or phone is required",
    path: ["email", "phone"],
  });

export const verifyEmailSchema = z.object({
  email: z.email("Invalid email"),
  otp: z.string().min(1, "OTP is required"),
});

export const resendVerificationEmailSchema = z.object({
  email: z.email("Invalid email"),
});

export type TLogin = z.infer<typeof loginSchema>;
export type TVerifyEmail = z.infer<typeof verifyEmailSchema>;
export type TResendVerificationEmail = z.infer<
  typeof resendVerificationEmailSchema
>;
