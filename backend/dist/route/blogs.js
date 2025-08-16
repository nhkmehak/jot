"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const { authMiddleware } = require('../middlewares/auth');
const jot_common_1 = require("@nhkkmehak/jot-common");
router.post("/", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const validation = jot_common_1.createPostInput.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            error: "Invalid input",
            details: validation.error,
        });
    }
    try {
        const post = await prisma.post.create({
            data: {
                title: validation.data.title,
                content: validation.data.content,
                authorId: userId,
            }
        });
        return res.status(201).json({
            message: "Post created successfully",
            post
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to create post" });
    }
});
router.put("/", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const validation = jot_common_1.updatePostInput.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            error: "Invalid input",
            details: validation.error
        });
    }
    const updateData = {};
    if (validation.data.title !== undefined) {
        updateData.title = validation.data.title;
    }
    if (validation.data.content !== undefined) {
        updateData.content = validation.data.content;
    }
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
    }
    try {
        const post = await prisma.post.update({
            where: {
                id: req.body.id,
                authorId: userId,
            },
            data: updateData
        });
        return res.json(post);
    }
    catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ error: "Failed to update post" });
    }
});
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Post ID is required" });
        }
        const post = await prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        return res.status(200).json(post);
    }
    catch (error) {
        console.error("Error fetching post:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
router.get('/bulk', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const posts = await prisma.post.findMany({
            where: {
                authorId: userId,
            }
        });
        return res.json(posts);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch posts" });
    }
});
module.exports = router;
//# sourceMappingURL=blogs.js.map