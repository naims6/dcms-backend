import { GuardianRelation } from "@prisma/client";
import { PrismaClientOrTx } from "../../../types";
import { TUpdateStudent } from "../student/student.validation";

const updateGuardian = async (
  tx: PrismaClientOrTx,
  id: string,
  payload: TUpdateStudent,
) => {
  const guardians = [
    {
      relation: GuardianRelation.FATHER,
      name: payload.fatherName,
      phone: payload.fatherPhone,
      occupation: payload.fatherOccupation,
      studentId: id,
    },
    {
      relation: GuardianRelation.MOTHER,
      name: payload.motherName,
      phone: payload.motherPhone,
      occupation: payload.motherOccupation,
      studentId: id,
    },
  ];

  const result = guardians
    .filter((g) => g.name)
    .map((g) =>
      tx.guardian.upsert({
        where: {
          studentId_relation: {
            studentId: id,
            relation: g.relation,
          },
        },
        update: {
          name: g.name,
          phone: g.phone,
          occupation: g.occupation,
        },
        create: {
          name: g.name!,
          phone: g.phone!,
          occupation: g.occupation!,
          studentId: id,
          relation: g.relation,
        },
      }),
    );

  return result;
};

export const GuardianService = {
  updateGuardian,
};
