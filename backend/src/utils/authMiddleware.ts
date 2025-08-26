import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, AUTH_COOKIE_NAME } from './token.js';
import { AuthedRequest } from './types';

/** 
 * 클라이언트가 보낼 수 있는 인증 정보 : 
 *    1) Authorization : Bearer <token>
 *    2) 쿠키 : mg_access_token=<token>  (creadentials : 'include' 필요)
 */

export function requireAuth(req: Request, res: Response, next: NextFunction){
    try {
        const auth = req.headers.authorization;
        let token: string | undefined;

        if ( auth?.startsWith('Bearer ')) {
            token = auth.slice('Bearer '.length);
        } else if ( req.cookies?.[AUTH_COOKIE_NAME]) {
            token = req.cookies[AUTH_COOKIE_NAME];
        }

        if (!token) {
            return res.status(401).json({ error : '인증이 필요합니다. '});
        }

        const payload = verifyAccessToken(token);
        (req as AuthedRequest).userId = payload.userId;

        next();
    } catch (err) {
        return res.status(401).json({ error: '토큰이 유효하지 않거나 만료되었습니다.'});
    }
}