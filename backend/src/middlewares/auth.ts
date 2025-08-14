import { Request, Response, NextFunction } from 'express'; 
const jwt = require('jsonwebtoken');


function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; 
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string };
        (req as any).userId = decoded.id; 
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
module.exports={authMiddleware}