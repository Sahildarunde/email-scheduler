var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { SignInSchema, SignUpSchema } from "../../types.js";
import User from "../../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const userRouter = express.Router();
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const parsedData = SignUpSchema.safeParse(data);
    if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid inputs", errors: parsedData.error.errors });
    }
    const { name, email, password } = parsedData.data;
    try {
        const existingUser = yield User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }
        const hashedPassword = yield bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        yield newUser.save();
        return res.status(201).json({
            message: "Signup successful"
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}));
userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const parsedData = SignInSchema.safeParse(data);
    if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid inputs", errors: parsedData.error.errors });
    }
    const { email, password } = parsedData.data;
    try {
        const user = yield User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isPasswordValid = yield bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        return res.status(200).json({
            message: "Signin successful",
            token
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}));
export default userRouter;
