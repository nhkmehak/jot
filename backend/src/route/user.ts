const express = require("express")
const router = express.Router()
import { signupInput, signinInput } from "@nhkkmehak/jot-common";
const jwt = require("jsonwebtoken")
import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
router.use(express.json())
router.post("/signup", async (req : Request,res: Response)=>{
    try {
         const parsedInput = signupInput.safeParse(req.body);
        if (!parsedInput.success) {
            return res.status(411).json({
                error: parsedInput.error
            });
        }
    const { email, password, name } = parsedInput.data; 
    
    const user = await prisma.user.create({
      data: {
        name: name as string,  
        email,
        password,
      }
    });
    try {var jwttoken= await jwt.Sign({id:user.id}, process.env.JWT_SECRET)
    res.json({ jwttoken });
} catch(error)
{
    res.json({ error: "error while signing up" });
}

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
})

router.post("/signin",async (req : Request,res: Response)=>{
try{ 
   const parsedInput = signinInput.safeParse(req.body);
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
})
if(!user)
{
    return res.status(403).json({
        error: "cant find user"
    })
}
var jwttoken = jwt.Sign({id: user.id}, process.env.JWT_SECRET)
 res.json({ jwttoken });}
 catch(error)
 {
    res.status(500).json({ error: "Internal server error" });
  }
})