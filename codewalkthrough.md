# Code Walkthrough - Candlestick Alert System

## Architecture Overview
The system is built using a modern full-stack TypeScript architecture:
- **Frontend**: React with Vite, Tailwind CSS, and Shadcn UI.
- **Backend**: Express.js server.
- **Database**: PostgreSQL with Drizzle ORM.
- **Authentication**: Replit Auth (OIDC).

## Core Logic: Candlestick Pattern
The system implements a specific 2-month candlestick strategy:
- **Buy Signal**: Current month is Green (Close > Open) AND current Close > previous Red month's Open.
- **Sell Signal**: Current month is Red (Close < Open) AND current Close < previous Green month's Open.

## Key Components
- `shared/schema.ts`: Defines the database models for Stocks, Alerts, and Settings.
- `server/storage.ts`: Handles all database CRUD operations.
- `server/routes.ts`: Contains API endpoints for fetching stocks, alerts, and running scans.
- `client/src/pages/Dashboard.tsx`: Main user interface for overview and manual scan triggers.

## Automated Scanner
Located in `server/routes.ts`, the scanner iterates through tracked stocks, simulates/fetches price data, and applies the comparison logic to generate alerts.
