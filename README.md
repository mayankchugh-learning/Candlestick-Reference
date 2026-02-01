# Candlestick Alert System - Setup & Deployment

## Overview
CandleAlert is a stock market alert system for Indian stocks, analyzing monthly candlestick patterns to generate signals.

## Local Setup
1. **Prerequisites**: Node.js 20+, PostgreSQL.
2. **Installation**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   Create a `.env` file with:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `SESSION_SECRET`: A secure random string for sessions.
4. **Database Setup**:
   ```bash
   npm run db:push
   ```
5. **Start Application**:
   ```bash
   npm run dev
   ```

## Docker Deployment
1. **Build and Start**:
   ```bash
   docker-compose up --build
   ```
2. The app will be available at `http://localhost:5000`.

## Cloud Infrastructure (Terraform)
Refer to `infrastructure/main.tf` for AWS-based Terraform scripts including:
- VPC and Subnets
- Application Load Balancer (ALB)
- Auto Scaling Group (ASG)
- RDS PostgreSQL Instance
