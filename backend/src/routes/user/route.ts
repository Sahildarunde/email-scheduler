import express from "express";
import { SignInSchema, SignInType, SignUpSchema, SignUpType } from "../../types.js";
import User from "../../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userRouter = express.Router();

userRouter.post("/signup", async (req, res): Promise<any> => {
    const data: SignUpType = req.body;

    const parsedData = SignUpSchema.safeParse(data);
    if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid inputs", errors: parsedData.error.errors });
    }

    const { name, email, password } = parsedData.data;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({
            message: "Signup successful"
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});

userRouter.post("/signin", async (req, res): Promise<any> => {
    const data: SignInType = req.body;

    const parsedData = SignInSchema.safeParse(data);
    if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid inputs", errors: parsedData.error.errors });
    }

    const { email, password } = parsedData.data;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET!, {
            expiresIn: "1h",
        });

        return res.status(200).json({
            message: "Signin successful",
            token
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});

export default userRouter;
