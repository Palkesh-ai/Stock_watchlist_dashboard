import { apiClient } from "./client";
import { StockQuote } from "@/types/finance";

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

  async query(q: string, page: number = 1, limit: number = 5) {
    const { data } = await apiClient.get<ApiEnvelope<any>>("/api/stocks/query", {
      params: { q, page, limit },
    });
    return data.data;
  },

  async getCandles(symbol: string, resolution: string, from: number, to: number) {
    const { data } = await apiClient.get<ApiEnvelope<any[]>>("/api/stocks/candles", {
      params: { symbol: symbol.toUpperCase().trim(), resolution, from, to },
    });
    return data.data;
  },
};
