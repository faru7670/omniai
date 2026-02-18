import dotenv from 'dotenv';

dotenv.config();

function parseNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseNumber(process.env.PORT, 8080),
  allowedOrigin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  rateLimitWindowMs: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
  rateLimitMax: parseNumber(process.env.RATE_LIMIT_MAX, 30),
  huggingFaceApiKey: process.env.HUGGINGFACE_API_KEY || '',
  defaultModel: process.env.DEFAULT_MODEL || 'HuggingFaceH4/zephyr-7b-beta',
};

export function assertEnv() {
  if (!env.huggingFaceApiKey) {
      console.warn('[WARN] HUGGINGFACE_API_KEY not configured. /api/chat will return setup error.');
  }
}
