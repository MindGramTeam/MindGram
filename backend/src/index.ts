import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';

const app = express();

// 환경변수 ( 없으면 기본값으로 남겨도 됨 )
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173' ;     // 프론트 개발서버 예시 (vite)

// 미들웨어
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_URL,   // 프로트 도메인
    credentials: true,    // 쿠키 / 인증 정보를 프론트에서 보낼 수 있게
  })
);

// 헬스 체크
app.get('/health', (_req, res) => {
  res.json( {ok: true, service : 'MindGram backend', time: new Date().toISOString() } );
});

// 라우트 마운트 (프로트랑 연동시 / api prefix 추천)
app.use('/api/auth', authRouter)

// 서버 시작하는 곳
app.listen(PORT, () => {
   console.log(`Mindgram backend listening on port ${PORT}`);
});

/**
 * [DB Connect 자리]
 * 나중에 실제 DB 연결 로직은 여기 혹은 별도 /src/loaders/db.ts 로 분리해서 import
 */
