// Supabase Edge Function: process-application
// Actions supported: request_verification, request_payment, validate, reject
// - Always updates artisan_applications.status and admin_notes
// - Sets processed_by/processed_at
// - On 'validate': upsert into artisan_profiles using fields from application

// @deno-types="https://esm.sh/v135/@supabase/supabase-js@2/dist/module/index.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type Action = 'request_verification' | 'request_payment' | 'validate' | 'reject'

interface ProcessPayload {
	applicationId: string
	action: Action
	adminNotes?: string
}

Deno.serve(async (req) => {
	try {
		const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
		const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
		const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

		if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
			return new Response(JSON.stringify({ error: 'Missing Supabase environment keys' }), { status: 500 })
		}

		const authHeader = req.headers.get('Authorization')
		if (!authHeader) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
		}

		// Client bound to the caller's JWT to identify user
		const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
			global: { headers: { Authorization: authHeader } },
		})
		// Admin client for privileged DB writes
		const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

		const { data: userRes } = await userClient.auth.getUser()
		const caller = userRes?.user
		if (!caller) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
		}

		// Check caller is admin
		const { data: profile, error: profileErr } = await adminClient
			.from('profiles')
			.select('id, role')
			.eq('id', caller.id)
			.maybeSingle()

		if (profileErr) {
			console.error('Profile fetch error:', profileErr)
			return new Response(JSON.stringify({ error: 'Failed to verify role' }), { status: 500 })
		}
		if (!profile || profile.role !== 'admin') {
			return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
		}

		const payload = (await req.json()) as ProcessPayload
		const { applicationId, action, adminNotes } = payload
		if (!applicationId || !action) {
			return new Response(JSON.stringify({ error: 'Missing applicationId or action' }), { status: 400 })
		}

		// Fetch application
		const { data: app, error: appErr } = await adminClient
			.from('artisan_applications')
			.select('*')
			.eq('id', applicationId)
			.maybeSingle()

		if (appErr || !app) {
			console.error('Application fetch error:', appErr)
			return new Response(JSON.stringify({ error: 'Application not found' }), { status: 404 })
		}

		// Update application status/notes and processed fields
		const { error: updateErr } = await adminClient
			.from('artisan_applications')
			.update({
				status: action === 'validate' ? 'validated' : action === 'reject' ? 'rejected' : 'in_progress',
				admin_notes: adminNotes ?? app.admin_notes ?? null,
				processed_by: caller.id,
				processed_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})
			.eq('id', applicationId)

		if (updateErr) {
			console.error('Application update error:', updateErr)
			return new Response(JSON.stringify({ error: 'Failed to update application' }), { status: 500 })
		}

		// On validate, upsert artisan profile
		if (action === 'validate') {
			if (!app.user_id) {
				return new Response(JSON.stringify({ error: 'Application has no user_id' }), { status: 400 })
			}

			// Upsert profile record
			const profilePayload = {
				user_id: app.user_id,
				business_name: app.business_name ?? null,
				category_id: app.category_id ?? null,
				city_id: app.city_id ?? null,
				description: app.description ?? null,
				specialties: app.specialties ?? [],
				// Defaults from schema
				is_verified: true, // mark verified upon validation
				updated_at: new Date().toISOString(),
			}

			// Try update first
			const { error: updErr } = await adminClient
				.from('artisan_profiles')
				.update(profilePayload)
				.eq('user_id', app.user_id)

			if (updErr) {
				console.warn('Update existing profile failed, will try insert:', updErr)
			}

			// If no row was updated, insert
			const { data: existing, error: checkErr } = await adminClient
				.from('artisan_profiles')
				.select('id')
				.eq('user_id', app.user_id)
				.maybeSingle()

			if (checkErr) {
				console.error('Check existing profile error:', checkErr)
				return new Response(JSON.stringify({ error: 'Failed to verify profile state' }), { status: 500 })
			}

			if (!existing) {
				const { error: insErr } = await adminClient
					.from('artisan_profiles')
					.insert([{ ...profilePayload, created_at: new Date().toISOString() }])

				if (insErr) {
					console.error('Insert artisan profile error:', insErr)
					return new Response(JSON.stringify({ error: 'Failed to create artisan profile' }), { status: 500 })
				}
			}
		}

		return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
	} catch (e) {
		console.error('Unhandled error in process-application:', e)
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
	}
})
