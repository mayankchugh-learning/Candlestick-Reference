import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// Helper for type inference
type StockListResponse = z.infer<typeof api.stocks.list.responses[200]>;
type StockGetResponse = z.infer<typeof api.stocks.get.responses[200]>;
type ScanResponse = z.infer<typeof api.scan.run.responses[200]>;

export function useStocks(filters?: { search?: string; signal?: "BUY" | "SELL" | "NONE" }) {
  // Construct query params string manually for React Query key stability
  const queryParams = new URLSearchParams();
  if (filters?.search) queryParams.set("search", filters.search);
  if (filters?.signal && filters.signal !== "NONE") queryParams.set("signal", filters.signal);
  
  return useQuery({
    queryKey: [api.stocks.list.path, filters],
    queryFn: async () => {
      let url = api.stocks.list.path;
      if (filters) {
        const params = new URLSearchParams();
        if (filters.search) params.append("search", filters.search);
        if (filters.signal) params.append("signal", filters.signal);
        if (params.toString()) url += `?${params.toString()}`;
      }

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stocks");
      return api.stocks.list.responses[200].parse(await res.json());
    },
  });
}

export function useStock(symbol: string) {
  return useQuery({
    queryKey: [api.stocks.get.path, symbol],
    queryFn: async () => {
      const url = buildUrl(api.stocks.get.path, { symbol });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) throw new Error("Stock not found");
      if (!res.ok) throw new Error("Failed to fetch stock details");
      return api.stocks.get.responses[200].parse(await res.json());
    },
    enabled: !!symbol,
  });
}

export function useRunScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.scan.run.path, {
        method: api.scan.run.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to run scan");
      return api.scan.run.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.stocks.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.alerts.list.path] });
    },
  });
}
