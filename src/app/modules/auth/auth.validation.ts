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

export type TLogin = z.infer<typeof loginSchema>;
