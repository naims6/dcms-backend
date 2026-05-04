import { Router } from "express";
import { classRoutes } from "../modules/class/class.route";
import { admissionRoutes } from "../modules/admission/admission.routes";

const router: Router = Router();

const moduleRouters = [
  // {
  //   path: "/auth",
  //   route: AuthRoutes,
  // },
  {
    path: "/admission",
    route: admissionRoutes,
  },
  {
    path: "/class",
    route: classRoutes,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));

export default router;
