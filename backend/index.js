import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/connectDB.js";
import userRouter from "./routes/user.route.js";
import fileRouter from "./routes/file.route.js";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use("/api/user", userRouter);
app.use("/api/file", fileRouter);

app.get("/", (request, response) => {
  return response.status(200).json({
    success: true,
    error: false,
    message: "API is running",
    service: "Cypher Cloud Backend",
    version: "1.0.0",
    authors: ["Abhinav Sinha", "Anubhav Jha", "Shivansh Ranjan"],
    timestamp: new Date().toISOString(),
  });
});

await connectDB();

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
