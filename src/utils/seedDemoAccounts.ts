import { supabase } from '@/integrations/supabase/client';

export const seedDemoAccounts = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('seed-demo-accounts');
    
    if (error) {
      console.error('Error seeding demo accounts:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Demo accounts seeded:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error calling seed function:', error);
    return { success: false, error: 'Failed to call seed function' };
  }
};

export const DEMO_ACCOUNTS = {
  admin: { email: 'admin@example.com', password: '9Rib!Demo123' },
  client: { email: 'client@example.com', password: '9Rib!Demo123' },
  artisan: { email: 'artisan@example.com', password: '9Rib!Demo123' },
} as const;