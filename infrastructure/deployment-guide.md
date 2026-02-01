# Infrastructure Deployment Guide

This document provides technical details for deploying and managing the Candlestick Alert System's infrastructure using Terraform and AWS.

## 1. Resilience & High Availability
To ensure maximum uptime, the infrastructure follows these core principles:
- **Multi-AZ Strategy**: All resources (ALB, ASG, RDS) are spread across at least two Availability Zones.
- **Auto-Healing**: The Auto Scaling Group (ASG) uses health checks to automatically replace unhealthy instances.
- **Data Persistence**: RDS is configured with automated snapshots and multi-AZ for failover.

## 2. Terraform Implementation Details
The provided `infrastructure/main.tf` script creates:
- **VPC & Subnets**: Public subnets for the Load Balancer and private subnets for the application and database.
- **Security Groups**: Minimalist ingress rules (Port 80/443 for ALB, Port 5000 for App, Port 5432 for RDS).
- **Application Load Balancer**: Handles SSL termination (needs ACM certificate) and distributes traffic.
- **Launch Template**: Configured with User Data to install Node.js and pull the latest Docker image.

## 3. Deployment Steps
1. **Initialize Terraform**:
   ```bash
   terraform init
   ```
2. **Plan Deployment**:
   ```bash
   terraform plan -out=tfplan
   ```
3. **Apply Changes**:
   ```bash
   terraform apply "tfplan"
   ```

## 4. Scaling Recommendations
- **Horizontal Scaling**: Increase `max_size` in the ASG during high volatility periods.
- **Vertical Scaling**: Upgrade `instance_class` for RDS if the stock watchlist exceeds 10,000+ symbols.

## 5. Security Checklist
- [ ] Use AWS Secrets Manager for `DATABASE_URL` and `SESSION_SECRET`.
- [ ] Enable AWS WAF (Web Application Firewall) on the ALB.
- [ ] Ensure RDS is not publicly accessible.
