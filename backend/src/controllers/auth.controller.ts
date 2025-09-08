import { Request, Response } from 'express';
import { login, register } from '../services/auth.service';

export const registerController = async (req: Request, res: Response) => {
    try {
        const user = await register(req.body);
        
        return res.status(201).json({ user });
    } catch (e: any) {
        const msg = e?.message ?? 'Registration failed';
        const status = msg === 'Email already in use' ? 409 : 400;
        
        return res.status(status).json({ message: msg });
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        const result = await login(req.body);
        
        return res.json(result);
    } catch (e: any) {
        const msg = e?.message ?? 'Login failed';
        const status = msg.includes('Invalid') ? 401 : 400;

        return res.status(status).json({ message: msg });
    }
};

export const meController = async (req: Request, res: Response) => {
    if (!req.user){
        return res.status(401).json({ message: 'Not authenticated'})
    }

    return res.json({ user: (req.user)});
};
