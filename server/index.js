import connectDB from "./src/config/db.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.Routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import userRoutes from "./src/routes/user.Routes.js";
import cropsRoutes from "./src/routes/crops.Routes.js";
import { apiLimiter } from "./src/middleware/rateLimit.Middleware.js";
import { getAllowedOrigins } from "./src/middleware/csrf.Middleware.js";
import {
  notFoundHandler,
  errorHandler,
} from "./src/middleware/error.Middleware.js";

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || getAllowedOrigins().includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", apiLimiter);
app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/crops", cropsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  await connectDB();

  app.listen(process.env.PORT, () => {
    console.log("server is working!", process.env.PORT);
  });
}

export default app;
