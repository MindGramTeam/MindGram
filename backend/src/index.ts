import express from 'express';
import cors from 'cors';    // API 호출할 때 CORS에러 막기 위한 미들웨어
import authRoutes from './routes/auth.routes';
import { env } from './config/env';

const app = express();
const port = env.PORT; 

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Mindgram backend listening on port ${port}`);
});
