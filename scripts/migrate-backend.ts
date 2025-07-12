import { createClient } from '@supabase/supabase-js';

// Old project configuration
const OLD_SUPABASE_URL = 'YOUR_OLD_PROJECT_URL';
const OLD_SUPABASE_KEY = 'YOUR_OLD_SERVICE_ROLE_KEY';

// New project configuration
const NEW_SUPABASE_URL = 'https://xkcbblzskrlfwkkoruuy.supabase.co';
const NEW_SUPABASE_KEY = 'YOUR_NEW_SERVICE_ROLE_KEY';

const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_KEY);
const newSupabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_KEY);

async function migrateTable(tableName: string) {
  console.log(`Migrating ${tableName}...`);
  
  // Export data from old project
  const { data: oldData, error: exportError } = await oldSupabase
    .from(tableName)
    .select('*');
    
  if (exportError) {
    console.error(`Error exporting ${tableName}:`, exportError);
    return;
  }
  
  if (!oldData || oldData.length === 0) {
    console.log(`No data found in ${tableName}`);
    return;
  }
  
  // Import data to new project
  const { error: importError } = await newSupabase
    .from(tableName)
    .insert(oldData);
    
  if (importError) {
    console.error(`Error importing ${tableName}:`, importError);
  } else {
    console.log(`Successfully migrated ${oldData.length} records from ${tableName}`);
  }
}

async function migrateBackend() {
  try {
    // Migrate tables in dependency order
    const tables = [
      'categories',
      'cities', 
      'profiles',
      'artisan_profiles',
      'artisan_applications',
      'projects',
      'proposals',
      'messages',
      'notifications',
      'reviews',
      'favorites',
      'contact_messages',
      'artisan_views',
      'project_views'
    ];
    
    for (const table of tables) {
      await migrateTable(table);
    }
    
    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migration
migrateBackend();