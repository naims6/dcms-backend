import { prisma } from "../../lib/prisma.js";
import { AdmissionHelpers } from "./admission.helper.js";
import { TAdmissionForm } from "./admission.interface.js";
import bcrypt from "bcrypt";
import { AdmissionStatus, Prisma } from "@prisma/client";
import AppError from "../../../utils/AppError.js";
import { StatusCodes } from "http-status-codes";
import { TPaginationQuery } from "../../../types/index.js";
import { calculatePagination } from "../../../utils/pagination.js";
import searchQuery from "../../../utils/search.js";
import { generateVerifyOTP, hashOTP } from "../../../utils/otp.js";
import { redis } from "../../../config/redis.js";
import { emailQueue } from "../../../job/queues/email.queue.js";
import { OTPServices } from "../../services/otpServices.js";
import { TVerifyEmail } from "./admission.validation.js";

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
  const applicationId = AdmissionHelpers.generateApplicationId();
  const otp = generateVerifyOTP();

  const [hashOtp, hashedPassword] = await Promise.all([
    await hashOTP(otp),
    await bcrypt.hash(payload.password, 10),
  ]);

  // const userData = {
  //   fullName: payload.fullName,
  //   email: payload.email,
  //   phone: payload.studentPhone,
  //   password: hashedPassword,
  //   gender: Gender[payload.gender],
  //   bloodGroup: payload.bloodGroup,
  //   role: Role.STUDENT,
  //   religion: payload.religion,
  //   dateOfBirth: new Date(payload.dateOfBirth),
  //   isActive: false,
  // };

  // const addressData = {
  //   address: payload.address,
  //   city: payload.city,
  //   postalCode: payload.postalCode,
  // };

  // const studentData = {
  //   classId: payload.classId,
  //   studentPhoto: payload.studentPhoto,
  //   previousSchool: payload.previousSchool,
  //   previousClass: payload.previousClass,
  //   previousGrade: payload.previousGrade,
  // };

  // const fatherGuardianData = {
  //   name: payload.fatherName,
  //   relation: GuardianRelation.FATHER,
  //   phone: payload.fatherPhone,
  //   occupation: payload.fatherOccupation,
  // };

  // const motherGuardianData = {
  //   name: payload.motherName,
  //   relation: GuardianRelation.MOTHER,
  //   phone: payload.motherPhone,
  //   occupation: payload.motherOccupation,
  // };

  // const admissionData = {
  //   applicationId: AdmissionHelpers.generateApplicationId(),
  // };

  // const otpData = {
  //   hashOtp,
  //   type: OtpType.VERIFY_EMAIL,
  //   expiresIn: new Date(Date.now() + 5 * 60 * 1000),
  // };

  // const result = await prisma.$transaction(
  //   async (tx: Prisma.TransactionClient) => {
  //     // create user
  //     const createdUser = await tx.user.create({
  //       data: userData,
  //     });

  //     await tx.address.create({
  //       data: { ...addressData, userId: createdUser.id },
  //     });

  //     // create student
  //     const createdStudent = await tx.student.create({
  //       data: {
  //         ...studentData,
  //         userId: createdUser.id,
  //       },
  //     });

  //     // Guardian creation with student ID
  //     await tx.guardian.createMany({
  //       data: [
  //         {
  //           ...fatherGuardianData,
  //           studentId: createdStudent.id,
  //         },
  //         {
  //           ...motherGuardianData,
  //           studentId: createdStudent.id,
  //         },
  //       ],
  //     });

  //     // create admission
  //     const createAdmission = await tx.admission.create({
  //       data: {
  //         ...admissionData,
  //         studentId: createdStudent.id,
  //       },
  //     });

  //     await tx.otp.create({
  //       data: { ...otpData, userId: createdUser.id },
  //     });

  //     return {
  //       admission: createAdmission,
  //     };
  //   },
  // );

  // // send verification email
  // await sendVerificationEmail(userData.fullName, userData.email, otp);

  // return result;

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

  // save draft data in redis
  await redis.set(`admission:${applicationId}`, JSON.stringify(draftData), {
    EX: 60 * 60 * 24,
  });
  // set otp in redis
  await OTPServices.saveOTP("email_verification", payload.email, hashOtp);
  // await redis.set(`otp:${payload.email}`, JSON.stringify({ otp: hashOtp }), {
  //   EX: 60 * 5,
  // });

  // verification email queue with bullmq
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
    message:
      "Admission form submitted successfully. Please verify your email to continue.",
  };
};

// verify Admission email
const verifyAdmissionEmail = async (payload: TVerifyEmail) => {
  // get redis stored otp
  const redisOtp = await OTPServices.getOTP(
    "email_verification",
    payload.email,
  );

  if (!redisOtp) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid or expired OTP");
  }

  // check otp matched
  const isOtpMatched = await bcrypt.compare(payload.otp, redisOtp);
  if (!isOtpMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "otp is not matched");
  }

  // get draft application and update status
  const draftApplicatoin = await redis.get(
    `admission:${payload.applicationId}`,
  );

  if (!draftApplicatoin) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No application found");
  }
  // parse draft data
  const parsedApplicationData = JSON.parse(draftApplicatoin);

  if (parsedApplicationData.status !== "OTP_PENDING") {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid application state");
  }

  parsedApplicationData.status = "EMAIL_VERIFIED";

  await redis.set(
    `admission:${payload.applicationId}`,
    JSON.stringify(parsedApplicationData),
    {
      EX: 60 * 60 * 24,
    },
  );

  // delete otp after verified
  await OTPServices.deleteOTP("email_verification", payload.email);

  return {
    admissionId: parsedApplicationData.applicationId,
    email: parsedApplicationData.user.email,
    status: parsedApplicationData.status,
  };
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

export const AdmissionRepository = {
  createAdmission,
  verifyAdmissionEmail,
  getUserByEmailOrPhone,
  getAllAmission,
  getSingleAdmission,
  activeStudent,
  rejectApplication,
};
