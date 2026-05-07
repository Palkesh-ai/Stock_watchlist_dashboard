import jwt from 'jsonwebtoken';
import env from '../config/env';
import User from '../models/User';
import AppError from '../utils/AppError';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest, JwtPayload } from '../types';

/**
 * Protects routes by verifying the JWT from the Authorization header.
 * Attaches the authenticated user to req.user.
 */
const auth = asyncHandler(async (req, _res, next) => {
  const authReq = req as AuthRequest;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Not authorized — no token provided', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    throw new AppError('Not authorized — user no longer exists', 401);
  }

  authReq.user = user;
  next();
});

export default auth;
