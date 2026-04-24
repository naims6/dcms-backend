import { Router } from "express";

const router: Router = Router();

const moduleRouters = [
  {
    path: "/auth",
    // route: AuthRoutes,
  },
];

// moduleRouters.forEach((route) => router.use(route.path, route.route))

export default router