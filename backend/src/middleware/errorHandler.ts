import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { errorResponse } from '../utils/apiResponse';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    console.warn(`[AppError] ${err.code} - ${err.message}`);
  } else {
    console.error('[UnhandledError]', err);
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err.code, err.message));
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json(errorResponse('INVALID_JSON', 'Il body della richiesta contiene JSON non valido'));
    return;
  }

  const message =
    process.env.NODE_ENV === 'production'
      ? 'Errore interno del server'
      : err.message || 'Errore interno del server';

  res.status(500).json(errorResponse('INTERNAL_ERROR', message));
}
