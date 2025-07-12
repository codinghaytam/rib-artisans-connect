import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ViewTrackingRequest {
  type: 'artisan' | 'project';
  target_id: string;
  viewer_id?: string;
  viewer_ip?: string;
  user_agent?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { type, target_id, viewer_id, viewer_ip, user_agent }: ViewTrackingRequest = await req.json();

    let data, error;

    if (type === 'artisan') {
      // Track artisan view
      ({ data, error } = await supabaseClient
        .from('artisan_views')
        .insert({
          artisan_id: target_id,
          viewer_id,
          viewer_ip,
          user_agent
        })
        .select()
        .single());
    } else if (type === 'project') {
      // Track project view
      ({ data, error } = await supabaseClient
        .from('project_views')
        .insert({
          project_id: target_id,
          viewer_id,
          viewer_ip,
          user_agent
        })
        .select()
        .single());
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid view type' }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (error) {
      console.error('Error tracking view:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to track view' }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`${type} view tracked successfully:`, data);

    return new Response(
      JSON.stringify({ 
        message: 'View tracked successfully',
        data 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in track-view function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);