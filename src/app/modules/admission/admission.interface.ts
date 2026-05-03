import { Gender, Role } from "@prisma/client";

export interface TAdmissionForm {
  // User fields
  name: string;
  email: string;
  phone: string;
  password: string;
  gender: Gender;

  // Student fields
  classId: string;
  rollNumber: string;
  dateOfBirth: Date | string;
  bloodGroup: string;
  address: string;
}

export interface TAdmissionTable {
  applicationId: string;
}

export interface TUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  gender: Gender;
  role: Role;
}

export interface TStudent {
  classId: string;
  rollNumber: string;
  dateOfBirth: Date | string;
  bloodGroup: string;
  address: string;
}
