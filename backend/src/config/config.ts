import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Variabile d'ambiente mancante: ${key}`);
  }
  return value;
}

function getEnvAsInt(key: string, defaultValue?: number): number {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Variabile d'ambiente mancante: ${key}`);
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Variabile d'ambiente ${key} non e un numero valido: ${value}`);
  }
  return parsed;
}

export const config = {
  nodeEnv: getEnv('NODE_ENV', 'development'),
  port: getEnvAsInt('PORT', 3000),
  databaseUrl: getEnv('DATABASE_URL'),
  redis: {
    host: getEnv('REDIS_HOST', 'localhost'),
    port: getEnvAsInt('REDIS_PORT', 6379),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  jwt: {
    secret: getEnv('JWT_SECRET'),
    refreshSecret: getEnv('JWT_REFRESH_SECRET'),
    expiresIn: getEnv('JWT_EXPIRES_IN', '15m'),
    refreshExpiresIn: getEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
  },
  corsOrigin: getEnv('CORS_ORIGIN', 'http://localhost:5173'),
  storage: {
    path: getEnv('STORAGE_PATH', '../storage'),
    uploadMaxSize: getEnvAsInt('UPLOAD_MAX_SIZE', 5368709120),
  },
  ffmpegPath: getEnv('FFMPEG_PATH', '/usr/bin/ffmpeg'),
  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  },
  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  },
} as const;

export type Config = typeof config;
