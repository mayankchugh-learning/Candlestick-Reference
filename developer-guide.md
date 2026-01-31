# Developer Guide - How this React Application Works

This guide is designed for someone who is new to React and wants to understand how the Candlestick Alert System is built, so you can fix bugs and make small changes yourself.

## 1. The Big Picture
The app is split into two main parts:
- **The Frontend (Client)**: What you see in the browser. Built with **React**.
- **The Backend (Server)**: The "brain" that talks to the database. Built with **Node.js** and **Express**.

## 2. Frontend Structure (`client/src/`)

### How a Page Loads
- **`App.tsx`**: The main entry point. It handles "Routing" (deciding which page to show based on the URL).
- **`pages/Dashboard.tsx`**: This is the main screen. It fetches data from the server and displays the stock cards.

### Key Concepts
- **Components**: Small pieces of UI (like a button or a card). You can find them in `client/src/components/`.
- **Hooks (Data Fetching)**: We use **React Query**.
  - Example: `useQuery({ queryKey: ['/api/stocks'] })` in `Dashboard.tsx` fetches the stock list.
  - If the data in the database changes, React Query automatically updates the screen.
- **State**: Variables that change (like a search term). When state changes, React "re-renders" (updates) the part of the page that needs it.

## 3. Backend Structure (`server/`)

- **`routes.ts`**: This is where the API "endpoints" are defined.
  - Example: `app.get('/api/stocks', ...)` handles requests for the stock list.
- **`storage.ts`**: This is where the code actually talks to the Database. If you want to change how data is saved, look here.
- **`shared/schema.ts`**: This file defines what a "Stock" looks like (name, price, signal). If you add a new field to the database, you must add it here first.

## 4. How to Fix a Bug

### Scenario A: The UI looks wrong (Frontend)
1. Open the page in your browser.
2. Right-click and choose **Inspect** (Chrome DevTools).
3. Look at the **Console** tab for errors.
4. Find the file in `client/src/pages/` that matches the screen.
5. Change the HTML-like code (JSX) and the browser will update instantly.

### Scenario B: Data isn't loading (Backend)
1. Look at the **Network** tab in Chrome DevTools.
2. Check if the request to `/api/stocks` failed (it will be red).
3. Check the **Replit Logs** at the bottom of the screen. It will show you exactly which line of code in `server/routes.ts` or `server/storage.ts` crashed.

## 5. Important Commands
- `npm run dev`: Starts both the frontend and backend.
- `npm run db:push`: If you change `shared/schema.ts`, run this to update the database.

## 6. Understanding the Logic
The logic for "Green vs Red" is calculated during the **Scan**.
- **Green (Bullish)**: Close > Open.
- **Red (Bearish)**: Close < Open.
This logic lives in `server/routes.ts` inside the `cron.schedule` or manual scan functions.
