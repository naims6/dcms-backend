import z from "zod";
import { bdPhone } from "../admission/admission.validation";

export const updateStudentSchema = z.object({
  fullName: z.string().optional(),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),
  religion: z.string().optional(),
  studentPhoto: z.string().optional(),
  classId: z.string().optional(),
  previousSchool: z.string().optional(),
  previousClass: z.string().optional(),
  previousGrade: z.string().optional(),
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherPhone: bdPhone.optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherPhone: bdPhone.optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  email: z.email().optional(),
  studentPhone: bdPhone.optional(),
});

export type TUpdateStudent = z.infer<typeof updateStudentSchema>;
