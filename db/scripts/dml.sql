-- Data Manipulation Language (DML)
-- Seed and test data for Candlestick Alert System

-- 1. Seed Initial Stocks
INSERT INTO stocks (symbol, name, last_price, last_signal, last_signal_date, signal_reason)
VALUES 
    ('RELIANCE', 'Reliance Industries', 2600.50, 'BUY', NOW(), 'Bullish: Monthly Close > Open'),
    ('HDFCBANK', 'HDFC Bank', 1650.00, 'BUY', NOW(), 'Bullish: Positive momentum'),
    ('TCS', 'Tata Consultancy Services', 3400.00, 'NONE', NOW(), NULL),
    ('INFY', 'Infosys', 1450.75, 'SELL', NOW(), 'Bearish: Negative trend')
ON CONFLICT (symbol) DO NOTHING;

-- 2. Add Initial Alerts for history
INSERT INTO alerts (stock_symbol, signal_type, price, timestamp)
VALUES 
    ('RELIANCE', 'BUY', 2600.50, NOW()),
    ('HDFCBANK', 'BUY', 1650.00, NOW()),
    ('INFY', 'SELL', 1450.75, NOW());

-- 3. Sample User Settings (Replace userId with actual sub from Replit Auth)
-- INSERT INTO settings (user_id, email_notifications, notification_email)
-- VALUES ('user_123', true, 'user@example.com');
