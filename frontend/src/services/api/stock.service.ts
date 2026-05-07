import { apiClient } from "./client";
import { StockQuote, StockCandle, PaginatedStockSearchResult } from "@/types/finance";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export const stockService = {
  async search(symbol: string): Promise<StockQuote> {
    const { data } = await apiClient.get<ApiEnvelope<StockQuote>>("/api/stocks/search", {
      params: { symbol: symbol.toUpperCase().trim() },
    });
    return data.data;
  },

  async query(q: string, page: number = 1, limit: number = 5): Promise<PaginatedStockSearchResult> {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedStockSearchResult>>("/api/stocks/query", {
      params: { q, page, limit },
    });
    return data.data;
  },

  async getCandles(symbol: string, resolution: string, from: number, to: number): Promise<StockCandle[]> {
    const { data } = await apiClient.get<ApiEnvelope<StockCandle[]>>("/api/stocks/candles", {
      params: { symbol: symbol.toUpperCase().trim(), resolution, from, to },
    });
    return data.data;
  },
};
