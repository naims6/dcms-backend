import { StatusCodes } from "http-status-codes";
import AppError from "../../../utils/AppError";
import { TAdmissionForm } from "./admission.interface";
import { AdmissionRepository } from "./admission.repository";
import { TPaginationQuery } from "../../../types";

const createAdmission = async (payload: TAdmissionForm) => {
  // if agree terms not true
  if (!payload.agreeTerms) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Please agree to the terms and conditions",
    );
  }
  // check user is already exist or not
  const isUserExists = await AdmissionRepository.getUserByEmailOrPhone(
    payload.email,
    payload.studentPhone,
  );

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

  // if password not matched
  if (payload.password !== payload.confirmPassword) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Password and confirm password do not match",
    );
  }

  const result = await AdmissionRepository.createAdmission(payload);
  return result;
};

const getAllAdmission = async (query: TPaginationQuery) => {
  const result = await AdmissionRepository.getAllAmission(query);
  return result;
};

const getSingleAdmission = async (id: string) => {
  const result = await AdmissionRepository.getSingleAdmission(id);
  return result;
};

export const AdmissionService = {
  createAdmission,
  getAllAdmission,
  getSingleAdmission,
};
