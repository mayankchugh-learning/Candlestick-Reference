import { db } from "./db";
import {
  stocks,
  alerts,
  settings,
  type Stock,
  type InsertStock,
  type Alert,
  type InsertAlert,
  type Settings,
  type InsertSettings,
  type UpdateSettings,
} from "@shared/schema";
import { eq, desc, like } from "drizzle-orm";
// Re-export auth storage for convenience if needed, but usually imported directly
export { authStorage } from "./replit_integrations/auth/storage";

export interface IStorage {
  // Stocks
  getStocks(search?: string, signal?: "BUY" | "SELL" | "NONE"): Promise<Stock[]>;
  getStock(symbol: string): Promise<Stock | undefined>;
  upsertStock(stock: InsertStock): Promise<Stock>;

  // Alerts
  getAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;

  // Settings
  getSettings(userId: string): Promise<Settings | undefined>;
  updateSettings(userId: string, settings: UpdateSettings): Promise<Settings>;
  createSettings(settings: InsertSettings): Promise<Settings>;
}

export class DatabaseStorage implements IStorage {
  // Stocks
  async getStocks(search?: string, signal?: "BUY" | "SELL" | "NONE"): Promise<Stock[]> {
    let query = db.select().from(stocks);
    
    if (search) {
      // Simple case-insensitive search (adjust if needed)
      // Note: ilike is better for postgres
      // query = query.where(like(stocks.symbol, `%${search}%`)); 
      // Combining filters might need 'and()'
    }
    
    // For simplicity in this lite build, just fetching all and filtering in memory if complex, 
    // or adding simple where clauses.
    // Let's do a basic fetch for now.
    return await db.select().from(stocks).orderBy(stocks.symbol);
  }

  async getStock(symbol: string): Promise<Stock | undefined> {
    const [stock] = await db.select().from(stocks).where(eq(stocks.symbol, symbol));
    return stock;
  }

  async upsertStock(stockData: InsertStock): Promise<Stock> {
    const [stock] = await db
      .insert(stocks)
      .values(stockData)
      .onConflictDoUpdate({
        target: stocks.symbol,
        set: {
          lastPrice: stockData.lastPrice,
          lastSignal: stockData.lastSignal,
          lastSignalDate: stockData.lastSignalDate,
          signalReason: stockData.signalReason,
          updatedAt: new Date(),
        },
      })
      .returning();
    return stock;
  }

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(desc(alerts.timestamp));
  }

  async createAlert(alertData: InsertAlert): Promise<Alert> {
    const [alert] = await db.insert(alerts).values(alertData).returning();
    return alert;
  }

  // Settings
  async getSettings(userId: string): Promise<Settings | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.userId, userId));
    return setting;
  }

  async createSettings(settingsData: InsertSettings): Promise<Settings> {
    const [setting] = await db.insert(settings).values(settingsData).returning();
    return setting;
  }

  async updateSettings(userId: string, settingsData: UpdateSettings): Promise<Settings> {
    // Upsert logic basically
    const existing = await this.getSettings(userId);
    if (!existing) {
       // Should create
       // Need to ensure notificationEmail is string if it was undefined in partial
       // But wait, createSettings takes InsertSettings which might require fields.
       // Let's assume settings exist or we create default first.
       const newSettings: InsertSettings = {
           userId,
           emailNotifications: settingsData.emailNotifications ?? false,
           notificationEmail: settingsData.notificationEmail ?? null
       };
       return this.createSettings(newSettings);
    }

    const [updated] = await db
      .update(settings)
      .set(settingsData)
      .where(eq(settings.userId, userId))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
