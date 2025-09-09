import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepo } from '../repositories/user.repo';
import { env } from '../config/env';
import { randomUUID } from 'crypto';

export async function register( input: { email: string; password: string; name: string}) {
    const exists = await userRepo.findByEmail(input.email);
    if (exists) {
        throw new Error('이미 사용중인 이메일 입니다.')
    }
    
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await userRepo.create({
        id: randomUUID(),
        email: input.email,
        name: input.name,
        passwordHash,
    });

    return sanitize(user);

}

export async function login(input: { email: string; password: string }) {
    const user = await userRepo.findByEmail(input.email);
    if (!user) throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');

    const token = jwt.sign(
        { id: user.id, email: user.email },
        env.JWT_SECRET as string,
        { expiresIn: 60 * 60 * 24 * 7 } // 7일
    );
    return { token, user: sanitize(user) };
}

export function verifyToken(token: string) {
    const payload = jwt.verify(token, env.JWT_SECRET as string) as { id: string; email: string };
    return payload;
}

function sanitize<T extends { passwordHash?: string }>(u: T) {
    const { passwordHash, ...rest } = u;
    
    return rest;
}

