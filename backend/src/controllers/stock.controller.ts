import asyncHandler from '../utils/asyncHandler';
import * as stockService from '../services/stock.service';
import AppError from '../utils/AppError';

/**
 * GET /api/stocks/search?symbol=AAPL
 */
export const searchStock = asyncHandler(async (req, res) => {
  const { symbol } = req.query;

  if (!symbol || typeof symbol !== 'string' || !symbol.trim()) {
    throw new AppError('Query parameter "symbol" is required', 400);
  }

  const data = await stockService.searchStock(symbol);

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * GET /api/stocks/candles?symbol=AAPL&resolution=D&from=16000000&to=16100000
 */
export const getCandles = asyncHandler(async (req, res) => {
  const { symbol, resolution, from, to } = req.query;

  if (!symbol || !resolution || !from || !to) {
    throw new AppError('Query parameters symbol, resolution, from, to are required', 400);
  }

  const data = await stockService.fetchCandles(
    symbol as string,
    resolution as string,
    parseInt(from as string, 10),
    parseInt(to as string, 10)
  );

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * GET /api/stocks/query?q=AAPL&page=1&limit=5
 */
export const queryStocks = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 5;

  const data = await stockService.queryStocks(q as string, pageNum, limitNum);

  res.status(200).json({
    success: true,
    data,
  });
});
