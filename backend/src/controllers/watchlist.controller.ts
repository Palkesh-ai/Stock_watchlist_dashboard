import asyncHandler from '../utils/asyncHandler';
import * as watchlistService from '../services/watchlist.service';
import { AuthRequest } from '../types';

/**
 * POST /api/watchlist
 */
export const addItem = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;
  const item = await watchlistService.addItem(authReq.user!._id.toString(), req.body);

  res.status(201).json({
    success: true,
    data: item,
  });
});

/**
 * GET /api/watchlist
 */
export const getAll = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;
  const items = await watchlistService.getAll(authReq.user!._id.toString());

  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
});

/**
 * DELETE /api/watchlist/:symbol
 */
export const removeItem = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;
  const symbol = req.params.symbol as string;
  await watchlistService.removeItem(authReq.user!._id.toString(), symbol);

  res.status(200).json({
    success: true,
    message: `${symbol.toUpperCase()} removed from watchlist`,
  });
});
