import { prisma } from "../../../lib/prisma";
import { IClass } from "./class.validation";

const createClass = async (payload: IClass) => {
  const result = await prisma.class.create({
    data: {
        name: payload.name,
        numericValue: payload.numericValue
    },
  });

  return result;
};

export const ClassService = {
  createClass,
};