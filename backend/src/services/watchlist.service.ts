import WatchlistItem from '../models/Watchlist';
import AppError from '../utils/AppError';

/**
 * Add a stock symbol to the user's watchlist.
 */
const addItem = async (userId: string, { symbol, companyName }: { symbol: string; companyName?: string }) => {
  try {
    const item = await WatchlistItem.create({
      user: userId,
      symbol,
      companyName: companyName || '',
    });
    return item.toJSON();
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: number }).code === 11000) {
      throw new AppError(`${symbol} is already in your watchlist`, 409);
    }
    throw err;
  }
};

/**
 * Get all watchlist items for a user.
 */
const getAll = async (userId: string) => {
  const items = await WatchlistItem.find({ user: userId })
    .sort({ addedAt: -1 })
    .lean();
  return items;
};

/**
 * Remove a stock symbol from the user's watchlist.
 */
const removeItem = async (userId: string, symbol: string) => {
  const result = await WatchlistItem.findOneAndDelete({
    user: userId,
    symbol: symbol.toUpperCase(),
  });

  if (!result) {
    throw new AppError(`${symbol.toUpperCase()} not found in your watchlist`, 404);
  }

  return result;
};

export { addItem, getAll, removeItem };
