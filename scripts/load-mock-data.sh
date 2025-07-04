#!/bin/bash

# Script to load mock data into Supabase database
# This should be run from the project root directory

echo "🚀 Loading mock data into Supabase database..."

# Check if SUPABASE_URL and SUPABASE_SERVICE_KEY are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set."
  echo "You can set them using:"
  echo "export SUPABASE_URL=your_supabase_url"
  echo "export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
  exit 1
fi

# Extract database password from service role key
DB_PASSWORD=$(echo $SUPABASE_SERVICE_ROLE_KEY | cut -d '.' -f2)

# Extract host from URL
HOST=$(echo $SUPABASE_URL | sed 's/https:\/\///' | sed 's/\.supabase\.co.*//')
DB_HOST="db.$HOST.supabase.co"

echo "🔄 Connecting to database at $DB_HOST..."

# Run the SQL script
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p 5432 -d postgres -U postgres -f supabase/mock-data.sql

# Check if the command was successful
if [ $? -eq 0 ]; then
  echo "✅ Mock data loaded successfully!"
  echo "You can now go to http://localhost:3000/artisans to see the results"
else
  echo "❌ Error loading mock data. Check the error message above."
fi
