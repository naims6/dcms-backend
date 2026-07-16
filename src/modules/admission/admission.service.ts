import { StatusCodes } from "http-status-codes";
import { TAdmissionForm } from "./admission.interface.js";
import { TVerifyEmail } from "./admission.validation.js";
import AppError from "../../utils/AppError.js";
import { TPaginationQuery } from "../../types/index.js";
import { prisma } from "../../lib/prisma.js";
import { AdmissionHelpers } from "./admission.helper.js";
import bcrypt from "bcrypt";
import { OTPServices } from "../../redis/services/otpServices.js";
import { generateVerifyOTP, hashOTP } from "../../utils/otp.js";
import { redis } from "../../config/redis.js";
import { emailQueue } from "../../job/queues/email.queue.js";
import { calculatePagination } from "../../utils/pagination.js";
import searchQuery from "../../utils/search.js";
import { AdmissionStatus, Prisma } from "../../generated/prisma/client.js";
import { AdmissionServices } from "../../redis/services/admissionService.js";
import { RedisKeys } from "../../redis/keys/redisKeys.js";

// create admission
const createAdmission = async (payload: TAdmissionForm) => {
  if (!payload.agreeTerms) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Please agree to the terms and conditions",
    );
  }

  const isUserExists = await prisma.user.findFirst({
    where: {
      OR: [{ email: payload.email }, { phone: payload.studentPhone }],
    },
  });

  if (isUserExists) {
    if (isUserExists.email === payload.email) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "User already exists with this email",
      );
    }
    if (isUserExists.phone === payload.studentPhone) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "User already exists with this phone",
      );
    }
  }

  const applicationId = AdmissionHelpers.generateApplicationId();
  const otp = generateVerifyOTP();

  const [hashOtp, hashedPassword] = await Promise.all([
    hashOTP(otp),
    bcrypt.hash(payload.password, 10),
  ]);

  const draftData = {
    applicationId: applicationId,
    user: {
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.studentPhone,
      password: hashedPassword,
      gender: payload.gender,
      bloodGroup: payload.bloodGroup,
      religion: payload.religion,
      dateOfBirth: payload.dateOfBirth,
    },

    address: {
      address: payload.address,
      city: payload.city,
      postalCode: payload.postalCode,
    },

    student: {
      classId: payload.classId,
      studentPhoto: payload.studentPhoto,
      previousSchool: payload.previousSchool,
      previousClass: payload.previousClass,
      previousGrade: payload.previousGrade,
    },

    guardians: [
      {
        name: payload.fatherName,
        relation: "FATHER",
        phone: payload.fatherPhone,
        occupation: payload.fatherOccupation,
      },
      {
        name: payload.motherName,
        relation: "MOTHER",
        phone: payload.motherPhone,
        occupation: payload.motherOccupation,
      },
    ],

    status: "OTP_PENDING",
  };

  // Save admission draft in Redis
  await AdmissionServices.saveAdmissionDraft(
    applicationId,
    JSON.stringify(draftData),
  );

  await OTPServices.saveOTP(payload.email, hashOtp);

  await emailQueue.add(
    "send-verification-email",
    {
      name: payload.fullName,
      email: payload.email,
      otp: otp,
    },
    {
      attempts: 3,
      removeOnComplete: true,
      backoff: { type: "exponential", delay: 5000 },
      removeOnFail: { age: 60 * 60 * 24 },
    },
  );

  return {
    applicationId: applicationId,
    email: payload.email,
  };
};

// verify admission email
const verifyAdmissionEmail = async (payload: TVerifyEmail) => {
  const redisOtp = await OTPServices.getOTP(payload.email);

  if (!redisOtp) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid or expired OTP");
  }

  const isOtpMatched = await bcrypt.compare(payload.otp, redisOtp);
  if (!isOtpMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "otp is not matched");
  }

  const draftApplicatoin = await AdmissionServices.getAdmissionDraft(
    payload.applicationId,
  );

  if (!draftApplicatoin) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No application found");
  }

  const parsedApplicationData = JSON.parse(draftApplicatoin);

  if (parsedApplicationData.status !== "OTP_PENDING") {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid application state");
  }

  parsedApplicationData.status = "EMAIL_VERIFIED";

  // set new 
  await redis.set(
    RedisKeys.admissionDraft(payload.applicationId),
    JSON.stringify(parsedApplicationData),
    {
      EX: 60 * 60 * 24,
    },
  );

  await OTPServices.deleteOTP(payload.email);

  return {
    admissionId: parsedApplicationData.applicationId,
    email: parsedApplicationData.user.email,
    status: parsedApplicationData.status,
  };
};

// get all admission
const getAllAdmission = async (query: TPaginationQuery) => {
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
                isVerified: true,
                isActive: true,
                role: true,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformedResult = result.map((admission: any) => {
    return {
      admissionId: admission.applicationId,
      userId: admission.student.user.id,
      student: {
        id: admission.student.id,
        fullName: admission.student.user.fullName,
        gender: admission.student.user.gender,
        phone: admission.student.user.phone,
        email: admission.student.user.email,
        isVerified: admission.student.user.isVerified,
        isActive: admission.student.user.isActive,
        role: admission.student.user.role,
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

// get single admission
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

// active student
const activeStudent = async (id: string) => {
  const isUserExists = await prisma.user.findUnique({
    where: { id },
  });

  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const result = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const user = await tx.user.update({
        where: {
          id,
        },
        data: {
          isActive: true,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          student: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!user.student?.id) {
        throw new AppError(StatusCodes.NOT_FOUND, "Student not found");
      }

      await tx.admission.update({
        where: {
          studentId: user.student.id,
        },
        data: {
          status: AdmissionStatus.APPROVED,
        },
      });

      return user;
    },
  );

  return result;
};

// reject application
const rejectApplication = async (id: string) => {
  const result = await prisma.admission.update({
    where: {
      id,
    },
    data: {
      status: AdmissionStatus.REJECTED,
    },
  });

  return result;
};

export const AdmissionService = {
  createAdmission,
  verifyAdmissionEmail,
  getAllAdmission,
  getSingleAdmission,
  activeStudent,
  rejectApplication,
};
