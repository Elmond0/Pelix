import cors from 'cors';
import { config } from '../config/config';

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const allowedOrigins = config.corsOrigin.split(',').map((o) => o.trim());

    if (config.nodeEnv === 'development') {
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origine ${origin} non consentita da CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  maxAge: 86400,
};

export const corsMiddleware = cors(corsOptions);
