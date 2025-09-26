import 'dotenv/config'; 
import { EnvValidationError } from '../utils/error';
import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    JWT_SECRET: z.string().min(1, 'JWT_SECREET은 필수입니다.'),
    JWT_EXPIRES_IN: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    throw new EnvValidationError(
        '환경 변수 검증 실패: ' + JSON.stringify(parsed.error.format(), null, 2)
    );
}

type StringValue = 
    | `${number}ms` | `${number}s` | `${number}m` | `${number}h`
    | `${number}d` | `${number}w` | `${number}y` ;

function toExpiresIn(value: string | undefined): number | StringValue {
    if (!value) return '7d'        // default value
    
    if (/^\d+$/.test(value)) return Number(value);

    if (/^\d+(ms|s|m|h|d|w|y)$/.test(value)) return value  as StringValue;

    throw new EnvValidationError(
        'JWT_EXPIRES_IN은 초(예: 3600) 또는 접미사(ms|s|m|h|d|w|y)를 포함한 값(예: 7d)이어야 합니다.'
    )
}

export const env = {
    PORT: Number(parsed.data.PORT),
    JWT_SECRET: parsed.data.JWT_SECRET,
    JWT_EXPIRES_IN: toExpiresIn(parsed.data.JWT_EXPIRES_IN),
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};