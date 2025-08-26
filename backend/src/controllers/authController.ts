import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { InMemoryUserStore } from '../store/InMemoryUserStore.js';
import { singAccessToken, setAuthCookie, clearAuthCookie } from '../utils/token.js';
import { AuthedRequest } from '../utils/types';

// ===== 인메모리 스토리지 인스터스 =====
// 서버 재시작 시 데이터 초기화 됨 ( 테스트 용 )

const users = new InMemoryUserStore();

/** 
 * [DB Change Point - 회원 저장 / 조회]
 * 나중에 DB 불일 때 아래 users.* 호출을 교체:
 *      - users.findByEmail(email) -> DB 에서 이메일로 사용자 조회
 *      - users.create(user) -> DB 사용자 생성
 *      - users.findByID(id) -> DB에서 id로 조회
 */

export async function registerController(req: Request, res: Response) {
    try {
        const { email, password, username } = req.body as {
            email?: string;
            password?: string;
            username?: string;
        };

        if (!email || !password || !username ) {
            return res.status(400).json({ error: '이메일과 스워드와 이름이 모두 필요합니다.'});
        }

        const exists = await users.findByEmail(email);
        if (exists) {
            return res.status(409).json({ error: '이미 사용 중인 이메일입니다.' });
        }

        const hashed = await bcrypt.hash(password, 10);

        const created = await users.create({
            email,
            username,
            passwordHash: hashed,
        });

        // 토큰 발급 (접근 토큰)
        const accessToken = singAccessToken({ userId : created.id});

        // 쿠키로도 내려주고(프론트에서 credentials: 'include'), 응답 바디에도 같이 담아줌
        setAuthCookie(res, accessToken);

        return res.status(201).json( {
            message: '회원가입 성공!',
            user: {id: created.id, email: created.email, username: created.username },
            accessToken,        // 필요시 프론트에서 로컬 상태로 보관해도 문제가 없을거 같음
        }) ;
    } catch (err) { 
        console.error('[registerController] error:', err);
        return res.status(500).json({error : '서버오류'});
    }
}

export async function loginController(req: Request, res: Response) {
    try {
        const { email, password } = req.body as { email? :  string , password?: string} ;
        if ( !email || !password ){
            return res.status(400).json({ error : 'email, password를 입력해주세요'});
        }

        const user = await users.findByEmail(email);
        if ( !user ) {
            return res.status(401).json ({ error: '이메일 또는 비밀번호가 올바르지 않습니다.'});
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if ( !ok ) {
            return res.status(401).json ({ error: '이메일 또는 비밀번호가 올바르지 않습니다.'});
        }

        const accessToken = singAccessToken({ userId: user.id});
        setAuthCookie(res, accessToken);

        return res.json({
            message : '로그인 성공!',
            user: {id: user.id, email: user.email, username: user.username },
            accessToken,
        });
    } catch (err) {
        console.error('[loginController] error', err);
        return res.status(500).json({ error: '서버 오류'});
    }
}

export async function meController(req: AuthedRequest, res: Response) {
    try {
        // requireAuth 미들웨어에서 requ.userId 세팅
        const userId = req.userId!;
        const user = await users.findById(userId);
        if (!user) {
            return res.status(404).json({error : '사용자를 찾을 수 없습니다.'});
        }
        return res.json({ user: {id: user.id, email: user.email, username: user.username} });
    } catch (err) {
        console.error('[meContoreller] error:', err);
        return res.status(500).json({ error: '서버 오류'});
    }
}

export async function logoutController(_req: Request, res: Response) {
    // 쿠키 제거 ( Front에서 credentials : ' inclued' 로 호출해누는 작업 필요)
    clearAuthCookie(res);
    return res.json({ message : '로그아웃' });
}
