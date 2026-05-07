"use client";

import { motion } from "framer-motion";

import { DashboardHeader } from "@/components/dashboard/header";
import { StockSearchSection } from "@/components/dashboard/stock-search-section";
import { WatchlistSection } from "@/components/dashboard/watchlist-section";
import { HoldingsSection } from "@/components/dashboard/holdings-section";
import { AnalyticsCards } from "@/components/dashboard/analytics-cards";
import { AuthGuard } from "@/components/shared/auth-guard";
import { useHoldings } from "@/hooks/use-holdings";
import { useWatchlist } from "@/hooks/use-watchlist";

export default function DashboardPage() {
  const watchlist = useWatchlist();
  const holdings = useHoldings();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-transparent">
        <DashboardHeader />
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="container space-y-8 py-8"
        >
          <AnalyticsCards summary={holdings.summary} />
          
          <section className="grid gap-8 lg:grid-cols-2">
            <StockSearchSection onAddWatchlist={watchlist.add} isAddingWatchlist={watchlist.isAdding} />
            <WatchlistSection
              items={watchlist.items}
              loading={watchlist.loading}
              deletingSymbol={watchlist.deletingSymbol}
              onRefresh={watchlist.refresh}
              onRemove={watchlist.remove}
            />
          </section>
          <HoldingsSection
            holdings={holdings.holdings}
            loading={holdings.loading}
            isAdding={holdings.isAdding}
            onRefresh={holdings.refresh}
            onAdd={holdings.addHolding}
            onRemove={holdings.removeHolding}
          />
        </motion.main>
      </div>
    </AuthGuard>
  );
}
