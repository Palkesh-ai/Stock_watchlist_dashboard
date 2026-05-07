"use client";

import { Activity, BarChart3, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/format";
import { PortfolioSummary } from "@/types/finance";
import { motion } from "framer-motion";

type Props = {
  summary: PortfolioSummary;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
} as const;

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
} as const;

export function AnalyticsCards({ summary }: Props) {
  const profit = summary.totalProfit || 0;
  const isProfit = profit >= 0;
  const ProfitIcon = isProfit ? TrendingUp : TrendingDown;
  const profitColor = isProfit ? "text-success" : "text-destructive";
  const profitGlow = isProfit ? "shadow-[0_0_20px_rgba(34,197,94,0.1)] border-success/20" : "shadow-[0_0_20px_rgba(239,68,68,0.1)] border-destructive/20";
  
  const profitPercent = summary.totalInvested > 0 
    ? (profit / summary.totalInvested) * 100 
    : 0;

  return (
    <motion.section 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
    >
      <motion.div variants={item}>
        <Card className="glass hover-lift border-white/5 bg-background/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Investment</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatCurrency(summary.totalInvested)}</div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item}>
        <Card className="glass hover-lift border-white/5 bg-background/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Value</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Activity className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-gradient">{formatCurrency(summary.currentValue || summary.totalInvested)}</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className={`glass hover-lift border ${profitGlow} bg-background/50 relative overflow-hidden group`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${isProfit ? 'from-success/5' : 'from-destructive/5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit / Loss</CardTitle>
            <div className={`p-2 rounded-full ${isProfit ? 'bg-success/10' : 'bg-destructive/10'}`}>
              <ProfitIcon className={`h-4 w-4 ${profitColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold tracking-tight ${profitColor}`}>
              {formatCurrency(profit)}
            </div>
            <div className="flex flex-col gap-1 mt-1">
              <p className={`text-sm font-medium ${profitColor}`}>
                {formatPercent(profitPercent)} All time
              </p>
              {summary.totalDailyChange !== undefined && (
                <p className={`text-[10px] font-semibold flex items-center gap-1 ${summary.totalDailyChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                  Today: {formatCurrency(summary.totalDailyChange)} ({formatPercent(summary.totalDailyChangePercent || 0)})
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="glass hover-lift border-white/5 bg-background/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Holdings</CardTitle>
            <div className="p-2 bg-violet-500/10 rounded-full">
              <BarChart3 className="h-4 w-4 text-violet-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{summary.totalHoldings}</div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.section>
  );
}
