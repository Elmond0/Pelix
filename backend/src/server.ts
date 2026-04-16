import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/config';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';

const app = express();

// Middleware globali
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// Rotte
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Pelix API is running!',
    version: '1.0.0',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Gestione errori
app.use(notFoundHandler);
app.use(errorHandler);

// Avvio server
const PORT = config.port;
app.listen(PORT, () => {
  console.log('');
  console.log('================================');
  console.log('  Pelix API Server');
  console.log('  Ambiente:  ' + config.nodeEnv);
  console.log('  Porta:     ' + PORT);
  console.log('  URL:       http://localhost:' + PORT);
  console.log('================================');
  console.log('');
});

export default app;
