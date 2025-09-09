import 'dotenv/config'; 
// .env 파일을 로드하여 process.env에 주입합니다.

export const env = {
    PORT: Number(process.env.PORT ?? 3000),
    // 서버가 바인드할 포트 번호. 환경변수가 문자열이므로 Number로 변환합니다.

    JWT_SECRET: process.env.JWT_SECRET ?? 'dev-secret',
    // JWT 서명을 위한 비밀키. 운영 환경에서는 반드시 설정해야 합니다.

    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
    // JWT 만료 기간. jsonwebtoken의 expiresIn 형식(예: '7d', '1h', 3600 등)을 따릅니다.
} as const;
// as const: env 객체를 읽기 전용으로 만들어, 이후 재할당/수정 방지