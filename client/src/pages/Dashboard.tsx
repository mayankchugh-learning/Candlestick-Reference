import { useStocks, useRunScan } from "@/hooks/use-stocks";
import { useAlerts } from "@/hooks/use-alerts";
import { Button } from "@/components/ui/button";
import { StockCard } from "@/components/StockCard";
import { Play, TrendingUp, TrendingDown, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { data: stocks, isLoading: stocksLoading } = useStocks();
  const { data: alerts, isLoading: alertsLoading } = useAlerts();
  const { mutate: runScan, isPending: isScanning } = useRunScan();
  const { toast } = useToast();

  const handleScan = () => {
    runScan(undefined, {
      onSuccess: (data) => {
        toast({
          title: "Scan Completed",
          description: data.message,
          variant: "default", // or "success" if defined in toaster
        });
      },
      onError: () => {
        toast({
          title: "Scan Failed",
          description: "Could not complete the market scan.",
          variant: "destructive",
        });
      },
    });
  };

  const buySignals = stocks?.filter(s => s.lastSignal === "BUY") || [];
  const sellSignals = stocks?.filter(s => s.lastSignal === "SELL") || [];
  
  // Get latest 5 alerts
  const recentAlerts = alerts?.slice(0, 5) || [];

  if (stocksLoading || alertsLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Market overview and latest signals.</p>
        </div>
        <Button 
          onClick={handleScan} 
          disabled={isScanning}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
        >
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4 fill-current" /> Run Manual Scan
            </>
          )}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          title="Total Stocks" 
          value={stocks?.length || 0} 
          icon={<TrendingUp className="text-blue-400" />} 
        />
        <StatsCard 
          title="Active Buy Signals" 
          value={buySignals.length} 
          icon={<TrendingUp className="text-green-500" />} 
          trend="bullish"
        />
        <StatsCard 
          title="Active Sell Signals" 
          value={sellSignals.length} 
          icon={<TrendingDown className="text-red-500" />} 
          trend="bearish"
        />
      </div>

      {/* Recent Signals Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest Buy Signals */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Recent Buy Signals
            </h3>
            <span className="text-xs text-muted-foreground">Top 4</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {buySignals.slice(0, 4).map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
            {buySignals.length === 0 && (
              <div className="col-span-full p-8 text-center border border-dashed border-border rounded-xl text-muted-foreground">
                No active buy signals found.
              </div>
            )}
          </div>
        </section>

        {/* Latest Alerts List */}
        <section className="bg-card border border-border/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold">Recent Alerts</h3>
          </div>
          
          <div className="space-y-4">
            {recentAlerts.map((alert, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={alert.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border-l-4 border-l-transparent hover:border-l-primary"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs",
                    alert.signalType === "BUY" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                  )}>
                    {alert.signalType === "BUY" ? "B" : "S"}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{alert.symbol}</p>
                    <p className="text-xs text-muted-foreground">
                      Target Price: ₹{Number(alert.price).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-foreground">
                    {format(new Date(alert.timestamp), "MMM d, h:mm a")}
                  </p>
                  <p className="text-[10px] text-muted-foreground capitalize">
                    {alert.signalType.toLowerCase()} Signal
                  </p>
                </div>
              </motion.div>
            ))}
            {recentAlerts.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No recent alerts.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, trend }: { title: string, value: number, icon: React.ReactNode, trend?: 'bullish' | 'bearish' }) {
  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-50">
        {icon}
      </div>
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      <h3 className="text-4xl font-display font-bold text-foreground">{value}</h3>
      {trend && (
        <div className={cn(
          "inline-flex items-center text-xs font-bold mt-2 px-2 py-0.5 rounded-full",
          trend === 'bullish' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
        )}>
          {trend === 'bullish' ? "+ Monthly Bullish" : "- Monthly Bearish"}
        </div>
      )}
    </div>
  );
}
