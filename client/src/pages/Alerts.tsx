import { useAlerts } from "@/hooks/use-alerts";
import { format } from "date-fns";
import { Loader2, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Alerts() {
  const { data: alerts, isLoading } = useAlerts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-3xl font-display font-bold">Alert History</h2>
        <p className="text-muted-foreground">Log of all generated buy and sell signals.</p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border/50">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-sm text-muted-foreground">Status</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-muted-foreground">Symbol</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-muted-foreground">Signal</th>
                <th className="text-right py-4 px-6 font-medium text-sm text-muted-foreground">Trigger Price</th>
                <th className="text-right py-4 px-6 font-medium text-sm text-muted-foreground">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {alerts?.map((alert) => (
                <tr key={alert.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      alert.isRead ? "bg-muted-foreground/30" : "bg-primary animate-pulse"
                    )} title={alert.isRead ? "Read" : "New"} />
                  </td>
                  <td className="py-4 px-6 font-bold font-mono">{alert.symbol}</td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border",
                      alert.signalType === "BUY" 
                        ? "bg-green-500/10 text-green-500 border-green-500/20" 
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                    )}>
                      {alert.signalType}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono">
                    ₹{Number(alert.price).toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-right text-sm text-muted-foreground">
                    {format(new Date(alert.timestamp), "MMM d, yyyy HH:mm")}
                  </td>
                </tr>
              ))}
              {alerts?.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-3">
                      <Bell className="w-8 h-8 opacity-20" />
                      <p>No alerts recorded yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
