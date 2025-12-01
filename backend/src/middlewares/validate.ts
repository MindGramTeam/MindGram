import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny } from 'zod';

export const validate =
    (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
            message: '유효성 검사 오류',
            errors: result.error.flatten(), 
            });
        }
        req.body = result.data as any;
        next();
    };