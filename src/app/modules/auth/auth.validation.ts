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

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(1, "New password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from old password",
    path: ["newPassword"],
  });

export type TLogin = z.infer<typeof loginSchema>;
export type TVerifyEmail = z.infer<typeof verifyEmailSchema>;
export type TResendVerificationEmail = z.infer<
  typeof resendVerificationEmailSchema
>;
export type TChangePassword = z.infer<typeof changePasswordSchema>;
