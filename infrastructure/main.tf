provider "aws" {
  region = "ap-south-1" # Mumbai for Indian Stocks
}

# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
}

# Application Load Balancer
resource "aws_alb" "app_lb" {
  name               = "candle-alert-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb_sg.id]
  subnets            = aws_subnet.public.*.id
}

# Auto Scaling Group
resource "aws_autoscaling_group" "app_asg" {
  desired_capacity     = 2
  max_size             = 4
  min_size             = 2
  vpc_zone_identifier  = aws_subnet.private.*.id
  target_group_arns    = [aws_alb_target_group.app_tg.arn]

  launch_template {
    id      = aws_launch_template.app_lt.id
    version = "$Latest"
  }
}

# RDS Database (PostgreSQL)
resource "aws_db_instance" "postgres" {
  allocated_storage    = 20
  engine               = "postgres"
  instance_class       = "db.t3.micro"
  name                 = "trading_db"
  username             = "admin"
  password             = "securepassword"
  skip_final_snapshot  = true
}

# Resilience Recommendation: 
# 1. Multi-AZ Deployment for RDS.
# 2. Min size 2 for ASG across different Availability Zones.
# 3. Health checks on ALB to automatically replace failing instances.
