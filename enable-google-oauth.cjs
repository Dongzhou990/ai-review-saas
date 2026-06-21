const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyeW1nbWp3bHVpZnlid3JnYmNlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTUzMDkzNCwiZXhwIjoyMDk3MTA2OTM0fQ.1FIn_FmEUba8WHgtPVMZ3-imLdpV6W4Ca29hM7Kqpz0";

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://rrymgmjwluifybwrgbce.supabase.co",
  SERVICE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  // Update auth settings using admin API
  const { data, error } = await supabase.auth.admin.updateConfig({
    external_google_enabled: true,
    site_url: "https://reviewai.chat",
    additional_redirect_urls: "https://reviewai.chat/auth/callback",
  });

  if (error) {
    console.error("Failed to enable Google OAuth:", error.message);
    process.exit(1);
  }

  console.log("✅ Google OAuth enabled!");

  // Verify
  const { data: settings } = await supabase.rpc('get_auth_config');
  console.log("Settings:", JSON.stringify(settings || {}, null, 2));
}

main().catch(console.error);
