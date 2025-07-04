# Database Setup Instructions

## Running the Mock Data

To populate your Supabase database with sample data for testing the artisans page, follow these steps:

### Prerequisites

1. Make sure you have a Supabase project set up
2. Ensure the database schema is already applied (should be done via migrations)

### Option 1: Via Supabase Dashboard

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy the contents of `supabase/mock-data.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the script

### Option 2: Via Supabase CLI

1. Make sure you have the Supabase CLI installed
2. Run the following command from the project root:
   ```bash
   supabase db reset
   ```
   This will reset the database and apply all migrations, then you can run:
   ```bash
   supabase db push
   ```

3. Then execute the mock data script:
   ```bash
   psql -h db.xkcbblzskrlfwkkoruuy.supabase.co -p 5432 -d postgres -U postgres -f supabase/mock-data.sql
   ```

### Option 3: Via psql (Direct Connection)

If you have direct database access:
```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.xkcbblzskrlfwkkoruuy.supabase.co:5432/postgres" -f supabase/mock-data.sql
```

## What the Mock Data Contains

The script will populate the following tables:

### Categories (8 entries)
- Plomberie (🔧)
- Électricité (⚡)
- Menuiserie (🔨)
- Peinture (🎨)
- Maçonnerie (🧱)
- Carrelage (🏠)
- Jardinage (🌱)
- Climatisation (❄️)

### Cities (10 major Moroccan cities)
- Casablanca, Rabat, Marrakech, Fès, Tangier, Agadir, Meknès, Oujda, Kenitra, Tétouan

### Artisan Profiles (10 sample artisans)
Each artisan includes:
- Complete profile information
- Category specialization
- City location
- Ratings and reviews
- Experience and certifications
- Contact information
- Portfolio images
- Hourly rates

## Features Tested

After running this mock data, you can test:

1. **Search functionality**: Search by artisan name, business name, or city
2. **Category filtering**: Filter artisans by their specialization
3. **City filtering**: Filter artisans by location
4. **Rating display**: See ratings and review counts
5. **Verification badges**: Some artisans are verified, others are not
6. **Featured artisans**: Some artisans have featured status
7. **Contact functionality**: Phone numbers for contact

## Important Notes

- The script includes proper Row Level Security (RLS) policies for public access
- All data is sample/fake data for testing purposes
- Phone numbers are formatted for Morocco (+212)
- Images are sourced from Unsplash for testing
- The script will truncate existing data, so use with caution in production

### Foreign Key Constraint Workaround

**Important:** The script temporarily disables triggers on the `profiles` table to bypass the foreign key constraint to `auth.users`. This is necessary for testing purposes because:

1. The `profiles` table has a foreign key constraint to `auth.users`
2. In a real production environment, users are created via Supabase Auth, which automatically creates entries in both tables
3. For testing/development, we need to insert mock profiles without corresponding auth users

**How it works:**
- `ALTER TABLE public.profiles DISABLE TRIGGER ALL;` - This temporarily disables all triggers on the profiles table
- After inserting the mock data, we re-enable the triggers with `ALTER TABLE public.profiles ENABLE TRIGGER ALL;`

**Security Note:** This workaround should ONLY be used in development/testing environments, never in production.

## Development

To work with this data in development:

1. Start your development server: `npm run dev`
2. Navigate to the Artisans page
3. Test search and filtering functionality
4. Verify that data loads from Supabase instead of mock data

## Troubleshooting

If you encounter issues:

1. Check that your Supabase connection is properly configured
2. Verify that the database schema migrations have been applied
3. Ensure RLS policies are correctly set up
4. Check the browser console for any JavaScript errors
5. Verify the network requests are going to the correct Supabase endpoint
