import { apiClient } from "./client";
import { Holding, PortfolioResponse } from "@/types/finance";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export interface AddHoldingPayload {
  symbol: string;
  companyName?: string;
  quantity: number;
  averagePrice: number;
}

export const portfolioService = {
  async getAll(): Promise<PortfolioResponse> {
    const { data } = await apiClient.get<ApiEnvelope<PortfolioResponse>>("/api/portfolio");
    return data.data;
  },

  async add(payload: AddHoldingPayload): Promise<Holding> {
    const { data } = await apiClient.post<ApiEnvelope<Holding>>("/api/portfolio", {
      symbol: payload.symbol.toUpperCase().trim(),
      companyName: payload.companyName || "",
      quantity: payload.quantity,
      averagePrice: payload.averagePrice,
    });
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/api/portfolio/${id}`);
  },
};
