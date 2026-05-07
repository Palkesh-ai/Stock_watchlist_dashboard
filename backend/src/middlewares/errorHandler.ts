import { Request, Response, NextFunction } from 'express';
import env from '../config/env';

interface AppErrorLike extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: number;
  keyValue?: Record<string, unknown>;
  path?: string;
  value?: unknown;
  errors?: Record<string, { message: string }>;
}

/**
 * Centralized error-handling middleware.
 * Catches all errors forwarded via next(err).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: AppErrorLike, req: Request, res: Response, _next: NextFunction): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose duplicate key
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue).join(', ');
    statusCode = 409;
    message = `Duplicate value for field: ${field}`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    const messages = Object.values(err.errors).map((e) => e.message);
    statusCode = 400;
    message = messages.join('. ');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  console.error(`[ERROR] ${statusCode} - ${message}`, env.nodeEnv === 'development' ? err.stack : '');

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
