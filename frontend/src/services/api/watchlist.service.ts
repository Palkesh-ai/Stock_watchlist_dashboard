import { apiClient } from "./client";
import { WatchlistItem } from "@/types/finance";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  count?: number;
}

export const watchlistService = {
  async getAll(): Promise<WatchlistItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<WatchlistItem[]>>("/api/watchlist");
    return data.data;
  },

  async add(symbol: string, companyName?: string): Promise<WatchlistItem> {
    const { data } = await apiClient.post<ApiEnvelope<WatchlistItem>>("/api/watchlist", {
      symbol: symbol.toUpperCase().trim(),
      companyName: companyName || "",
    });
    return data.data;
  },

  async remove(symbol: string): Promise<void> {
    await apiClient.delete(`/api/watchlist/${symbol.toUpperCase().trim()}`);
  },
};
