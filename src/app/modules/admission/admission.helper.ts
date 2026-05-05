import { randomUUID } from "crypto";

const generateApplicationId = () => {
  return `APP-${randomUUID()}`;
};
export const AdmissionHelpers = {
  generateApplicationId,
};
