import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.route.js"
import connectDB from "./src/db/index.js";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
dotenv.config();

const port = process.env.PORT;
const HOST = '0.0.0.0';
const app = express();
app.use(cookieParser())
app.use(express.json())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

const startServer = async () => {
  await connectDB();
  app.listen(port, HOST, (req, res) => {
    console.log(`Server running on port ${port}`);
  });

}
startServer();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running"
  });
});

app.use("/api/v1", authRoutes);