import { Router } from "express";
import { classRoutes } from "../modules/class/class.route";

const router: Router = Router();

const moduleRouters = [
  // {
  //   path: "/auth",
  //   route: AuthRoutes,
  // },
  {
    path: "/class",
    route: classRoutes,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));

export default router;
