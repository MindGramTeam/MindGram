import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { loginController, meController, registerController } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import jwt from 'jsonwebtoken';
import { Response }from 'express';

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

function signToken(payload: object){
    const secret = process.env.JWT_SECRET || 'dev-secret';
    return jwt.sign(payload, secret, { expiresIn: '1d'});
}

function setAuthCookie(res: Response, token: string) {
    res.cookie('accessToken', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, 
        maxAge: 1000 * 60 * 60 * 24, //1 일
    })
}

router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);
router.get('/me', requireAuth, meController);

router.get('/dev-login', async (_req, res) => {
    const demoUser = { id: 'demo-user-id', email: 'demo@mindgram.local', name: 'Demo User'};
    const token = signToken({ sub: demoUser.id, email: demoUser.email, name: demoUser.name });

    setAuthCookie(res, token);
    return res.redirect(302,`${FRONTEND_URL}/home`);
});

router.get('/logout', (req, res) => {
    res.clearCookie('accessToken', { 
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
    });
    return res.redirect(302, `${FRONTEND_URL}/login`);
})

export default router;
