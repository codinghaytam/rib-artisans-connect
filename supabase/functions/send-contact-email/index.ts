import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  user_id?: string;
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

    const { name, email, subject, message, user_id }: ContactEmailRequest = await req.json();

    // Store the contact message in the database
    const { data, error } = await supabaseClient
      .from('contact_messages')
      .insert({
        name,
        email,
        subject,
        message,
        user_id,
        status: 'new'
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing contact message:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to store message' }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Log successful message storage
    console.log('Contact message stored successfully:', data);

    // Here you could integrate with an email service like Resend
    // For now, we'll just return success
    return new Response(
      JSON.stringify({ 
        message: 'Contact message sent successfully',
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
    console.error("Error in send-contact-email function:", error);
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