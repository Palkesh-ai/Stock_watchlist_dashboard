"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { watchlistService } from "@/services/api/watchlist.service";
import { extractErrorMessage } from "@/services/api/client";
import { WatchlistItem } from "@/types/finance";

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingSymbol, setDeletingSymbol] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await watchlistService.getAll();
      setItems(data);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const add = async (symbol: string, companyName?: string) => {
    setIsAdding(true);
    try {
      const item = await watchlistService.add(symbol, companyName);
      setItems((prev) => [item, ...prev]);
      toast.success(`${item.symbol} added to watchlist`);
    } catch (error) {
      toast.error(extractErrorMessage(error));
      throw error;
    } finally {
      setIsAdding(false);
    }
  };

  const remove = async (symbol: string) => {
    setDeletingSymbol(symbol);
    // Optimistic removal
    const previousItems = [...items];
    setItems((prev) => prev.filter((entry) => entry.symbol !== symbol));

    try {
      await watchlistService.remove(symbol);
      toast.success(`${symbol} removed from watchlist`);
    } catch (error) {
      // Revert on error
      setItems(previousItems);
      toast.error(extractErrorMessage(error));
    } finally {
      setDeletingSymbol(null);
    }
  };

  return { items, loading, refresh: fetchAll, add, remove, isAdding, deletingSymbol };
}
