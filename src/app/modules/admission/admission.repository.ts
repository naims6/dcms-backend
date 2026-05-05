import { prisma } from "../../lib/prisma";
import { AdmissionHelpers } from "./admission.helper";
import { TAdmissionForm } from "./admission.interface";
import bcrypt from "bcrypt";
import { Gender, GuardianRelation, Role } from "@prisma/client";
import AppError from "../../../utils/AppError";
import { StatusCodes } from "http-status-codes";
import { TPaginationQuery } from "../../../types";
import { calculatePagination } from "../../../utils/pagination";
import searchQuery from "../../../utils/search";

// utility helpers
const getUserByEmailOrPhone = async (email: string, phone: string) => {
  return prisma.user.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  });
};

// create admission with transaction
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

  const addressData = {
    address: payload.address,
    city: payload.city,
    postalCode: payload.postalCode,
  };

  const studentData = {
    classId: payload.classId,
    studentPhoto: payload.studentPhoto,
    previousSchool: payload.previousSchool,
    previousClass: payload.previousClass,
    previousGrade: payload.previousGrade,
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

    const createdAddress = await tx.address.create({
      data: { ...addressData, userId: createdUser.id },
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
      admission: createAdmission,
    };
  });
  return result;
};

// get all admission
const getAllAmission = async (query: TPaginationQuery) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(
    query,
    "appliedDate",
  );

  const searchClause = searchQuery(query.search || "", [
    "fullName",
    "email",
    "phone",
  ]);

  const [result, total] = await Promise.all([
    prisma.admission.findMany({
      where: {
        student: {
          user: {
            OR: searchClause,
          },
        },
      },
      select: {
        id: true,
        applicationId: true,
        student: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                fullName: true,
                gender: true,
                phone: true,
                email: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.admission.count({
      where: {
        student: {
          user: {
            OR: searchClause,
          },
        },
      },
    }),
  ]);

  const transformedResult = result.map((admission) => {
    return {
      id: admission.id,
      admissionId: admission.applicationId,
      student: {
        id: admission.student.id,
        fullName: admission.student.user.fullName,
        gender: admission.student.user.gender,
        phone: admission.student.user.phone,
        email: admission.student.user.email,
      },
      createdAt: admission.student.createdAt,
      updatedAt: admission.student.updatedAt,
    };
  });

  const totalPages = Math.ceil(total / limit);

  return {
    meta: { page, limit, total, totalPages },
    data: transformedResult,
  };
};

// const get single admission
const getSingleAdmission = async (id: string) => {
  const result = await prisma.admission.findUnique({
    where: { id },
    select: {
      applicationId: true,
      student: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              fullName: true,
              gender: true,
              phone: true,
              email: true,
              address: true,
              dateOfBirth: true,
              bloodGroup: true,
              religion: true,
            },
          },
          previousClass: true,
          previousSchool: true,
          previousGrade: true,
          class: {
            select: {
              name: true,
              numericValue: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Admission not found");
  }

  const transformedResult = {
    applicationId: result.applicationId,
    student: {
      id: result.student.id,
      fullName: result.student.user.fullName,
      gender: result.student.user.gender,
      phone: result.student.user.phone,
      email: result.student.user.email,
      address: result.student.user.address,
      dateOfBirth: result.student.user.dateOfBirth,
      bloodGroup: result.student.user.bloodGroup,
      religion: result.student.user.religion,
      previousClass: result.student.previousClass,
      previousSchool: result.student.previousSchool,
      previousGrade: result.student.previousGrade,
      class: result.student.class,
      createdAt: result.student.createdAt,
      updatedAt: result.student.updatedAt,
    },
  };

  return transformedResult;
};

export const AdmissionRepository = {
  createAdmission,
  getUserByEmailOrPhone,
  getAllAmission,
  getSingleAdmission,
};
