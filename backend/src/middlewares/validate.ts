import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny } from 'zod';

export const validate =
    (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
            message: 'Validation error',
            errors: result.error.flatten(), 
            });
        }
    // 유효하면 body를 파싱된 형태로 덮어쓰기 (타입 안전)
        req.body = result.data as any;
        next();
    };