import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import userRouter from "./routes/user/route.js";
const app = express();
// Check environment variables
const URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;
if (!URL || !JWT_SECRET) {
    throw new Error("DATABASE_URL or JWT_SECRET is not defined in the environment variables.");
}
// MongoDB connection
mongoose
    .connect(URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));
// Middlewares
app.use(express.json());
app.use(cors());
// Routes
app.use("/user", userRouter);
// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error", error: err.message });
});
// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
