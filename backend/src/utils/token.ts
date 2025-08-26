import { Response } from "express";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const COOKIE_NAME = 'mg_access_token';

// 토큰 만료시간 : 1일 (테스트용; 서비스 정책을 정해서 토큰을 맞게 설정해야함 )
const EXPRIRES_IN = '1d';

export function singAccessToken(payload: object){
    return jwt.sign(payload, JWT_SECRET, { expiresIn : EXPRIRES_IN });
}

export function verifyAccessToken(token: string){
    return jwt.verify(token, JWT_SECRET) as { userId: string; lat: number; exp: number };
}

export function setAuthCookie(res: Response, token: string) {
    // 개발 단계에서는 secure-false (HTPPS 아니라도 전송), 운영 배포시 secure: true, sameSite 등 조정
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: false,  // TODO : prod에서 true
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000, // id
    });
}

export function clearAuthCookie(res: Response) {
    res.clearCookie(COOKIE_NAME, { path: '/'})
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;