const express = require("express")
const router = express.Router()
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from 'express';
const { authMiddleware } = require('../middlewares/auth');
import { 
  createPostInput, 
  updatePostInput,
} from '@nhkkmehak/jot-common';

router.post("/",authMiddleware, async (req : Request,res: Response)=>{
const userId = (req as any).userId
const validation = createPostInput.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            error: "Invalid input",
            details: validation.error,
        });
    }
try {
    const post =  await prisma.post.create({
    data:{
 title: validation.data.title,
                content: validation.data.content,
                authorId: userId,
            }})

 return res.status(201).json({
            message: "Post created successfully",
        post })

}
catch(error)
{
     return res.status(500).json({ message: "Failed to create post" });
}
})

router.put("/",authMiddleware, async (req : Request,res: Response)=>{
const userId = (req as any).userId
const validation = updatePostInput.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            error: "Invalid input",
            details: validation.error
        });
    }
            const updateData: {
            title?: string;
            content?: string;
        } = {};

        if (validation.data.title !== undefined) {
            updateData.title = validation.data.title;
        }
        if (validation.data.content !== undefined) {
            updateData.content = validation.data.content;
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No valid fields to update" });
        }
try{ const post = await prisma.post.update({
    where: {
        id: req.body.id,
	    authorId: userId,
    },
    		data:  updateData  
})
return res.json(post);
}
catch(error)
{
    console.error("Update error:", error);
        return res.status(500).json({ error: "Failed to update post" });
}
})

router.get("/:id",authMiddleware,async (req : Request,res: Response)=>{
   try {
        const { id } = req.params;
    if (!id) {
            return res.status(400).json({ error: "Post ID is required" });
        }

        // 1. Fetch post from database
        const post = await prisma.post.findUnique({
            where: { id },
        });

        // 2. Handle case where post doesn't exist
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // 3. Return the post if found
        res.status(200).json(post);

    } catch (error) {
        // 4. Handle unexpected errors
        console.error("Error fetching post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get('/bulk',authMiddleware, async (req : Request,res: Response) => {
	const posts = await prisma.post.findMany({});
res.json(posts)
})