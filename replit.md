# CandleAlert - Candlestick Alert System

## Overview

CandleAlert is a stock market alert system that analyzes monthly candlestick patterns for Indian stocks and generates buy/sell signals. The application monitors stocks for specific "engulfing" patterns where a month's price movement overcomes the starting point of the previous opposite-colored month.

**Core Signal Logic:**
- **Buy Signal**: Current month is Green (Close > Open) AND Close > previous Red month's Open
- **Sell Signal**: Current month is Red (Close < Open) AND Close < previous Green month's Open

The system includes automated monthly scanning via cron jobs and manual scan triggers from the dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite with hot module replacement
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom design tokens (dark theme, deep blue palette)
- **UI Components**: Shadcn/UI (New York style) with Radix primitives
- **Animations**: Framer Motion for page transitions

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ES modules)
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Authentication**: Replit Auth (OpenID Connect) with Passport.js
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple
- **Scheduled Tasks**: node-cron for automated monthly scans (1st of each month)

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Key Tables**: stocks, alerts, settings, users, sessions, conversations, messages

### Project Structure
```
client/           # React frontend
  src/
    components/   # Reusable UI components
    pages/        # Route-based page components
    hooks/        # Custom React hooks (use-auth, use-stocks, etc.)
server/           # Express backend
  replit_integrations/  # Auth, chat, audio, image utilities
shared/           # Shared TypeScript types and schemas
  schema.ts       # Drizzle database schema
  routes.ts       # API route definitions with Zod
  models/         # Auth and chat models
```

### Build System
- Development: `tsx` for TypeScript execution with Vite dev server
- Production: esbuild bundles server, Vite builds client to `dist/`
- Database migrations: `drizzle-kit push`

## External Dependencies

### Database
- **PostgreSQL**: Primary data store via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and migrations

### Authentication
- **Replit Auth (OIDC)**: User authentication via `ISSUER_URL` and `REPL_ID`
- **Session Secret**: `SESSION_SECRET` environment variable required

### AI Services (Optional)
- **OpenAI-compatible API**: For chat and voice features via Replit AI Integrations
  - `AI_INTEGRATIONS_OPENAI_API_KEY`
  - `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `drizzle-orm` + `drizzle-zod`: Database ORM with validation
- `node-cron`: Scheduled task execution
- `framer-motion`: Animations
- `date-fns`: Date formatting
- `zod`: Runtime type validation