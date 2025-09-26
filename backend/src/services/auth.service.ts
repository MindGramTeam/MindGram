import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { randomUUID } from 'crypto';

import { userRepo } from '../repositories/user.repo';
import { env } from '../config/env';
import { DuplicateEmailError, UnaturhorizedError } from '../utils/error';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import type { User } from "../types/user";

type TokenPayload = {
    id : string;
    email : string;
}

const snaitize = <T extends { passwordHash?: string}>(u: T) => {
    const { passwordHash, ...rest } = u;
    return rest;
}

// Signup
export const register = async( input: RegisterInput ) => {
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

    return snaitize(user);

}

// Signin
export const login = async (input: LoginInput) => {
    const user = await userRepo.findByEmail(input.email);
    if (!user) {
        throw new UnaturhorizedError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) {
        throw new UnaturhorizedError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const payload: TokenPayload = {
        id: user.id,
        email: user.email,
    }
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
    
    return { token, user: snaitize(user) };
}

export function verifyToken(token: string) {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    
    if (typeof payload !== 'object' || !payload?.id || !payload?.email) {
        throw new UnaturhorizedError('유효하지 않은 토큰');
    }

    return {id : String(payload.id), email: String(payload.email)};
}