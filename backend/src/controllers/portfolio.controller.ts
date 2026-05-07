import asyncHandler from '../utils/asyncHandler';
import * as portfolioService from '../services/portfolio.service';
import { AuthRequest } from '../types';

/**
 * POST /api/portfolio
 */
export const addHolding = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;
  const holding = await portfolioService.addHolding(authReq.user!._id.toString(), req.body);

  res.status(201).json({
    success: true,
    data: holding,
  });
});

/**
 * GET /api/portfolio
 */
export const getAll = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;
  const portfolio = await portfolioService.getAll(authReq.user!._id.toString());

  res.status(200).json({
    success: true,
    data: portfolio,
  });
});

/**
 * DELETE /api/portfolio/:id
 */
export const removeHolding = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;
  const holdingId = req.params.id as string;
  await portfolioService.removeHolding(authReq.user!._id.toString(), holdingId);

  res.status(200).json({
    success: true,
    message: 'Holding removed from portfolio',
  });
});
