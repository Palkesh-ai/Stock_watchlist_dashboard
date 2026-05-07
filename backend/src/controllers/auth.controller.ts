import asyncHandler from '../utils/asyncHandler';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../types';

/**
 * POST /api/auth/signup
 */
export const signup = asyncHandler(async (req, res) => {
  const { user, token } = await authService.signup(req.body);

  res.status(201).json({
    success: true,
    data: { user, token },
  });
});

/**
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);

  res.status(200).json({
    success: true,
    data: { user, token },
  });
});

/**
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;
  const user = await authService.getMe(authReq.user!._id.toString());

  res.status(200).json({
    success: true,
    data: { user },
  });
});
