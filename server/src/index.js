import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env, assertEnv } from './config/env.js';
import { apiRateLimit } from './middleware/rateLimit.js';
import chatRoutes from './routes/chat.js';
import modelRoutes from './routes/models.js';

const app = express();

app.use(
  cors({
    origin: env.allowedOrigin,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use('/api', apiRateLimit);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'omniai-server',
    env: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', modelRoutes);
app.use('/api', chatRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    error: 'internal_error',
    message: 'Unexpected server error.',
  });
});

app.listen(env.port, () => {
  assertEnv();
  console.log(`OmniAI server running at http://localhost:${env.port}`);
});
