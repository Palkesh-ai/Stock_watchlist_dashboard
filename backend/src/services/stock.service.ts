import axios from 'axios';
import env from '../config/env';
import AppError from '../utils/AppError';
import { StockSearchResult } from '../types';

const finnhubClient = axios.create({
  baseURL: env.finnhub.baseUrl,
  timeout: 10000,
  params: {
    token: env.finnhub.apiKey,
  },
});

// Simple in-memory cache to prevent rate limiting (60 second TTL for quotes)
const quoteCache: Record<string, { data: any; timestamp: number }> = {};
const profileCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 60 * 1000; // 60 seconds
const PROFILE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetches a stock quote from Finnhub.
 * GET /quote?symbol=AAPL
 */
const fetchQuote = async (symbol: string) => {
  const now = Date.now();
  const cached = quoteCache[symbol];

  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  try {
    const { data } = await finnhubClient.get('/quote', {
      params: { symbol },
    });

    // Finnhub returns { c, d, dp, h, l, o, pc, t } — c = current price
    if (!data || data.c === 0) {
      // If we have an old cache, return it as fallback rather than null
      if (cached) return cached.data;
      return null;
    }

    const quoteData = {
      currentPrice: data.c as number,
      change: data.d as number,
      changePercent: data.dp as number,
      high: data.h as number,
      low: data.l as number,
      open: data.o as number,
      previousClose: data.pc as number,
      volume: (data.v as number) || null,
    };

    // Update cache
    quoteCache[symbol] = { data: quoteData, timestamp: now };
    return quoteData;
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.warn(`[Finnhub] Rate limit exceeded for ${symbol}. Using cached data if available.`);
      if (cached) return cached.data;
    }
    throw error;
  }
};

/**
 * Fetches company profile from Finnhub.
 * GET /stock/profile2?symbol=AAPL
 */
const fetchCompanyProfile = async (symbol: string) => {
  const now = Date.now();
  const cached = profileCache[symbol];

  if (cached && (now - cached.timestamp < PROFILE_TTL)) {
    return cached.data;
  }

  try {
    const { data } = await finnhubClient.get('/stock/profile2', {
      params: { symbol },
    });

    if (!data || !data.name) {
      return null;
    }

    const profileData = {
      companyName: data.name as string,
      ticker: data.ticker as string,
      sector: (data.finnhubIndustry || '') as string,
      logo: (data.logo || '') as string,
      marketCap: (data.marketCapitalization || 0) as number,
      exchange: (data.exchange || '') as string,
    };

    profileCache[symbol] = { data: profileData, timestamp: now };
    return profileData;
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.warn(`[Finnhub] Rate limit exceeded for profile of ${symbol}.`);
      if (cached) return cached.data;
    }
    return null;
  }
};

/**
 * Searches for a stock by symbol.
 * Combines quote data and company profile into a single response.
 */
const searchStock = async (symbol: string): Promise<StockSearchResult> => {
  const upperSymbol = symbol.toUpperCase().trim();

  const [quote, profile] = await Promise.all([
    fetchQuote(upperSymbol),
    fetchCompanyProfile(upperSymbol),
  ]);

  if (!quote) {
    throw new AppError(`No quote data found for symbol: ${upperSymbol}`, 404);
  }

  return {
    symbol: upperSymbol,
    companyName: profile?.companyName || upperSymbol,
    sector: profile?.sector || '',
    logo: profile?.logo || '',
    currentPrice: quote.currentPrice,
    change: quote.change,
    changePercent: quote.changePercent,
    high: quote.high,
    low: quote.low,
    open: quote.open,
    previousClose: quote.previousClose,
    marketCap: profile?.marketCap || 0,
    exchange: profile?.exchange || '',
    volume: quote.volume,
  };
};

/**
 * Fetches historical candle data for a stock.
 * GET /stock/candle
 */
const fetchCandles = async (symbol: string, resolution: string, from: number, to: number) => {
  const { data } = await finnhubClient.get('/stock/candle', {
    params: { symbol, resolution, from, to },
  });

  if (data.s !== 'ok' || !data.t) {
    return [];
  }

  const formattedData = data.t.map((timestamp: number, index: number) => ({
    time: timestamp,
    open: data.o[index],
    high: data.h[index],
    low: data.l[index],
    close: data.c[index],
    volume: data.v[index],
  }));

  return formattedData;
};

/**
 * Queries stocks using Finnhub search and returns paginated results.
 * If query is empty, returns top trending stocks.
 */
const queryStocks = async (query: string, page: number = 1, limit: number = 5) => {
  let symbolsToFetch: string[] = [];
  let total = 0;

  if (!query || !query.trim()) {
    // Trending/popular stocks fallback
    const trending = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC'];
    total = trending.length;
    symbolsToFetch = trending.slice((page - 1) * limit, page * limit);
  } else {
    const { data } = await finnhubClient.get('/search', { params: { q: query } });
    let matches = data.result || [];
    
    // Filter to try and get standard US stocks
    matches = matches.filter((m: any) => m.type === 'Common Stock' && !m.symbol.includes('.'));
    
    total = matches.length;
    symbolsToFetch = matches.slice((page - 1) * limit, page * limit).map((m: any) => m.symbol);
  }

  const totalPages = Math.ceil(total / limit);

  const results = await Promise.all(
    symbolsToFetch.map(async (sym) => {
      try {
        return await searchStock(sym);
      } catch (err) {
        return null; // Skip if no quote data found
      }
    })
  );

  return {
    results: results.filter(Boolean),
    total,
    page,
    totalPages,
  };
};

export { searchStock, fetchQuote, fetchCandles, queryStocks };
