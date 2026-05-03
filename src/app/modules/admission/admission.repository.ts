import { prisma } from "../../../lib/prisma";
import { TAdmissionTable, TStudent, TUser } from "./admission.interface";

const createAdmission = async (
  userData: TUser,
  studentData: TStudent,
  admissionData: TAdmissionTable,
) => {
  const result = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: userData,
    });

    const createdStudent = await tx.student.create({
      data: {
        ...studentData,
        userId: createdUser.id,
      },
    });

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
