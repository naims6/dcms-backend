import { prisma } from "../../../lib/prisma";
import { AdmissionHelpers } from "./admission.helper";
import { TAdmissionForm } from "./admission.interface";
import bcrypt from "bcrypt";
import { Gender, GuardianRelation, Role } from "@prisma/client";

const createAdmission = async (payload: TAdmissionForm) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const userData = {
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.studentPhone,
    password: hashedPassword,
    gender: Gender[payload.gender],
    bloodGroup: payload.bloodGroup,
    role: Role.STUDENT,
    religion: payload.religion,
    dateOfBirth: new Date(payload.dateOfBirth),
    isActive: false,
  };

  const studentData = {
    classId: payload.classId,
    studentPhoto: payload.studentPhoto,
    previousSchool: payload.previousSchool,
    previousClass: payload.previousClass,
    previousGrade: payload.previousGrade,
    address: payload.address,
    city: payload.city,
    postalCode: payload.postalCode,
  };

  const fatherGuardianData = {
    name: payload.fatherName,
    relation: GuardianRelation.FATHER,
    phone: payload.fatherPhone,
    occupation: payload.fatherOccupation,
  };

  const motherGuardianData = {
    name: payload.motherName,
    relation: GuardianRelation.MOTHER,
    phone: payload.motherPhone,
    occupation: payload.motherOccupation,
  };

  const admissionData = {
    applicationId: AdmissionHelpers.generateApplicationId(),
  };

  const result = await prisma.$transaction(async (tx) => {
    // create user
    const createdUser = await tx.user.create({
      data: userData,
    });

    // create student
    const createdStudent = await tx.student.create({
      data: {
        ...studentData,
        userId: createdUser.id,
      },
    });

    // Guardian creation with student ID
    await tx.guardian.createMany({
      data: [
        {
          ...fatherGuardianData,
          studentId: createdStudent.id,
        },
        {
          ...motherGuardianData,
          studentId: createdStudent.id,
        },
      ],
    });

    // create admission
    const createAdmission = await tx.admission.create({
      data: {
        ...admissionData,
        studentId: createdStudent.id,
      },
    });

    return {
      user: createdUser,
      student: createdStudent,
      admission: createAdmission,
    };
  });
  return result;
};

export const AdmissionRepository = {
  createAdmission,
};
