const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
const jwt_secret="123456"
const prisma = new PrismaClient();
router.use(express.json())

router.post("/signup",async (req : Request,res: Response)=>{
    try {
    const { email, password, name } = req.body; // Add name to destructuring
    
    const user = await prisma.user.create({
      data: {
        name,    // Add required name field
        email,
        password,
      }
    });
    try {var jwttoken= await jwt.Sign({id:user.id}, jwt_secret)
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
try{ const body = req.body;
const user = await prisma.user.findUnique({
    where: {
        email: body.email
    }
})
if(!user)
{
    return res.status(403).json({
        error: "cant find user"
    })
}
var jwttoken = jwt.Sign({id: user.id}, jwt_secret )
 res.json({ jwttoken });}
 catch(error)
 {
    res.status(500).json({ error: "Internal server error" });
  }
})