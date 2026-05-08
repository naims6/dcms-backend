import { randomUUID } from "crypto";
const generateApplicationId = () => {
  const timestamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomPart = randomUUID().slice(0, 8).toUpperCase();
  return `APP-${timestamp}-${randomPart}`;
};

export const AdmissionHelpers = {
  generateApplicationId,
};
