// import { Router } from "express";
// import { StudentController } from "./student.controller";
// import validateRequest from "../../middlewares/validateRequest";
// import { updateStudentSchema } from "./student.validation";

// const router: Router = Router();

// router.post("/profile", (req, res) => {
//   console.log("Profile crate");
// });

// router.post("/address", (req, res) => {
//   console.log("Address crate");
// });

// router.post("/guardian", (req, res) => {
//   console.log("Guardian crate");
// });

// router.post("/additional", (req, res) => {
//   console.log("Additional crate");
// });

// router.get("/profile", (req, res) => {
//   console.log("Profile");
// });

// router.get("/address", (req, res) => {
//   console.log("Address");
// });

// router.get("/guardian", (req, res) => {
//   console.log("Guardian");
// });

// router.get("/additional", (req, res) => {
//   console.log("Additional");
// });

// router.patch("/profile", (req, res) => {
//   console.log("Profile update");
// });

// router.patch("/address", (req, res) => {
//   console.log("Address update");
// });

// router.patch("/guardian", (req, res) => {
//   console.log("Guardian update");
// });

// router.patch("/additional", (req, res) => {
//   console.log("Additional update");
// });



// router.patch(
//   "/update/:userId",
//   validateRequest(updateStudentSchema),
//   StudentController.updateStudent,
// );

// export const StudentRoutes = router;
