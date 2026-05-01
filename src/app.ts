import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes/routes";
import notFound from "./app/middlewares/notFound";
import globalError from "./app/middlewares/globalError";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import YAML from "yaml";

const app: Application = express();

const file = fs.readFileSync("./openapi.yaml", "utf8");
const parsedYaml = YAML.parse(file);

// swagger ui
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(parsedYaml));

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
