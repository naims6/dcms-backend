import { prisma } from "../../lib/prisma";
import { IClass } from "./class.validation";

const createClass = async (payload: IClass) => {
  const result = await prisma.class.create({
    data: {
      name: payload.name,
      numericValue: payload.numericValue,
    },
  });

  return result;
};

const getAllClasses = async () => {
  const result = await prisma.class.findMany();

  return result;
};

const seedClass = async () => {
  const classes = [
    {
      name: "Six",
      numericValue: 6,
    },
    {
      name: "Seven",
      numericValue: 7,
    },
    {
      name: "Eight",
      numericValue: 8,
    },
    {
      name: "Nine",
      numericValue: 9,
    },
  ];

  const result = await prisma.class.createMany({
    data: classes,
    skipDuplicates: true,
  });

  return result;
};

export const ClassService = {
  createClass,
  getAllClasses,
  seedClass,
};
