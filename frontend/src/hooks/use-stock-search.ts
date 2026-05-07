"use client";

import { useState } from "react";
import { toast } from "sonner";
import { stockService } from "@/services/api/stock.service";
import { extractErrorMessage } from "@/services/api/client";
import { PaginatedStockSearchResult } from "@/types/finance";

export function useStockSearch() {
  const [result, setResult] = useState<PaginatedStockSearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async (query: string, page: number = 1) => {
    const normalizedQuery = query.trim().toUpperCase();
    
    setLoading(true);
    try {
      const paginatedData = await stockService.query(normalizedQuery, page, 5);
      setResult(paginatedData);
      return paginatedData;
    } catch (error) {
      toast.error(extractErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, search, clearResult: () => setResult(null) };
}
