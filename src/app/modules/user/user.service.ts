import { PrismaClientOrTx } from "../../../types";
import { TUpdateStudent } from "../student/student.validation";

const updateUser = async (
  tx: PrismaClientOrTx,
  id: string,
  payload: TUpdateStudent,
) => {
  const result = tx.user.update({
    where: { id },
    data: {
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.studentPhone,
      gender: payload.gender,
      bloodGroup: payload.bloodGroup,
      religion: payload.religion,
      dateOfBirth: payload.dateOfBirth,
      address: {
        upsert: {
          update: {
            address: payload.address,
            city: payload.city,
            postalCode: payload.postalCode,
          },
          create: {
            address: payload.address!,
            city: payload.city!,
            postalCode: payload.postalCode!,
          },
        },
      },
    },
  });
  return result;
};

export const UserService = {
  updateUser,
};
