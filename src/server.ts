import { Server } from "http";
import { prisma } from "./app/lib/prisma";
import app from "./app";
import config from "./config/env";

const bootstrap = async () => {
  let server: Server;

  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    // start server
    server = app.listen(config.port, () => {
      console.log(`Server is running on http://localhost:${config.port}`);
    });

    // handle server graceful shutdown
    const exitHandler = () => {
      if (server) {
        server.close(() => {
          console.log("Server closed gracefully");
          process.exit(1);
        });
      } else {
        process.exit(1);
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
    process.on("uncaughtException", (error) => {
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
