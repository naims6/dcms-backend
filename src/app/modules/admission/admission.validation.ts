import { z } from "zod";
export const bdPhone = z
  .string()
  .regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number");

export const admissionSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),

    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),

    religion: z.string().min(1),
    studentPhoto: z.url("Invalid photo URL"),
    classId: z.string().min(1),

    previousSchool: z.string(),
    previousClass: z.string(),
    previousGrade: z.string(),

    fatherName: z.string().min(1),
    fatherOccupation: z.string().min(1),
    fatherPhone: bdPhone,

    motherName: z.string().min(1),
    motherOccupation: z.string().min(1),
    motherPhone: bdPhone,

    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(4),

    email: z.email("Invalid email"),
    studentPhone: bdPhone,

    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms",
    }),

    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
