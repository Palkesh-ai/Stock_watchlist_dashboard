"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { Search, ChevronLeft, ChevronRight, Plus, Command } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useStockSearch } from "@/hooks/use-stock-search";
import { formatCurrency, formatPercent } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  onAddWatchlist: (symbol: string, companyName?: string) => Promise<void>;
  isAddingWatchlist: boolean;
};

export function StockSearchSection({ onAddWatchlist, isAddingWatchlist }: Props) {
  const { result, loading, search } = useStockSearch();
  const [symbol, setSymbol] = useState("");
  const debouncedSymbol = useDebounce(symbol, 450);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!debouncedSymbol.trim()) {
      void search("");
    }
  }, [debouncedSymbol]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await search(debouncedSymbol, 1);
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1 && result && newPage <= result.totalPages) {
      await search(debouncedSymbol, newPage);
    }
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Card className="glass shadow-2xl overflow-hidden border-white/10 bg-background/60">
      <div className="border-b border-white/5 bg-background/40">
        <form className="relative flex items-center px-4" onSubmit={(event) => void onSubmit(event)}>
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for symbols, companies..."
            value={symbol}
            className="h-14 border-0 bg-transparent px-4 text-base shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          />
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
            <kbd className="bg-white/10 rounded px-2 py-1 flex items-center gap-1 font-sans"><Command className="h-3 w-3"/> K</kbd>
          </div>
        </form>
      </div>

      <CardContent className="p-0">
        <div className="p-4">
        {loading ? (
          <div className="space-y-4">
            <div className="flex gap-4 overflow-hidden">
              <Skeleton className="h-32 min-w-[200px] rounded-xl bg-white/5" />
              <Skeleton className="h-32 min-w-[200px] rounded-xl bg-white/5" />
            </div>
          </div>
        ) : result && result.results && result.results.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {!debouncedSymbol.trim() ? (
              <div className="relative group">
                <div className="flex items-center justify-between mb-3 px-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Trending Markets
                  </p>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 rounded-full bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => scrollCarousel("left")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 rounded-full bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => scrollCarousel("right")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div 
                  ref={carouselRef}
                  className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory"
                >
                  <AnimatePresence>
                  {result.results.map((item, i) => (
                    <motion.div 
                      key={item.symbol} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="min-w-[200px] sm:min-w-[240px] flex-shrink-0 snap-center rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm hover:bg-white/10 transition-all group/card relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                      <div className="relative z-10 flex justify-between items-start mb-4">
                        <div>
                          <p className="font-bold text-lg leading-none tracking-tight">{item.symbol}</p>
                          <p className="text-xs text-muted-foreground truncate w-28 mt-1">{item.companyName}</p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          disabled={isAddingWatchlist}
                          onClick={() => void onAddWatchlist(item.symbol, item.companyName)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="relative z-10 mt-auto">
                        <p className="text-xl font-bold tracking-tight">{formatCurrency(item.currentPrice)}</p>
                        <p className={`text-sm font-medium flex items-center gap-1 ${item.change >= 0 ? "text-success" : "text-destructive"}`}>
                          {item.change >= 0 ? "+" : ""}{formatPercent(item.changePercent)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-1">Search Results</p>
                <div className="grid gap-2">
                  <AnimatePresence>
                  {result.results.map((item, i) => (
                    <motion.div 
                      key={item.symbol} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 h-10 w-10 flex items-center justify-center rounded-lg group-hover:scale-105 transition-transform">
                          <p className="font-bold text-sm text-primary">{item.symbol}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{item.companyName}</p>
                          <p className={`text-xs font-medium ${item.change >= 0 ? "text-success" : "text-destructive"}`}>
                            {formatCurrency(item.currentPrice)} • {item.change >= 0 ? "+" : ""}{formatPercent(item.changePercent)}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors opacity-0 group-hover:opacity-100"
                        disabled={isAddingWatchlist}
                        onClick={() => void onAddWatchlist(item.symbol, item.companyName)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
            
            {result.totalPages > 1 && (
              <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs uppercase tracking-wider"
                  disabled={result.page <= 1 || loading}
                  onClick={() => void handlePageChange(result.page - 1)}
                >
                  <ChevronLeft className="mr-1 h-3 w-3" /> Prev
                </Button>
                <span className="text-xs font-medium text-muted-foreground">
                  Page {result.page} of {result.totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs uppercase tracking-wider"
                  disabled={result.page >= result.totalPages || loading}
                  onClick={() => void handlePageChange(result.page + 1)}
                >
                  Next <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No matches found for &quot;{symbol}&quot;</p>
          </div>
        )}
        </div>
      </CardContent>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </Card>
  );
}
