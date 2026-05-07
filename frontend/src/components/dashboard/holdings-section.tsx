"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Loader2, RefreshCcw, Briefcase, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addHoldingSchema, AddHoldingSchema } from "@/schemas/holdings-schema";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Holding } from "@/types/finance";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { stockService } from "@/services/api/stock.service";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  holdings: Holding[];
  loading: boolean;
  isAdding: boolean;
  onRefresh: () => Promise<void>;
  onAdd: (symbol: string, companyName: string | undefined, quantity: number, averagePrice: number) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
};

export function HoldingsSection({ holdings, loading, isAdding, onRefresh, onAdd, onRemove }: Props) {
  const [open, setOpen] = useState(false);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  
  const form = useForm<AddHoldingSchema>({
    resolver: zodResolver(addHoldingSchema),
    defaultValues: { symbol: "", companyName: "", quantity: 1, averagePrice: 0.01 }
  });

  const watchSymbol = form.watch("symbol");
  const debouncedSymbol = useDebounce(watchSymbol, 500);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!debouncedSymbol || debouncedSymbol.trim().length === 0) return;
      
      setIsFetchingPrice(true);
      try {
        const data = await stockService.search(debouncedSymbol);
        if (data && data.currentPrice) {
          setCurrentPrice(data.currentPrice);
          form.setValue("averagePrice", data.currentPrice, { shouldValidate: true });
          if (data.companyName && !form.getValues("companyName")) {
            form.setValue("companyName", data.companyName, { shouldValidate: true });
          }
        }
      } catch (error) {
        // Ignore errors if symbol is invalid/not found yet
      } finally {
        setIsFetchingPrice(false);
      }
    };

    void fetchQuote();
  }, [debouncedSymbol, form]);

  const watchQuantity = form.watch("quantity");
  const watchAveragePrice = form.watch("averagePrice");

  const submit = form.handleSubmit(async (values) => {
    await onAdd(values.symbol, values.companyName, values.quantity, values.averagePrice);
    form.reset({ symbol: "", companyName: "", quantity: 1, averagePrice: 0.01 });
    setCurrentPrice(0);
    setOpen(false);
  });

  return (
    <Card className="glass mt-8 shadow-2xl border-white/10 bg-background/60">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-background/40 pb-4">
        <CardTitle className="text-gradient flex items-center gap-2 text-lg">
          <Briefcase className="h-5 w-5 text-primary" />
          Portfolio Holdings
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={loading} 
            onClick={() => void onRefresh()}
            className="border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all h-8 hidden sm:flex"
          >
            <RefreshCcw className={`mr-2 h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="mr-1 h-3 w-3" /> Add Holding
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass-panel border-white/10 bg-background/80 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500">
                  Add New Position
                </DialogTitle>
              </DialogHeader>
              <form className="space-y-5 mt-4" onSubmit={(event) => void submit(event)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="symbol" className="text-muted-foreground font-medium text-[10px] uppercase tracking-widest flex items-center justify-between">
                    <span>Symbol</span>
                    {isFetchingPrice && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
                  </Label>
                  <Input id="symbol" placeholder="e.g. AAPL" className="bg-white/5 border-white/10 focus-visible:ring-primary/50 text-white" {...form.register("symbol")} />
                  {form.formState.errors.symbol ? (
                    <p className="text-[10px] text-destructive font-medium">{form.formState.errors.symbol.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-muted-foreground font-medium text-[10px] uppercase tracking-widest">Company Name (Optional)</Label>
                  <Input id="companyName" placeholder="e.g. Apple Inc." className="bg-white/5 border-white/10 focus-visible:ring-primary/50 text-white" {...form.register("companyName")} />
                  {form.formState.errors.companyName ? (
                    <p className="text-[10px] text-destructive font-medium">{form.formState.errors.companyName.message}</p>
                  ) : null}
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-muted-foreground font-medium text-[10px] uppercase tracking-widest">Quantity</Label>
                  <Input id="quantity" type="number" step="0.0001" className="bg-white/5 border-white/10 focus-visible:ring-primary/50 text-white" {...form.register("quantity")} />
                  {form.formState.errors.quantity ? (
                    <p className="text-[10px] text-destructive font-medium">{form.formState.errors.quantity.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avg" className="text-muted-foreground font-medium text-[10px] uppercase tracking-widest">Total Price</Label>
                  <div className="relative">
                    <Input 
                      id="avg" 
                      type="number"
                      step="0.01"
                      className="bg-white/5 border-white/10 focus-visible:ring-primary/50 text-white font-semibold"
                      {...form.register("averagePrice")}
                    />
                    <p className="text-[10px] text-muted-foreground mt-1 px-1 flex justify-between">
                      <span>Live Price: {formatCurrency(currentPrice)}</span>
                      {currentPrice > 0 && <span className="text-success font-medium">Auto-filled</span>}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="ghost" type="button" onClick={() => setOpen(false)} className="hover:bg-white/5">Cancel</Button>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md" 
                  disabled={isAdding || isFetchingPrice} 
                  type="submit"
                >
                  {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm & Save"}
                </Button>
              </div>
            </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="space-y-2 p-4">
            <Skeleton className="h-12 w-full bg-white/5 rounded-lg" />
            <Skeleton className="h-12 w-full bg-white/5 rounded-lg" />
            <Skeleton className="h-12 w-full bg-white/5 rounded-lg" />
          </div>
        ) : holdings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-b-xl bg-white/5">
            <Briefcase className="h-8 w-8 text-muted-foreground mb-3 opacity-50" />
            <p className="text-sm font-medium text-muted-foreground">No holdings yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Add your first position to start tracking your portfolio.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-muted-foreground bg-background/40">
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Asset</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider text-right">Qty</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider text-right">Avg Price</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider text-right">Today</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider text-right">Current Value</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider text-right">Total P/L</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <motion.tbody
                 initial="hidden"
                 animate="show"
                 variants={{
                   hidden: { opacity: 0 },
                   show: { opacity: 1, transition: { staggerChildren: 0.05 } }
                 }}
              >
                <AnimatePresence>
                {holdings.map((item) => {
                  const profit = item.profit || 0;
                  const isProfit = profit >= 0;
                  const profitColor = isProfit ? "text-success" : "text-destructive";
                  const profitPercent = item.investedValue > 0 ? (profit / item.investedValue) * 100 : 0;
                  
                  return (
                  <motion.tr 
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      show: { opacity: 1, x: 0 }
                    }}
                    exit={{ opacity: 0, x: -10 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group" 
                    key={item._id}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 h-8 w-8 flex items-center justify-center rounded-md">
                          <span className="font-bold text-xs text-primary">{item.symbol.substring(0,2)}</span>
                        </div>
                        <div>
                          <p className="font-bold tracking-tight">{item.symbol}</p>
                          <p className="text-[10px] text-muted-foreground truncate w-24 sm:w-32">{item.companyName || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-medium">{item.quantity}</td>
                    <td className="p-4 text-right text-muted-foreground">{formatCurrency(item.averagePrice)}</td>
                    <td className="p-4 text-right">
                       <div className="flex flex-col items-end">
                         <span className={`font-medium ${item.change && item.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                           {item.change !== undefined ? formatCurrency(item.change) : "—"}
                         </span>
                         <span className={`text-[10px] ${item.changePercent && item.changePercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                           {item.changePercent !== undefined ? formatPercent(item.changePercent) : ""}
                         </span>
                       </div>
                    </td>
                    <td className="p-4 text-right font-bold tracking-tight">
                      {item.currentValue !== undefined ? formatCurrency(item.currentValue) : formatCurrency(item.investedValue)}
                    </td>
                    <td className={`p-4 text-right`}>
                      <div className={`inline-flex flex-col items-end`}>
                        <span className={`font-bold tracking-tight ${profitColor}`}>{formatCurrency(profit)}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium mt-0.5 ${isProfit ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                           {formatPercent(profitPercent)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full hover:bg-destructive hover:text-white text-muted-foreground transition-all"
                        onClick={() => void onRemove(item._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                  );
                })}
                </AnimatePresence>
              </motion.tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
