import { Stock } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockCardProps {
  stock: Stock;
}

export function StockCard({ stock }: StockCardProps) {
  const isBuy = stock.lastSignal === "BUY";
  const isSell = stock.lastSignal === "SELL";

  return (
    <div className="glass-panel rounded-xl p-5 hover:border-primary/30 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {stock.symbol}
          </h3>
          <p className="text-sm text-muted-foreground truncate max-w-[120px]" title={stock.name}>
            {stock.name}
          </p>
        </div>
        <div className={cn(
          "px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1",
          isBuy ? "bg-green-500/10 text-green-500 border-green-500/20" :
          isSell ? "bg-red-500/10 text-red-500 border-red-500/20" :
          "bg-gray-500/10 text-gray-400 border-gray-500/20"
        )}>
          {isBuy && <ArrowUpRight className="w-3 h-3" />}
          {isSell && <ArrowDownRight className="w-3 h-3" />}
          {!isBuy && !isSell && <Minus className="w-3 h-3" />}
          {stock.lastSignal}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Last Price</p>
          <p className="text-xl font-mono font-medium text-foreground">
            ₹{Number(stock.lastPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
        {stock.lastSignalDate && (
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">Signal Date</p>
            <p className="text-xs font-medium text-foreground">
              {formatDistanceToNow(new Date(stock.lastSignalDate), { addSuffix: true })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
