const generateApplicationId = () => {
  const prefix = "APP-";
  const randomSuffix = Math.floor(Math.random() * 1000000);
  return `${prefix}${randomSuffix}`;
};

export const AdmissionHelpers = {
  generateApplicationId,
};
