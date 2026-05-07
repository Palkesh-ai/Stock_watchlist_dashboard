// Stock quote from search endpoint (backend shape)
export type StockQuote = {
  symbol: string;
  companyName: string;
  sector: string;
  logo: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  marketCap: number;
  exchange: string;
  volume: number | null;
};

export type PaginatedStockSearchResult = {
  results: StockQuote[];
  total: number;
  page: number;
  totalPages: number;
};

export type StockCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

// Watchlist item from backend (no embedded quote — just symbol + metadata)
export type WatchlistItem = {
  _id: string;
  symbol: string;
  companyName: string;
  addedAt: string;
};

// Holding from backend
export type Holding = {
  _id: string;
  symbol: string;
  companyName: string;
  quantity: number;
  averagePrice: number;
  investedValue: number;
  currentValue?: number;
  profit?: number;
  change?: number;
  changePercent?: number;
  isLive?: boolean;
};

// Portfolio response envelope
export type PortfolioResponse = {
  holdings: Holding[];
  summary: PortfolioSummary;
};

export type PortfolioSummary = {
  totalHoldings: number;
  totalInvested: number;
  currentValue?: number;
  totalProfit?: number;
  totalDailyChange?: number;
  totalDailyChangePercent?: number;
};
