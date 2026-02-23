import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(cookieParser());

app.get("/", (request, response) => {
  return response.status(200).json({
    success: true,
    message: "API is running",
    service: "Cypher Cloud Backend",
    version: "1.0.0",
    authors: ["Abhinav Sinha", "Anubhav Jha", "Shivansh Ranjan"],
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
