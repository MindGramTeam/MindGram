import { Router } from 'express';
import { 
    registerController,
    loginController,
    logoutController,
    meController,
} from '../controllers/authController.js';
import { requireAuth } from '../utils/authMiddleware.js';

const router = Router();

// 회원가입

router.post('/register', registerController);

// 로그인

router.post('/login', loginController);

// 현재 사용자 정보 조회 ( 인증 필요 )

router.get('/me', requireAuth, meController);

// 로그아웃 ( 쿠키 기반 사용시 쿠기 제거 )

router.post('/logout', logoutController);

export default router;

/**
 * [프론트 라우팅 메모]
 * - 프론트에서:
 *   POST   /api/auth/register  {email, password, username}
 *   POST   /api/auth/login     {email, password}
 *   GET    /api/auth/me        (with credentials)  -> Authorization 헤더 또는 쿠키
 *   POST   /api/auth/logout
 */