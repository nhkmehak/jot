const express = require("express")
const router = express.Router()
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from 'express';
const { authMiddleware } = require('../middlewares/auth');

router.post("/",authMiddleware, async (req : Request,res: Response)=>{
const userId = (req as any).userId
const body = req.body;
try {const post =  await prisma.post.create({
    data:{
       title: body.title,
			content: body.content,
			authorId: userId,
}})

 return res.status(201).json({
            message: "Post created successfully"})
}
catch(error)
{
     return res.status(500).json({ message: "Failed to create post" });
}
})

router.put("/",authMiddleware, async (req : Request,res: Response)=>{
const userId = (req as any).userId
const body = req.body
try{ const post = await prisma.post.update({
    where: {
        id: body.id,
	    authorId: userId,
    },
    		data: {
			title: body.title,
			content: body.content
		}
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