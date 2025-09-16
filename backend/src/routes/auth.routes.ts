import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { loginController, meController, registerController } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import jwt from 'jsonwebtoken';
import { Response }from 'express';

const router = Router();

// front url ( local development )
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// JWT 발급 유틸 
function signToken(payload: object){
    const secret = process.env.JWT_SECRET || 'dev-secret';
    return jwt.sign(payload, secret, { expiresIn: '1d'});
}

// httpOnly 쿠기 심기 유틸
function setAuthCookie(res: Response, token: string) {
    res.cookie('accessToken', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, //로컬 개발
        maxAge: 1000 * 60 * 60 * 24, //1 일
    })
}

router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);
router.get('/me', requireAuth, meController);

router.get('/dev-login', async (_req, res) => {
    // 실제로는 DB에서 데모 계정 조회 가능 데모 페이로드 토큰 발급
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
