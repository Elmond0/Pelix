import { Request, Response } from 'express';
import { errorResponse } from '../utils/apiResponse';

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json(
    errorResponse('NOT_FOUND', `La rotta ${_req.method} ${_req.originalUrl} non esiste`)
  );
}
