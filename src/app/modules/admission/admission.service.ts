import { StatusCodes } from "http-status-codes";
import AppError from "../../../utils/AppError";
import { TAdmissionForm } from "./admission.interface";
import { AdmissionRepository } from "./admission.repository";

const createAdmission = async (payload: TAdmissionForm) => {
  // if agree terms not true
  if (!payload.agreeTerms) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Please agree to the terms and conditions",
    );
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

export const AdmissionService = {
  createAdmission,
};
