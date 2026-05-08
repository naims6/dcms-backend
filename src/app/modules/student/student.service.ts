// import { prisma } from "../../lib/prisma";
// import { GuardianService } from "../guardian/guardian.service";
// import { UserService } from "../user/user.service";
// import { StudentRepository } from "./student.repository";
// import { TUpdateStudent } from "./student.validation";

// const createProfile = async (payload: TUpdateStudent) => {
//   const user = prisma.$transaction(async (tx) => {
//     const createdStudent = await StudentRepository.createProfile(payload);
//     return {  createdStudent };
//   });

//   return user;
// };

// const createAddress = async (payload: TUpdateStudent) => {
//   const result = await StudentRepository.createAddress(payload);
//   return result;
// };

// const createGuardian = async (payload: TUpdateStudent) => {
//   const user = prisma.$transaction(async (tx) => {
//     // create user
//     const createdUser = await UserService.createUser(tx, payload);
//     // create main student table data
//     const createdStudent = await StudentRepository.createStudent(
//       tx,
//       createdUser.id,
//       payload,
//     );
//     // create student guardian
//     const createdGuardian = await GuardianService.createGuardian(
//       tx,
//       createdStudent.id,
//       payload,
//     );

//     return { createdUser, createdStudent, createdGuardian };
//   });

//   return user;
// };

// const createAdditional = async (payload: TUpdateStudent) => {
//   const user = prisma.$transaction(async (tx) => {
//     // create user
//     const createdUser = await UserService.createUser(tx, payload);
//     // create main student table data
//     const createdStudent = await StudentRepository.createStudent(
//       tx,
//       createdUser.id,
//       payload,
//     );
//     // create student guardian
//     const createdGuardian = await GuardianService.createGuardian(
//       tx,
//       createdStudent.id,
//       payload,
//     );

//     return { createdUser, createdStudent, createdGuardian };
//   });

//   return user;
// };

// const updateStudent = async (
//   userId: string,
//   payload: TUpdateStudent,
// ) => {
//   const user = prisma.$transaction(async (tx) => {
//     // update user
//     const updatedUser = await UserService.updateUser(tx, userId, payload);
//     // update main student table data
//     const updateStudent = await StudentRepository.updateStudent(
//       tx,
//       userId,
//       payload,
//     );
//     // update student guardian
//     const updateGuardian = await GuardianService.updateGuardian(
//       tx,
//       updateStudent.id,
//       payload,
//     );

//     return { updatedUser, updateStudent, updateGuardian };
//   });

//   return user;
// };

// export const StudentService = {
//   createProfile,
//   createAddress,
//   createGuardian,
//   createAdditional,
//   updateStudent,
// };
