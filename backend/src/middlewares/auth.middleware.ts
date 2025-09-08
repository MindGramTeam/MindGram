import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }
    const token = header.slice('Bearer '.length).trim();
    
    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}