import { Request, Response } from 'express';
import { login, register } from '../services/auth.service';

export const registerController = async (req: Request, res: Response) => {
    try {
        const user = await register(req.body);
        
        return res.status(201).json({ user });
    } catch (e: any) {
        const msg = e?.message ?? '회원가입에 실패하였습니다.';
        const status = msg === '이미 사용 중인 이메일' ? 409 : 400;
        
        return res.status(status).json({ message: msg });
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        const result = await login(req.body);
        
        return res.json(result);
    } catch (e: any) {
        const msg = e?.message ?? '로그인 실패';
        const status = msg.includes('유효하지가 않습니다.') ? 401 : 400;

        return res.status(status).json({ message: msg });
    }
};

/**
   * 내 정보 조회
   * - 인증 미들웨어에서 req.user를 주입했다고 가정
   * - 없으면 401
   * - 있으면 사용자 정보 반환
**/
export const meController = async (req: Request, res: Response) => {
    if (!req.user) {
    return res.status(401).json({ message: '인증에 실패하였습니다!' });
    }
    
    return res.json({ user: req.user });
};