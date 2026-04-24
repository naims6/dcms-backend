import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routers/routes";
import notFound from "./app/middlewares/notFound";
import globalError from "./app/middlewares/globalError";

const app: Application = express();

app.use(cors());
app.use(express.json());

// base route
app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "Server is Healthy",
    uptime: process.uptime(),
    time: new Date().toISOString,
  });
});

app.use(notFound);
app.use(globalError);

export default app;
