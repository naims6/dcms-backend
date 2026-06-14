import { Server } from "http";
import app from "./app.js";
import config from "./config/env.js";
import connectRedis from "./config/redis.js";
import "./job/workers/index.js";
import { prisma } from "./lib/prisma.js";

const bootstrap = async () => {
  let server: Server;

  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    await connectRedis();
    // start server
    server = app.listen(config.port, () => {
      console.log(`Server is running on http://localhost:${config.port}`);
    });

    // handle server graceful shutdown
    const exitHandler = () => {
      if (server) {
        server.close(() => {
          console.log("Server closed gracefully");
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };

    // handle process termination
    process.on("SIGTERM", exitHandler);
    process.on("SIGINT", exitHandler);

    // handle unhandledRejection
    process.on("unhandledRejection", (error) => {
      console.log(
        "Unhandled Rejection is detected. We are closing our server.",
      );

      if (server) {
        server.close(() => {
          console.log(error);
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });

    // handle process error
    process.on("uncaughtException", () => {
      console.log("Uncaught Exception! Shutting down...");

      if (server) {
        server.close(() => {
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });
  } catch (error) {
    console.log("Server Error", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

bootstrap();
