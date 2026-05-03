import { Role } from "@prisma/client";
import { TAdmissionForm } from "./admission.interface";
import { AdmissionRepository } from "./admission.repository";
import { AdmissionHelpers } from "./admission.helper";

const createAdmission = async (payload: TAdmissionForm) => {
  const userData = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
    gender: payload.gender,
    role: Role.STUDENT,
  };

  const studentData = {
    classId: payload.classId,
    rollNumber: payload.rollNumber,
    dateOfBirth: payload.dateOfBirth,
    bloodGroup: payload.bloodGroup,
    address: payload.address,
  };

  const admissionData = {
    applicationId: AdmissionHelpers.generateApplicationId(),
  };

  const result = await AdmissionRepository.createAdmission(
    userData,
    studentData,
    admissionData,
  );
  return result;
};

export const AdmissionService = {
  createAdmission,
};
