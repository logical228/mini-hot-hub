import cors from 'cors';
import express from 'express';
import hotRouter from './routes/hot.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const CLIENT_ORIGIN = 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN }));
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
});
