#!/bin/bash
# Provisioning Script for Candlestick Alert System

# 1. Run Schema Push (Drizzle)
echo "Syncing database schema with Drizzle..."
npm run db:push -- --force

# 2. Apply DDL (Optional, if using raw SQL for migrations)
# PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -f db/scripts/ddl.sql

# 3. Seed Initial Data
echo "Seeding initial data..."
PGPASSWORD=$PGPASSWORD psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE -f db/scripts/dml.sql

echo "Database provisioning complete."
