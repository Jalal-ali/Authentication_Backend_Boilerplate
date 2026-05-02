import express from "express";
import cors from "cors"
import authRoutes from "./src/routes/auth.route.js"
import connectDB from "./src/db/index.js";

const app = express();
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  res.send("API is running...");
});


connectDB();
app.use("/api/v1", authRoutes );
app.listen(3000, ( req,res) => {
  console.log("Server running on port 3000");

});