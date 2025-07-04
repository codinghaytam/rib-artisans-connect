# Database Setup Instructions

## Using the Mock Data

This project uses Supabase as the backend and requires special handling for the mock data.

## Problem: Foreign Key Constraint

The error you're seeing:
```
ERROR: 23503: insert or update on table "profiles" violates foreign key constraint "profiles_id_fkey"
DETAIL: Key (id)=(750e8400-e29b-41d4-a716-446655440001) is not present in table "users".
```

This happens because:
- The `profiles` table has a foreign key constraint to the `auth.users` table
- We're trying to insert profiles without corresponding users in Supabase Auth

## Solution: Temporarily Disable Constraints

The updated `mock-data.sql` script:
1. Temporarily disables triggers on the `profiles` table
2. Inserts the test data
3. Re-enables the triggers

## How to Run the Script

### Option 1: Supabase SQL Editor (Recommended)

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy the entire content of `supabase/mock-data.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the script

### Option 2: Using psql

```bash
psql "postgres://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres" -f supabase/mock-data.sql
```

## Production vs. Development

In production:
- Users should be created through Supabase Auth
- Profiles are created automatically through database triggers
- The foreign key constraint ensures data integrity

For development/testing:
- We temporarily disable the constraint
- Insert test data directly
- Re-enable the constraint

## Creating Real Users Instead

If you prefer to create real users:

1. Sign up users through the Supabase Auth UI or API
2. Use the returned user IDs to create artisan profiles
3. The foreign key constraint will be satisfied naturally

## Warning

Do NOT run this script in production as it:
1. Truncates existing tables
2. Temporarily disables constraints
3. Inserts test data that isn't properly linked to auth users

This is solely for development and testing purposes.
