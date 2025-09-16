import express from 'express';
import cors from 'cors';    // API 호출할 때 CORS에러 막기 위한 미들웨어
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes';
import { env } from './config/env';
import aiRoutes from "./ai/ai.routes";

const app = express();
const port = env.PORT; 

app.use(cors());    // 프론트엔트와 연결하기 윈한 CORS 초기화
app.use(express.json());
app.use(express.urlencoded { extended: false });
app.use(cookieParser());
app.use("/api/ai", aiRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Mindgram backend listening on port ${port}`);
});
