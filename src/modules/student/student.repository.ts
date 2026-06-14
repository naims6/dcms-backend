// import { PrismaClientOrTx } from "../../../types";
// import { prisma } from "../../lib/prisma";
// import { TUpdateStudent } from "./student.validation";

// const createProfile = async (payload: TUpdateStudent) => {
//   const userId = "jdfkaj"
//   const result = prisma.student.create({
//     data: {
//       userId,
//       classId: "dkjf",
//       gender: payload.gender,
//       bloodGroup: payload.bloodGroup,
//       religion: payload.religion,
//       photo: payload.studentPhoto,
//       previousSchool: payload.previousSchool,
//       previousClass: payload.previousClass,
//       previousGrade: payload.previousGrade,
//     },
//   });
//   return result;
// };

// const updateStudent = async (
//   tx: PrismaClientOrTx,
//   id: string,
//   payload: TUpdateStudent,
// ) => {
//   const result = tx.student.update({
//     where: { id },
//     data: {
//       previousClass: payload.previousClass,
//       previousGrade: payload.previousGrade,
//       previousSchool: payload.previousSchool,
//       studentPhoto: payload.studentPhoto,
//       classId: payload.classId,
//     },
//   });
//   return result;
// };

// export const StudentRepository = {
//   updateStudent,
//   createProfile
// };
