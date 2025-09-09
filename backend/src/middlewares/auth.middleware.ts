import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;   // 요청 헤더에서 Authorization 값을 가져옴

    // Authorization 헤더 존재 여부 & 'Bearer ' 접두어 확인
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization 헤더가 없거나 형식이 올바르지 않습니다.' });
    }

    const token = header.slice('Bearer '.length).trim();
    
    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ message: '토큰이 유효하지 않거나 만료되었습니다.' });   // 검증 실패(유효하지 않음/만료됨 등)
    }
}