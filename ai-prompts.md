# Future Prompts for Similar Applications

Use these prompts to generate a similar candlestick alert system or stock monitoring app:

1. **Database Schema**:
   "Design a PostgreSQL schema for a stock alert system using Drizzle ORM. Include tables for 'stocks' (symbol, price, last signal, signal reason), 'alerts' (history of signals), and 'user_settings' (notification preferences)."

2. **Signal Logic**:
   "Write a Node.js function that analyzes candlestick data. A 'Buy' signal is generated if the current month is Green (Close > Open) and the current Close is higher than the previous Red month's Open. A 'Sell' signal is generated if the current month is Red (Close < Open) and the current Close is lower than the previous Green month's Open."

3. **Automation**:
   "Create a node-cron job that runs on the 1st of every month at midnight. It should iterate through a list of stock symbols, fetch their monthly OHLV data, and update the database with new signals based on the engulfing pattern logic."

4. **Frontend Dashboard**:
   "Build a React dashboard using Tailwind CSS and Shadcn UI. It should display a list of stocks with their latest signals. Include a 'Search' filter and a 'Manual Scan' button that triggers a backend API call. Use React Query for data fetching."

5. **Infrastructure**:
   "Generate Terraform scripts for a resilient web application on AWS. Include a VPC, an Application Load Balancer, and an Auto Scaling Group with a minimum of 2 instances for high availability."
