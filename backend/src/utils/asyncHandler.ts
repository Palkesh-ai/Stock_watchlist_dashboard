import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async route handler to catch errors and forward them
 * to the centralized error middleware.
 */
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
