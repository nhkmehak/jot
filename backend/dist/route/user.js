"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const jot_common_1 = require("@nhkkmehak/jot-common");
const jwt = require("jsonwebtoken");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
router.use(express.json());
router.post("/signup", async (req, res) => {
    try {
        const parsedInput = jot_common_1.signupInput.safeParse(req.body);
        if (!parsedInput.success) {
            return res.status(400).json({
                error: "Invalid input"
            });
        }
        const { email, password, name } = parsedInput.data;
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(409).json({
                error: "User with this email already exists"
            });
        }
        const user = await prisma.user.create({
            data: {
                name: name || "",
                email,
                password,
            }
        });
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not configured");
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        return res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
router.post("/signin", async (req, res) => {
    try {
        const parsedInput = jot_common_1.signinInput.safeParse(req.body);
        if (!parsedInput.success) {
            return res.status(411).json({
                error: parsedInput.error
            });
        }
        const { email, password } = parsedInput.data;
        const user = await prisma.user.findUnique({
            where: {
                email: email,
                password: password
            }
        });
        if (!user) {
            return res.status(403).json({
                error: "can't find user"
            });
        }
        const jwttoken = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "");
        return res.json({ jwttoken });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
//# sourceMappingURL=user.js.map