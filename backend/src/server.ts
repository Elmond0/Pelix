import express, { Request, Response } from 'express';
import { config } from './config/config';
import { corsMiddleware } from './middleware/corsConfig';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import requestLogger from './middleware/requestLogger';
import logger from './utils/logger';

const app = express();

// Middleware globali
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

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

// TODO: Rotte API (verranno aggiunte nelle fasi successive)
// app.use('/api/auth', authRoutes);
// app.use('/api/profiles', profileRoutes);
// app.use('/api/movies', movieRoutes);
// app.use('/api/series', seriesRoutes);
// app.use('/api/catalog', catalogRoutes);
// app.use('/api/search', searchRoutes);
// app.use('/api/stream', streamRoutes);
// app.use('/api/admin', adminRoutes);

// Gestione errori
app.use(notFoundHandler);
app.use(errorHandler);

// Avvio server
const PORT = config.port;
app.listen(PORT, () => {
  logger.info('================================');
  logger.info('  Pelix API Server');
  logger.info(`  Ambiente:  ${config.nodeEnv}`);
  logger.info(`  Porta:     ${PORT}`);
  logger.info(`  URL:       http://localhost:${PORT}`);
  logger.info('================================');
});

// Gestione errori non catturati
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

export default app;
