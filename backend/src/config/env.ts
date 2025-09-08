import 'dotenv/config';

export const env ={
    PORT : Number(process.env.PORT ?? 3000),
    JWT_SECRET : process.env.JWT_SECRET ?? 'dev-secret',
    JWT_EXPIRES_IN : process.env.JWT_EXPIRES_IN ?? '7d',
} as const;