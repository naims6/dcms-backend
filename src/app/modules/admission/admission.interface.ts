import { Gender, GuardianRelation, Role } from "@prisma/client";

export interface TAdmissionForm {
  fullName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  religion: string;
  studentPhoto: string;
  classId: string;
  previousSchool: string;
  previousClass: string;
  previousGrade: string;

  fatherName: string;
  fatherOccupation: string;
  fatherPhone: string;
  motherName: string;
  motherOccupation: string;
  motherPhone: string;
  address: string;
  city: string;
  postalCode: string;
  email: string;
  studentPhone: string;

  agreeTerms: boolean;
  password: string;
  confirmPassword: string;
}

export interface IClass {
  id: string;
  name: string;
  numericValue: number;
}
