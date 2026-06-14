import cors from 'cors';
import express from 'express';
import hotRouter from './routes/hot.js';
import { listActiveDevMockFails } from './utils/devFailSwitch.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

/** 允许的前端来源，逗号分隔；生产环境在 Railway 设置 CLIENT_ORIGIN */const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: CLIENT_ORIGINS }));
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/hot', hotRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);

  const mockFails = listActiveDevMockFails();
  if (mockFails.length > 0) {
    console.warn(
      `[dev] 模拟抓取失败已启用: ${mockFails.join(', ')}（对应卡片将展示 error 态）`,
    );
  }
});
