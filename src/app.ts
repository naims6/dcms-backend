import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./routes/routes.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import YAML from "yaml";
import cookieParser from "cookie-parser";
import notFound from "./middlewares/notFound.js";
import globalError from "./middlewares/globalError.js";

const app: Application = express();

const file = fs.readFileSync("./swagger.yml", "utf8");
const parsedYaml = YAML.parse(file);

// swagger ui
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(parsedYaml));

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// base route
app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "Server is Healthyyy",
    uptime: `${process.uptime()} seconds`,
    time: new Date().toISOString(),
  });
});

app.use(notFound);
app.use(globalError);

export default app;
