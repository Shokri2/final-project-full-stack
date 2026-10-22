import connectDB from "./src/config/db.js";
import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.Routes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import categoryRoutes from "./src/routes/category.routes.js";
import productRoutes from "./src/routes/products.routes.js";
import userRoutes from "./src/routes/user.Routes.js";

connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())


app.get("/health", (req, res) => {
  res.send("hello");
});

app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api/users", userRoutes);
app.listen(process.env.PORT, () => {
  console.log("server is working!", process.env.PORT);
});
