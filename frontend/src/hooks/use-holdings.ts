"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { portfolioService } from "@/services/api/portfolio.service";
import { extractErrorMessage } from "@/services/api/client";
import { Holding, PortfolioSummary } from "@/types/finance";

const emptySummary: PortfolioSummary = { totalHoldings: 0, totalInvested: 0 };

export function useHoldings() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await portfolioService.getAll();
      setHoldings(data.holdings);
      setSummary(data.summary);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addHolding = async (symbol: string, companyName: string | undefined, quantity: number, averagePrice: number) => {
    setIsAdding(true);
    try {
      await portfolioService.add({ symbol, companyName, quantity, averagePrice });
      await refresh();
      toast.success("Holding added");
    } catch (error) {
      toast.error(extractErrorMessage(error));
      throw error;
    } finally {
      setIsAdding(false);
    }
  };

  const removeHolding = async (id: string) => {
    const previousHoldings = [...holdings];
    const previousSummary = { ...summary };

    // Optimistic removal (visual only)
    setHoldings((prev) => prev.filter((h) => h._id !== id));

    try {
      await portfolioService.remove(id);
      await refresh();
      toast.success("Holding removed");
    } catch (error) {
      // Revert on error
      setHoldings(previousHoldings);
      setSummary(previousSummary);
      toast.error(extractErrorMessage(error));
    }
  };

  return { holdings, loading, refresh, addHolding, removeHolding, summary, isAdding };
}
