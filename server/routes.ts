import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import cron from "node-cron";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // 1. Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // 2. Setup Chat
  registerChatRoutes(app);

  // 3. Automated Monthly Scan (1st of every month at midnight)
  cron.schedule('0 0 1 * *', async () => {
    console.log('Running automated monthly stock scan...');
    // In a real app, this would iterate all NSE stocks
    const dummyStocks = [
      { 
        symbol: "RELIANCE", 
        name: "Reliance Industries", 
        lastPrice: "2600.50", 
        lastSignal: "BUY",
        signalReason: "Bullish: Monthly Close (2600.50) > Open (2500.00). Price has engulfed previous Red month's opening." 
      },
      { 
        symbol: "HDFCBANK", 
        name: "HDFC Bank", 
        lastPrice: "1650.00", 
        lastSignal: "BUY",
        signalReason: "Bullish: Monthly Close (1650.00) > Open (1600.00). Price momentum is positive."
      },
    ];
    for (const s of dummyStocks) {
      await storage.upsertStock({
        symbol: s.symbol,
        name: s.name,
        lastPrice: s.lastPrice,
        lastSignal: s.lastSignal as "BUY" | "SELL" | "NONE",
        lastSignalDate: new Date(),
        signalReason: s.signalReason
      });
    }
  });

  // 4. Application Routes
  
  app.get(api.stocks.list.path, isAuthenticated, async (req, res) => {
    const { search, signal } = req.query;
    const stocks = await storage.getStocks(
      typeof search === 'string' ? search : undefined,
      signal as "BUY" | "SELL" | "NONE" | undefined
    );
    res.json(stocks);
  });

  app.get(api.stocks.get.path, isAuthenticated, async (req, res) => {
    const stock = await storage.getStock(req.params.symbol);
    if (!stock) return res.status(404).json({ message: "Stock not found" });
    res.json(stock);
  });

  // Alerts
  app.get(api.alerts.list.path, isAuthenticated, async (req, res) => {
    const alerts = await storage.getAlerts();
    res.json(alerts);
  });

  // Settings
  app.get(api.settings.get.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const settings = await storage.getSettings(userId);
    if (!settings) {
      // Return default settings
      return res.json({
        userId,
        emailNotifications: false,
        notificationEmail: (req.user as any).claims.email || "",
      });
    }
    res.json(settings);
  });

  app.patch(api.settings.update.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const input = api.settings.update.input.parse(req.body);
      const settings = await storage.updateSettings(userId, input);
      res.json(settings);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Scanner (Mock implementation for now)
  app.post(api.scan.run.path, isAuthenticated, async (req, res) => {
    // In a real app, this would fetch data from TradingView API
    // For now, let's seed some dummy data/signals
    
    const dummyStocks = [
      { symbol: "RELIANCE", name: "Reliance Industries", lastPrice: "2500.50", lastSignal: "BUY", lastSignalDate: new Date() },
      { symbol: "TCS", name: "Tata Consultancy Services", lastPrice: "3400.00", lastSignal: "NONE", lastSignalDate: new Date() },
      { symbol: "INFY", name: "Infosys", lastPrice: "1450.75", lastSignal: "SELL", lastSignalDate: new Date() },
      { symbol: "HDFCBANK", name: "HDFC Bank", lastPrice: "1600.00", lastSignal: "BUY", lastSignalDate: new Date() },
    ];

    let count = 0;
    for (const s of dummyStocks) {
      await storage.upsertStock({
        symbol: s.symbol,
        name: s.name,
        lastPrice: s.lastPrice,
        lastSignal: s.lastSignal as "BUY" | "SELL" | "NONE",
        lastSignalDate: s.lastSignalDate
      });
      
      if (s.lastSignal !== "NONE") {
         await storage.createAlert({
             symbol: s.symbol,
             signalType: s.lastSignal as "BUY" | "SELL",
             price: s.lastPrice,
         });
      }
      count++;
    }

    res.json({ message: "Scan completed", scannedCount: count });
  });
  
  // Seed initial data if empty
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
    // Basic seed to ensure stocks table isn't empty on first load
    const stocks = await storage.getStocks();
    if (stocks.length === 0) {
        await storage.upsertStock({
            symbol: "NIFTY50",
            name: "Nifty 50 Index",
            lastPrice: "22000.00",
            lastSignal: "NONE",
            lastSignalDate: new Date()
        });
    }
}
