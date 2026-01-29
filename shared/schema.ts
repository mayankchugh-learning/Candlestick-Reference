import { pgTable, text, serial, integer, boolean, timestamp, numeric, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export Auth and Chat models
export * from "./models/auth";
export * from "./models/chat";

// Import users for foreign keys
import { users } from "./models/auth";

// === STOCK DATA ===
export const stocks = pgTable("stocks", {
  symbol: text("symbol").primaryKey(),
  name: text("name").notNull(),
  lastPrice: numeric("last_price").notNull(),
  lastSignal: text("last_signal", { enum: ["BUY", "SELL", "NONE"] }).default("NONE").notNull(),
  lastSignalDate: timestamp("last_signal_date"),
  signalReason: text("signal_reason"), // Why Green (Bullish) or Red (Bearish)
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === ALERTS ===
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  signalType: text("signal_type", { enum: ["BUY", "SELL"] }).notNull(),
  price: numeric("price").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  isRead: boolean("is_read").default(false).notNull(),
});

// === USER SETTINGS ===
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  emailNotifications: boolean("email_notifications").default(false).notNull(),
  notificationEmail: text("notification_email"),
});

// === SCHEMAS ===
export const insertStockSchema = createInsertSchema(stocks);
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, timestamp: true, isRead: true });
export const insertSettingsSchema = createInsertSchema(settings).omit({ id: true, userId: true });

// === TYPES ===
export type Stock = typeof stocks.$inferSelect;
export type InsertStock = z.infer<typeof insertStockSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type UpdateSettings = Partial<InsertSettings>;
