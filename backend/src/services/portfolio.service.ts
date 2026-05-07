import Holding from '../models/Portfolio';
import AppError from '../utils/AppError';
import { fetchQuote } from './stock.service';
import { IHoldingDocument } from '../types';

interface AddHoldingPayload {
  symbol: string;
  companyName?: string;
  quantity: number;
  averagePrice: number;
}

/**
 * Add a new holding to the user's portfolio.
 */
const addHolding = async (userId: string, { symbol, companyName, quantity, averagePrice }: AddHoldingPayload) => {
  const holding = await Holding.create({
    user: userId,
    symbol,
    companyName: companyName || '',
    quantity,
    averagePrice,
  });
  return holding.toJSON();
};

/**
 * Get all holdings for a user with calculated investment values.
 */
const getAll = async (userId: string): Promise<{ holdings: any[]; summary: any }> => {
  const holdings = await Holding.find({ user: userId })
    .sort({ createdAt: -1 });

  // Return with virtuals (investedValue)
  const result = holdings.map((h) => h.toJSON());

  // Fetch quotes for all unique symbols
  const symbols = [...new Set(result.map((h) => h.symbol))];
  const quotes = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const quote = await fetchQuote(symbol);
        return { symbol, quote };
      } catch (error) {
        console.error(`[PortfolioService] Failed to fetch quote for ${symbol}:`, error instanceof Error ? error.message : error);
        return { symbol, quote: null };
      }
    })
  );

  const quoteMap = quotes.reduce((acc, curr) => {
    acc[curr.symbol] = curr.quote;
    return acc;
  }, {} as Record<string, any>);

  let totalInvested = 0;
  let totalCurrentValue = 0;
  let totalDailyChange = 0;

  const holdingsWithMetrics = result.map((h) => {
    const quote = quoteMap[h.symbol];
    const currentPrice = quote?.currentPrice || h.averagePrice;
    
    const investedValue = h.quantity * h.averagePrice;
    const currentValue = h.quantity * currentPrice;
    const profit = currentValue - investedValue;
    
    // Daily P&L calculation: (current price - previous close) * quantity
    const dailyChange = quote ? (quote.currentPrice - quote.previousClose) * h.quantity : 0;
    
    totalInvested += investedValue;
    totalCurrentValue += currentValue;
    totalDailyChange += dailyChange;

    return {
      ...h,
      investedValue: +investedValue.toFixed(2),
      currentValue: +currentValue.toFixed(2),
      profit: +profit.toFixed(2),
      change: quote?.change || 0,
      changePercent: quote?.changePercent || 0,
      isLive: !!quote,
    };
  });

  return {
    holdings: holdingsWithMetrics,
    summary: {
      totalHoldings: symbols.length, // Count unique assets
      totalInvested: +totalInvested.toFixed(2),
      currentValue: +totalCurrentValue.toFixed(2),
      totalProfit: +(totalCurrentValue - totalInvested).toFixed(2),
      totalDailyChange: +totalDailyChange.toFixed(2),
      totalDailyChangePercent: (totalCurrentValue - totalDailyChange) > 0 
        ? +((totalDailyChange / (totalCurrentValue - totalDailyChange)) * 100).toFixed(2) 
        : 0,
    },
  };
};

/**
 * Remove a holding by ID (must belong to the user).
 */
const removeHolding = async (userId: string, holdingId: string) => {
  const holding = await Holding.findOneAndDelete({
    _id: holdingId,
    user: userId,
  });

  if (!holding) {
    throw new AppError('Holding not found or does not belong to you', 404);
  }

  return holding;
};

export { addHolding, getAll, removeHolding };
