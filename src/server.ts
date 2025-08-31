/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import dotenv from "dotenv";

dotenv.config();


async function initializeServer() {
  try {
    const app = express();

    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE"
      );
      if (req.method === "OPTIONS") return res.status(200).end();
      next();
    });

    app.use(express.json({ limit: "100mb" }));
    app.use(express.urlencoded({ limit: "100mb", extended: true }));

    const port = process.env.PORT || 9000;

    const { connectToProdDb, connectToTestDb } = await import("./config/database");
    const Routers = (await import("./routes")).default;
    app.use("/api/v1", Routers);

    const listen = () => {
      app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
      });
    };

    if (process.env.NODE_ENV === "production") {
      await connectToProdDb();
      console.log("Database connection successful connected to production");
    } else {
      await connectToTestDb();
      console.log("Database connection successful connected to development");
    }

    listen();
  } catch (error: any) {
    console.error("ERROR", "server:init:failure", { message: error?.message });
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

initializeServer();
