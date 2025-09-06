// Edge Function: admin-update-artisan
// Updates selected boolean fields on artisan_profiles with admin privileges

// @deno-types="https://esm.sh/v135/@supabase/supabase-js@2/dist/module/index.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type AllowedField = 'is_active' | 'is_verified' | 'is_featured' | 'featured_until'

interface Payload {
  artisanId: string
  patch: Partial<Record<AllowedField, boolean | string>>
}

const ALLOWED_FIELDS: AllowedField[] = ['is_active', 'is_verified', 'is_featured', 'featured_until']

Deno.serve(async (req) => {
  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Missing Supabase environment keys' }), { status: 500 })
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const { data: userRes, error: userErr } = await userClient.auth.getUser()
    if (userErr || !userRes?.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    const callerId = userRes.user.id

    // Enforce admin role
    const { data: profile, error: profileErr } = await adminClient
      .from('profiles')
      .select('id, role')
      .eq('id', callerId)
      .maybeSingle()

    if (profileErr) {
      console.error('Role check error:', profileErr)
      return new Response(JSON.stringify({ error: 'Failed role check' }), { status: 500 })
    }
    if (!profile || profile.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
    }

    const body = (await req.json()) as Payload
    if (!body?.artisanId || !body?.patch) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 })
    }

    // Whitelist patch
    const sanitized: Record<string, unknown> = {}
    for (const key of Object.keys(body.patch) as AllowedField[]) {
      if (ALLOWED_FIELDS.includes(key)) sanitized[key] = body.patch[key]
    }
    if (Object.keys(sanitized).length === 0) {
      return new Response(JSON.stringify({ error: 'No allowed fields to update' }), { status: 400 })
    }

    const { error: updateErr } = await adminClient
      .from('artisan_profiles')
      .update({ ...sanitized, updated_at: new Date().toISOString() })
      .eq('id', body.artisanId)

    if (updateErr) {
      console.error('Update error:', updateErr)
      return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('Unhandled error in admin-update-artisan:', e)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
})
