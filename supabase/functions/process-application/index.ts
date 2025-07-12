import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-APPLICATION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Create Supabase client with service role for admin operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify admin authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    // Check if user is admin
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const { applicationId, action, adminNotes } = await req.json();
    logStep("Processing application", { applicationId, action });

    // Get application details
    const { data: application, error: appError } = await supabaseClient
      .from("artisan_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (appError) throw new Error(`Application not found: ${appError.message}`);

    let updateData: any = {
      processed_by: user.id,
      processed_at: new Date().toISOString(),
      admin_notes: adminNotes,
    };

    switch (action) {
      case "validate":
        updateData.status = "validated";
        
        // Create artisan profile
        const { error: profileError } = await supabaseClient
          .from("artisan_profiles")
          .insert({
            user_id: application.user_id,
            category_id: application.category_id,
            city_id: application.city_id,
            business_name: application.business_name,
            description: application.description,
            experience_years: application.experience_years,
            specialties: application.specialties,
            is_verified: true,
            verification_date: new Date().toISOString(),
            is_active: true,
          });

        if (profileError) {
          logStep("Error creating artisan profile", profileError);
          throw new Error(`Failed to create artisan profile: ${profileError.message}`);
        }

        // Update user role to artisan
        await supabaseClient
          .from("profiles")
          .update({ role: "artisan" })
          .eq("id", application.user_id);

        logStep("Artisan profile created successfully");
        break;

      case "request_payment":
        updateData.status = "in_progress";
        // TODO: Send payment request email
        logStep("Payment request email sent");
        break;

      case "request_verification":
        updateData.status = "not_read";
        // TODO: Send verification email
        logStep("Verification email sent");
        break;

      case "reject":
        updateData.status = "rejected";
        // TODO: Send rejection email
        logStep("Application rejected");
        break;

      default:
        throw new Error("Invalid action");
    }

    // Update application
    const { error: updateError } = await supabaseClient
      .from("artisan_applications")
      .update(updateData)
      .eq("id", applicationId);

    if (updateError) throw new Error(`Failed to update application: ${updateError.message}`);

    logStep("Application processed successfully", { applicationId, action });

    return new Response(
      JSON.stringify({ success: true, message: "Application processed successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in process-application", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});