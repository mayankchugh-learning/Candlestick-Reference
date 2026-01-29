import { useState } from "react";
import { useStocks } from "@/hooks/use-stocks";
import { StockCard } from "@/components/StockCard";
import { Input } from "@/components/ui/input";
import { Search, Filter, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Stocks() {
  const [search, setSearch] = useState("");
  const [signalFilter, setSignalFilter] = useState<"BUY" | "SELL" | "NONE" | "ALL">("ALL");
  
  const { data: stocks, isLoading } = useStocks({
    search: search || undefined,
    signal: signalFilter === "ALL" ? undefined : signalFilter,
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold">Market Scanner</h2>
          <p className="text-muted-foreground">Browse all tracked stocks and their current status.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search symbol or name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card border-border/50 focus:border-primary"
            />
          </div>
          
          <div className="w-full sm:w-40">
            <Select 
              value={signalFilter} 
              onValueChange={(val) => setSignalFilter(val as any)}
            >
              <SelectTrigger className="bg-card border-border/50">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Signal" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Signals</SelectItem>
                <SelectItem value="BUY">Buy Only</SelectItem>
                <SelectItem value="SELL">Sell Only</SelectItem>
                <SelectItem value="NONE">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stocks?.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
          {stocks?.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-lg font-medium text-muted-foreground">No stocks found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
