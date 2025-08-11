import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SeedResult {
  created: boolean;
  details: Array<{ email: string; role: string; status: 'created'|'existing'|'error'; error?: string }>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const demoUsers = [
      { email: 'admin@example.com',   password: '9Rib!Demo123', role: 'admin',   name: 'Admin Demo' },
      { email: 'client@example.com',  password: '9Rib!Demo123', role: 'client',  name: 'Client Demo' },
      { email: 'artisan@example.com', password: '9Rib!Demo123', role: 'artisan', name: 'Artisan Demo' },
    ];

    const results: SeedResult['details'] = [];

    for (const u of demoUsers) {
      // Check if already seeded via profiles table
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', u.email)
        .maybeSingle();

      if (existingProfile) {
        results.push({ email: u.email, role: u.role, status: 'existing' });
        continue;
      }

      // Create auth user (confirmed) with metadata
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { name: u.name, role: u.role }
      });

      if (createErr || !created?.user) {
        results.push({ email: u.email, role: u.role, status: 'error', error: createErr?.message || 'unknown error' });
        continue;
      }

      // Ensure profile row exists and matches role
      const { error: profileErr } = await supabase
        .from('profiles')
        .upsert({
          id: created.user.id,
          email: u.email,
          name: u.name,
          role: u.role,
          is_active: true,
        }, { onConflict: 'id' });

      if (profileErr) {
        results.push({ email: u.email, role: u.role, status: 'error', error: profileErr.message });
        continue;
      }

      results.push({ email: u.email, role: u.role, status: 'created' });
    }

    const payload: SeedResult = {
      created: results.some(r => r.status === 'created'),
      details: results,
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
