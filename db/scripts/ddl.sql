-- Data Definition Language (DDL)
-- Generated from Drizzle Schema

-- 1. Create Users Table (Replit Auth)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- 2. Create Stocks Table
CREATE TABLE IF NOT EXISTS stocks (
    symbol TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    last_price NUMERIC NOT NULL,
    last_signal TEXT DEFAULT 'NONE' NOT NULL CHECK (last_signal IN ('BUY', 'SELL', 'NONE')),
    last_signal_date TIMESTAMP,
    signal_reason TEXT,
    signal_history JSONB DEFAULT '[]',
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    stock_symbol TEXT NOT NULL REFERENCES stocks(symbol),
    signal_type TEXT NOT NULL CHECK (signal_type IN ('BUY', 'SELL')),
    price NUMERIC NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- 4. Create Settings Table
CREATE TABLE IF NOT EXISTS settings (
    user_id TEXT PRIMARY KEY,
    email_notifications BOOLEAN DEFAULT FALSE,
    notification_email TEXT
);

-- 5. Create Sessions Table (for Express sessions)
CREATE TABLE IF NOT EXISTS "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
) WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "session" ("expire");
